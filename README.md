## Todo
 - Hook up API - Done
 - Setup video render from python 
 - TODO add Progress bars for generating images and frames
 - Optimized rendering (rendering frames that are changed only)
 - Add audio queue
 - Advanced options (model selection)
 - Input amateur drawing and generate image



## Prompt Engineering
### Prompt Components
1. inside/outside/interior
2. desert/forest
3. subject - power station/nuclear 
4. then find artist - architecture/landscape style
5. modifiers - sci fi/smoke/fog/alien planet/
6. source material - deviant art/art station/
7. kind - photograph/painting/oil brush painting/
8. renderer - octane render/unreal engine
9. specify camera settings - motion blur/fast shutter speed
10. art genres - hyperrealistic, sci fi



### CLIP Artists filtered by cartoonish faces
#### Carl Barks
 - bright contrasting colors, playful figures


#### Dave Gibbons 
 - superhero esque comic style
 - Too heavy for children

#### Charles Shulz
 - archie comic style, heavy linage, 
 - 
Charles Shulz - 
John Romita - superhero esque
Koyoharu gotouge - japenese
Tomi Ungerer - strange faces, interesting landscapes 

#### Dr. Seuss
 - Too much detail in characters face look scary
 - 
#### Bill Watterson
 - Author of Calvin and Hobbes
 - Characters look a little bit demented
 
#### Quentin Blake (from Roald Dahl books)
 - Too heavy for children
 - Faces sometimes look demented
 - 
#### Lisa Frank 
 - Colors are so bright it is sickening??
 - VERY BRIGHT COLORS
 - 
#### Hayao Miyazaki 
 - Studio Ghibli
 - Sweet and happy style with passive faces


### Prompts
#### A little girl in a cosmonaut helmet and her cat standing in her bedroom - seed 990897358
 - A joyful little girl in a cosmonaut helmet and her cat standing in her bedroom, Hayao Miyazaki , Memphis, Watercolor, Storybook
 - A joyful little girl in a cosmonaut helmet and her cat standing in her bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation
 - A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation
#### An orange cat hiding behind blue rain boots 
- A playful orange cat hiding behind blue rain boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation
- A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation
#### A little girl in a cardboard box decorated as a spaceship
 - A happy little girl in a cardboard box decorated as a spaceship, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation



src - http://dallery.gallery/wp-content/uploads/2022/07/The-DALL%C2%B7E-2-prompt-book-v1.02.pdf
### Emotional prompt
Positive mood, high energy 🤪
bright, vibrant, dynamic, spirited,
vivid, lively, energetic, colorful,
joyful, romantic, expressive,
bright, rich, kaleidoscopic,
psychedelic, saturated, ecstatic,
brash, exciting, passionate, hot

### Size-y,structure-y words
-- unsure how to use

### Looks & vibes
Memphis, Memphis Group, 1980s,
bold, kitch, colourful, shapes

### Illustration styles 
#### Analog media
 - Watercolor
 - Coloured pencil, detailed
 - Oil painting 
 - Chinese watercolor
 - Crayon
 - Acrylic on Canvas 

#### Digital media
 - Watercolor & pen
 - Storybook

#### Character + cartoon
 - Comic book art
 - Studio Ghibli
 - Vintage Disney

### Image editing (see more in src)
 - Fixing a detail: Prompt for the whole image, but now we can spend more words describing the missing detail:
 - Replacing the subject: Given image, erase subject prompt for entire replacement image
 - Replacing the background: Aggressively delete the background. Prompt for the entire replacement image (both the new thing and what you're keeping)
 - Simple uncropping / 'outpainting': Surround image with transparent background. Add a text prompt, could be the same as the original or with additional descriptive focus on surrounding


### Problems
#### Character continuity
 - Character detection to identify characters with names (image to name)
 - When we input a new prompt, we can respecify the name and it will use the saved character image

#### Object continuity

