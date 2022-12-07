<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
[Farid][farid-linkedin-url] and [I][rahel-linkedin-url] created this project for [LabLab.ai's Stable Diffusion Hackathon](https://lablab.ai/event/stable-diffusion-hackathon). We won first place.

This project allows users to:
* Generate images based on styles
* Organize the images frame-by-frame 
* Create videos by interpolating between keyframe images chosen by the user

The reasons why we chose to make this project:
* There is no tool out there for video creation by **selected** image interpolation. To clarify, there are examples for image interpolation by stable diffusion. But they only allow you to select the prompt that you want. Not the image. 
* There is no tool that provides an easy user interface to create videos/timelines. 
* There is no tool that can connect to different models for different use cases. For example, perhaps the Stable Diffusion v1-4 model generates good results in a specific art style. Switching to that model should be done very easily. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
* [Hugging Face](https://huggingface.co/)
* [Gradio](https://gradio.app/)
* [Google Colab](https://colab.research.google.com/drive/1i6fZHgd1jyMq9Byww1exjgGURaEHtRsR?usp=sharing)
* [D3](https://d3js.org/)
* [Flask](https://flask.palletsprojects.com/en/2.2.x/)
* [FFmpeg](https://ffmpeg.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
We previously used Flask to circumvent the CORS error from LabLab's Stable Diffusion API when running browser-side. However, after we switched to using our own custom endpoint model, we could run the project on the browser.

Now you can simply open the `index.html` file to run the project. Note, since our Stable Diffusion API is not running, the project will not work. We are currently working on a solution for this. 

You may host the API yourself with the [notebook](https://github.com/kael558/supreme-octo-tribble/blob/main/notebooks/Deforum_Stable_Diffusion_Adapted_To_API_v2.ipynb) provided. All it requires a HuggingFace Spaces token. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
* You may specify basic/advanced options by clicking the Information icon in the top left corner
* You may add new images to the timeline by entering information in the prompt and clicking submit
* You may hover and click over the generated images to regenerate and select a different image or delete it.
* You may render the interpolated frames by clicking the _Interpolate_ button
* You may create a video from those frames by clicking the _Create Video_ button

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap
- [ ] Host API with HuggingFace
- [ ] REFACTOR front end code/Clean up UI
- [ ] Optimized rendering (rendering frames that are changed only)
- [ ] Audio track upload
- [ ] img2img generation for amateur drawings
- [ ] inpainting to change parts of image
- [ ] Add more artists/styles (consider categorizing)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing
This repository is intended as an archive. No changes will be made to it in the future. 

You may fork the project and work in your own repository.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact
Rahel Gunaratne:
 - Email: rahel.gunaratne@gmail.com
 - [Twitter](https://twitter.com/gunaratne_rahel)
 - [LinkedIn](https://www.linkedin.com/in/rahelgunaratne/)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [EnzymeZoo](https://twitter.com/enzymezoo) for created the Deforum notebook used as a starting point for this project
* [Jeremy Howard](https://twitter.com/jeremyphoward) and [John Whitaker](https://twitter.com/johnowhitaker) for providing a [valuable course in Stable Diffusion](https://forums.fast.ai/t/lesson-9-part-2-preview/101336)
* [othneildrew](https://github.com/othneildrew/Best-README-Template) for providing this README template

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues

[license-shield]: https://img.shields.io/github/license/kael558/supreme-octo-tribble.svg?style=for-the-badge
[license-url]: https://github.com/kael558/supreme-octo-tribble/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[rahel-linkedin-url]: https://www.linkedin.com/in/rahelgunaratne/
[farid-linkedin-url]: https://www.linkedin.com/in/farid-hassainia-ca/



