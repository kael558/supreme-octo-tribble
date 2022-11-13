import os
#from animation import DeformAnimKeys, anim_frame_warp_2d, sample_from_cv2, sample_to_cv2, maintain_colors, add_noise, next_seed
#from helpers import DepthModel, sampler_fn
#import cv2
import numpy as np
import pandas as pd

import requests
import urllib.request

models_path = "/content/models"  # @param {type:"string"}
output_path = "/content/output"  # @param {type:"string"}

#os.makedirs(models_path, exist_ok=True)
#os.makedirs(output_path, exist_ok=True)

model_config = "v1-inference.yaml"
model_checkpoint =  "sd-v1-4.ckpt"

ckpt_config_path = "./stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
ckpt_path = os.path.join(models_path, model_checkpoint)

half_precision = True

#import win32api
from flask import Flask, render_template, url_for, request, jsonify

app = Flask(__name__)



#Using the below, the popup message appears on the page load of index.html
#0x00001000 - This makes the popup appear over the browser window
@app.route('/')
def index():
    #win32api.MessageBox(0, 'You have just run a python script on the page load!', 'Running a Python Script via Javascript', 0x00001000)
    return render_template('index.html')

#Using the below, the popup message appears when the button is clicked on the webpage.
#0x00001000 - This makes the popup appear over the browser window
@app.route('/test')
def test():
    #win32api.MessageBox(0, 'You have just run a python script on the button press!', 'Running a Python Script via Javascript', 0x00001000)
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    '''
    Given a prompt return the image url of a generated image
    '''
    data = request.get_json()
    prompt = data['prompt']
    url = "https://api.newnative.ai/stable-diffusion?prompt={}".format(prompt)

    response = requests.request("GET", url)
    data = response.json()
    image_url = data["image_url"]

    results = {'image_url': image_url}
    return jsonify(results)


@app.route('/render_animation', methods=['POST'])
def render_animation():
    """
    Input args:
     - prompts: [{


     }]
     - animation settings  

     animation_prompts = {
    0: "a beautiful apple, trending on Artstation",
    20: "a beautiful banana, trending on Artstation",
    30: "a beautiful coconut, trending on Artstation",
    40: "a beautiful durian, trending on Artstation",
}
    """
    data = request.get_json()

    args = data.args
    anim_args = data.anim_args

    # expand key frame strings to values
    keys = DeformAnimKeys(anim_args)

    # expand prompts out to per-frame
    animation_prompts = {}
    for prompt in args.prompts:
        animation_prompts[prompt.keyframe] = prompt.image;
    
    # expand prompts out to per-frame
    prompt_series = pd.Series([np.nan for a in range(anim_args.max_frames)])
    for i, prompt in animation_prompts.items():
        prompt_series[int(i)] = prompt
    prompt_series = prompt_series.ffill().bfill()

    # state for interpolating between diffusion steps
    turbo_steps = args.diffusion_cadence
    turbo_prev_image, turbo_prev_frame_idx = None, 0
    turbo_next_image, turbo_next_frame_idx = None, 0

    args.n_samples = 1
    frame_idx = 0
    while frame_idx < args.max_frames:
        print(f"Rendering animation frame {frame_idx} of {args.max_frames}")
        noise = keys.noise_schedule_series[frame_idx]
        strength = keys.strength_schedule_series[frame_idx]
        contrast = keys.contrast_schedule_series[frame_idx]
        depth = None

        # emit in-between frames
        if turbo_steps > 1:
            tween_frame_start_idx = max(0, frame_idx-turbo_steps)
            for tween_frame_idx in range(tween_frame_start_idx, frame_idx):
                tween = float(tween_frame_idx - tween_frame_start_idx + 1) / float(frame_idx - tween_frame_start_idx)
                print(f"  creating in between frame {tween_frame_idx} tween:{tween:0.2f}")

                advance_prev = turbo_prev_image is not None and tween_frame_idx > turbo_prev_frame_idx
                advance_next = tween_frame_idx > turbo_next_frame_idx

                if advance_prev:
                    turbo_prev_image = anim_frame_warp_2d(turbo_prev_image, args, anim_args, keys, tween_frame_idx)
                if advance_next:
                    turbo_next_image = anim_frame_warp_2d(turbo_next_image, args, anim_args, keys, tween_frame_idx)
              
                turbo_prev_frame_idx = turbo_next_frame_idx = tween_frame_idx

                if turbo_prev_image is not None and tween < 1.0:
                    img = turbo_prev_image*(1.0-tween) + turbo_next_image*tween
                else:
                    img = turbo_next_image

                filename = f"{args.timestring}_{tween_frame_idx:05}.png"
                cv2.imwrite(os.path.join(args.outdir, filename), cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_RGB2BGR))
            if turbo_next_image is not None:
                prev_sample = sample_from_cv2(turbo_next_image)

        # apply transforms to previous frame
        if prev_sample is not None:

            prev_img = anim_frame_warp_2d(sample_to_cv2(prev_sample), args, anim_args, keys, frame_idx)

            # apply color matching
            if anim_args.color_coherence != 'None':
                if color_match_sample is None:
                    color_match_sample = prev_img.copy()
                else:
                    prev_img = maintain_colors(prev_img, color_match_sample, anim_args.color_coherence)

            # apply scaling
            contrast_sample = prev_img * contrast
            # apply frame noising
            noised_sample = add_noise(sample_from_cv2(contrast_sample), noise)

            # use transformed previous frame as init for current
            args.use_init = True
            if half_precision:
                args.init_sample = noised_sample.half().to(device)
            else:
                args.init_sample = noised_sample.to(device)
            args.strength = max(0.0, min(1.0, strength))

        # grab prompt for current frame
        args.prompt = prompt_series[frame_idx]
        print(f"{args.prompt} {args.seed}")

        print(f"Angle: {keys.angle_series[frame_idx]} Zoom: {keys.zoom_series[frame_idx]}")
        print(f"Tx: {keys.translation_x_series[frame_idx]} Ty: {keys.translation_y_series[frame_idx]} Tz: {keys.translation_z_series[frame_idx]}")
        print(f"Rx: {keys.rotation_3d_x_series[frame_idx]} Ry: {keys.rotation_3d_y_series[frame_idx]} Rz: {keys.rotation_3d_z_series[frame_idx]}")


        # sample the diffusion model
        sample, image = generate(args, frame_idx, return_latent=False, return_sample=True)
        prev_sample = sample

        if turbo_steps > 1:
            turbo_prev_image, turbo_prev_frame_idx = turbo_next_image, turbo_next_frame_idx
            turbo_next_image, turbo_next_frame_idx = sample_to_cv2(sample, type=np.float32), frame_idx
            frame_idx += turbo_steps
        else:    
            filename = f"{args.timestring}_{frame_idx:05}.png"
            image.save(os.path.join(args.outdir, filename))
            frame_idx += 1

        display.clear_output(wait=True)
        display.display(image)

        args.seed = next_seed(args)

    

if __name__ == "__main__":
    app.run(debug=True)




