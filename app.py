import os

models_path = "/content/models"  # @param {type:"string"}
output_path = "/content/output"  # @param {type:"string"}

os.makedirs(models_path, exist_ok=True)
os.makedirs(output_path, exist_ok=True)

model_config = "v1-inference.yaml"
model_checkpoint =  "sd-v1-4.ckpt"

ckpt_config_path = "./stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
ckpt_path = os.path.join(models_path, model_checkpoint)



