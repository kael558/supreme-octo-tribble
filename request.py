'''import requests
import urllib.request

prompt = "A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation"

url = "https://api.newnative.ai/stable-diffusion?prompt={}".format(prompt)

response = requests.request("GET", url)
data = response.json()
image_url = data["image_url"]


urllib.request.urlretrieve(image_url, "local-filename1.jpg")
'''

import requests
import json
from io import BytesIO
from PIL import Image
import base64

with open('data.json', 'w') as f:
    r = requests.post(url='https://6302eb003e3e93e3.gradio.app/run/predict', json={"data": ['A happy little girl in a cardboard box decorated as a spaceship, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation']})
    result = r.json()
    json.dump(result, f)

    print(result['data'])



    tensor = result['data']['tensor_data'][]
    im = Image.open(BytesIO(base64.b64decode(result['data'][])))
    im.save('test.png')


'''with open('data.json', 'r') as f:
    result = json.load(f)
    im = Image.open(BytesIO(base64.b64decode(result['data'][0].split(',', 1)[1])))
    im.save('test1.png')'''



'''def render_interpolation(args, anim_args):
    # animations use key framed prompts
    args.prompts = animation_prompts

    # create output folder for the batch
    os.makedirs(args.outdir, exist_ok=True)
    print(f"Saving animation frames to {args.outdir}")

    # save settings for the batch
    settings_filename = os.path.join(args.outdir, f"{args.timestring}_settings.txt")
    with open(settings_filename, "w+", encoding="utf-8") as f:
        s = {**dict(args.__dict__), **dict(anim_args.__dict__)}
        json.dump(s, f, ensure_ascii=False, indent=4)
    
    # Interpolation Settings
    args.n_samples = 1
    args.seed_behavior = 'fixed' # force fix seed at the moment bc only 1 seed is available
    prompts_c_s = [] # cache all the text embeddings

    print(f"Preparing for interpolation of the following...")

    for i, prompt in animation_prompts.items():
      args.prompt = prompt

      # sample the diffusion model
      results = generate(args, return_c=True)
      c, image = results[0], results[1]
      prompts_c_s.append(c) 
      
      # display.clear_output(wait=True)
      display.display(image)
      
      args.seed = next_seed(args)

    display.clear_output(wait=True)
    print(f"Interpolation start...")


    frame_idx = 0

    if anim_args.interpolate_key_frames:
      for i in range(len(prompts_c_s)-1):
        dist_frames = list(animation_prompts.items())[i+1][0] - list(animation_prompts.items())[i][0]
        if dist_frames <= 0:
          print("key frames duplicated or reversed. interpolation skipped.")
          return
        else:
          for j in range(dist_frames):
            # interpolate the text embedding
            prompt1_c = prompts_c_s[i]
            prompt2_c = prompts_c_s[i+1]  
            args.init_c = prompt1_c.add(prompt2_c.sub(prompt1_c).mul(j * 1/dist_frames))

            # sample the diffusion model
            results = generate(args)
            image = results[0]

            filename = f"{args.timestring}_{frame_idx:05}.png"
            image.save(os.path.join(args.outdir, filename))
            frame_idx += 1

            display.clear_output(wait=True)
            display.display(image)

            args.seed = next_seed(args)
    else:
      for i in range(len(prompts_c_s)-1):
        for j in range(anim_args.interpolate_x_frames+1):
          # interpolate the text embedding
          prompt1_c = prompts_c_s[i]
          prompt2_c = prompts_c_s[i+1]  
          args.init_c = prompt1_c.add(prompt2_c.sub(prompt1_c).mul(j * 1/(anim_args.interpolate_x_frames+1)))

          # sample the diffusion model
          results = generate(args)
          image = results[0]

          filename = f"{args.timestring}_{frame_idx:05}.png"
          image.save(os.path.join(args.outdir, filename))
          frame_idx += 1

          display.clear_output(wait=True)
          display.display(image)

          args.seed = next_seed(args)

    # generate the last prompt
    args.init_c = prompts_c_s[-1]
    results = generate(args)
    image = results[0]
    filename = f"{args.timestring}_{frame_idx:05}.png"
    image.save(os.path.join(args.outdir, filename))

    display.clear_output(wait=True)
    display.display(image)
    args.seed = next_seed(args)

    #clear init_c
    args.init_c = None'''

#namespace(C=4, H=512, W=512, batch_name='StableFun', ddim_eta=0, display_samples=True, dynamic_threshold=None, f=8, 
# filename_format='{timestring}_{index}_{prompt}.png', grid_rows=2, init_c=None, init_image=None, init_latent=None, 
# init_sample=None, invert_mask=False, log_weighted_subprompts=False, make_grid=False, mask_brightness_adjust=1.0, 
# mask_contrast_adjust=1.0, mask_file='https://www.filterforge.com/wiki/images/archive/b/b7/20080927223728%21Polygonal_gradient_thumb.jpg', 
# mask_overlay_blur=5, n_batch=1, n_samples=1, normalize_prompt_weights=True, 
# outdir='/content/drive/MyDrive/AI/StableDiffusion/2022-11/StableFun', overlay_mask=True, precision='autocast', prompt='', 
# prompt_weighting=False, sampler='klms', save_sample_per_step=False, save_samples=False, save_settings=False, scale=7, 
# seed=3776380560, seed_behavior='iter', show_sample_per_step=False, static_threshold=None, steps=30, strength=0.0, 
# strength_0_no_init=True, timestring='20221113143424', use_alpha_as_mask=False, use_init=False, use_mask=False)


#namespace(angle='0:(0)', animation_mode='Interpolation', border='replicate', color_coherence='Match Frame 0 LAB', 
# contrast_schedule='0: (1.0)', diffusion_cadence='1', extract_nth_frame=1, far_plane=10000, flip_2d_perspective=False, 
# fov=40, interpolate_key_frames=True, interpolate_x_frames=4, max_frames=20, midas_weight=0.3, near_plane=200, 
# noise_schedule='0: (0.02)', overwrite_extracted_frames=True, padding_mode='border', perspective_flip_fv='0:(53)', 
# perspective_flip_gamma='0:(0)', perspective_flip_phi='0:(t%15)', perspective_flip_theta='0:(0)', resume_from_timestring=False, 
# resume_timestring='20220829210106', rotation_3d_x='0:(0)', rotation_3d_y='0:(0)', rotation_3d_z='0:(0)', sampling_mode='bicubic', 
# save_depth_maps=False, strength_schedule='0: (0.65)', translation_x='0:(10*sin(2*3.14*t/10))', translation_y='0:(0)', 
# translation_z='0:(10)', use_depth_warping=True, use_mask_video=False, video_init_path='/content/video_in.mp4', 
# video_mask_path='/content/video_in.mp4', zoom='0:(1.04)')