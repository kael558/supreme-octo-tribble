import requests
import urllib.request

prompt = "A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation"

url = "https://api.newnative.ai/stable-diffusion?prompt={}".format(prompt)

response = requests.request("GET", url)
data = response.json()
image_url = data["image_url"]


urllib.request.urlretrieve(image_url, "local-filename1.jpg")



