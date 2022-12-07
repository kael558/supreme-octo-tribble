import base64
from io import BytesIO

import os
from PIL import Image
import numpy as np
from pathlib import Path
import gradio as gr

import warnings

warnings.filterwarnings("ignore")


def clone_args():
  args = SimpleNamespace(**args_dict)
  args.steps = 20
  args.timestring = time.strftime('%Y%m%d%H%M%S')
  args.strength = max(0.0, min(1.0, args.strength))
  args.diffusion_cadence = 6

  if args.seed == -1:
      args.seed = random.randint(0, 2**32 - 1)
  if not args.use_init:
      args.init_image = None
  if args.sampler != 'ddim':
      args.ddim_eta = 0

  return args


def generate_drawing(text):
    args = clone_args()
    args.seed = random.randint(0, 2**32 - 1)
    args.prompt = text
    results = generate(args, return_c=True)
    c, image = results[0], results[1]
    size = c.size()

    flatten = torch.flatten(c)

    arr = flatten.cpu().detach().numpy().tolist()

    json_tensor = json.dumps(arr)
    json_size = json.dumps(size)

    tensor = {'tensor_data': {'tensor': json_tensor, 'size': json_size}}
    display.clear_output(wait=True)
    #print(image)

    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())

    return (tensor, img_str)


def generate_interpolated_images(obj1, obj2):
    args = clone_args()
    args.seed_behavior = 'fixed'

    dist_frames = obj2['keyframe'] - obj1['keyframe']

    arr1 = np.array(json.loads(obj1['tensor']))
    size1 = json.loads(obj1['size'])

    reshaped_arr1 = arr1.reshape(size1)
    prompt1_c = (torch.from_numpy(reshaped_arr1)).float().cuda()

    arr2 = np.array(json.loads(obj2['tensor']))
    size2 = json.loads(obj2['size'])
    prompt2_c = (torch.from_numpy(arr2.reshape(size2))).float().cuda()


    images = []
    for j in range(1, dist_frames):
        
        # interpolate the text embedding
        args.init_c = prompt1_c.add(prompt2_c.sub(prompt1_c).mul(j * 1/dist_frames))

        # sample the diffusion model
        results = generate(args)

        image = results[0]
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())

        images.append(img_str)

        print(j)
        display.display(image)
        #print(img_str)

        args.seed = next_seed(args)
    return str(images)


img_demo = gr.Interface(
    description="Stable Diffusion - Storybook MVP",
    fn=generate_drawing,
    inputs=["text"],
    outputs=["json", "json"],
)

int_demo = gr.Interface(
    description="Stable Diffusion - Interpolation Gen",
    fn=generate_interpolated_images,
    inputs=["json", "json"],
    outputs=["json"],
)


demo = gr.TabbedInterface([img_demo, int_demo], ["Image Gen", "Interpolation Gen"])

demo.launch(share=True)