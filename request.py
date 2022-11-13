'''import requests
import urllib.request

prompt = "A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation"

url = "https://api.newnative.ai/stable-diffusion?prompt={}".format(prompt)

response = requests.request("GET", url)
data = response.json()
image_url = data["image_url"]


urllib.request.urlretrieve(image_url, "local-filename1.jpg")
'''

from PIL import Image
from io import BytesIO

import json
import base64
import requests

'''
with open('data.json', 'w') as f:
    r = requests.post(url='https://0677cdc26e4f3cef.gradio.app/run/predict/', json={"data": ['A happy little girl in a cardboard box decorated as a spaceship, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation']})
    result = r.json()
    json.dump(result, f)

    print(result['data'])

    im = Image.open(BytesIO(base64.b64decode(result['data'][0])))
    im.save('test.png')
'''

with open('data.json', 'r') as f:
    result = json.load(f)
    im = Image.open(BytesIO(base64.b64decode(result['data'][0].split(',', 1)[1])))
    im.save('test1.png')

    