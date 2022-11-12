// Data
let num_prompts = 0;;

const data = [
    {
        'keyframe': 24, 
        'prompt': 'A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation' ,
        'images': ['https://slm-assets.secondlife.com/assets/3789218/lightbox/512x512%20PNG%20Landscape%20Texture%20-%20Blue%20Sky.jpg?1308962474'],
        'selected_image_idx': 0
    }, 
    {
        'keyframe': 64,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://i.redd.it/jspiicolbedz.png'],
        'selected_image_idx': 0
    }
]


let screen_width, screen_height;


let numFrames = 100;
let img_width = 512;
let img_height = 512;


let centerX, centerY;


// Render params
let timeline_svg, slideshow_svg;
const end_tick_height = 50;
const mid_tick_height = 30;
const timeline_padding = 100;

/*var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://api.newnative.ai/stable-diffusion?prompt=futuristic spce station, 4k digital art", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));*/


function submit_settings(){
    numFrames = document.getElementById("numFrames").value
    img_width = document.getElementById("width").value
    img_height = document.getElementById("height").value

    document.getElementById('project-start-container').style.display = 'none';
    document.getElementById('timeline-container').style.display = 'block';
    
    centerX = screen_width/2 - img_width/6;
    centerY = img_height;

    show_prompt_input_container();
    render();
}


function show_prompt_input_container(){
    document.getElementById('prompt-input-container').style.display = 'block';
    document.getElementById('slideshow-container').style.display = 'none';
}

function show_slideshow_container(){
    document.getElementById('prompt-input-container').style.display = 'none';
    document.getElementById('slideshow-container').style.display = 'block';
}

function submit_prompt(){
    const frame = document.getElementById("frame").value
    if (frame <= 0 || frame >= numFrames){
        alert('Invalid frame number. Must be between ' + 1 + ' and ' + numFrames);
    }

    const artists = Array.from(document.getElementById("artists").selectedOptions).map(({ value }) => value);
    const illustationStyles = document.getElementById("illustationStyles").value
    const prompt = document.getElementById("prompt").value

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      const url = "https://api.newnative.ai/stable-diffusion?prompt=" + prompt
      
      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    
    prompts.append(prompt);

    console.log(artists + " " + illustationStyles + " " + prompt);

    render();
}

function render(){
    let width = window.innerWidth, height = window.innerHeight;
    let range = width - 2*timeline_padding;

    var scale = d3.scaleLinear()
        .domain([1, numFrames])
        .range([timeline_padding, width - timeline_padding]);

    // Add scales to axis
    var x_axis_generator = d3.axisBottom()
            .scale(scale);
    let x_axis = timeline_svg.append("g")
            .attr('transform', `translate(${0}, ${height-timeline_padding})`)
            .call(x_axis_generator);

    x_axis.select(".domain")
            .attr("stroke-width","2")

    x_axis.selectAll(".tick text")
            .attr("font-size","14");

    timeline_svg.selectAll('g.key-frame')
    .data(data, d => d)
    .join(
        enter => { 
                // Group element
                enter = enter.append('g')
                            .classed('key-frame', true)
                            .attr('transform', (d,i) => `translate(${d.keyframe/numFrames*range+timeline_padding}, ${height-timeline_padding})`)
  
                // Triangle symbol
                let triangle = d3.symbol()
                    .type(d3.symbolTriangle).size(500);

                enter.append('path')
                    .attr('d', triangle)
                    .attr('fill', 'green')
                    .attr('transform', `translate(${0}, ${-20}) rotate(180)`)
                    
                
                // Setting image
                let image_scale = 6;
                let image_y_offset = 100;

                let imageGroup = enter.append('g')
                                    .classed('not-center', true)
                                    .attr('z-index', (d, i) => i);
                                    
                imageGroup.append('image')
                    .attr('xlink:href', (d) => d.images[d.selected_image_idx])
                    .attr('x', -img_width/2)
                    .attr('y', -img_height-image_y_offset)
                    .attr('width', img_width)
                    .attr('height', img_height)
                    .attr('transform', `scale(${1/image_scale}, ${1/image_scale})`)

                imageGroup.append('rect')
                    .attr('class', 'image-border')
                    .attr('x', -img_width/2)
                    .attr('y', -img_height-image_y_offset)
                    .attr('width', img_width)
                    .attr('height', img_height)
                    .attr('transform', `scale(${1/image_scale}, ${1/image_scale})`)

                imageGroup.on("mouseover", function(d, i) {
                    d3.select(this)
                    .filter('.not-center')
                    .transition('grow').duration(300)
                    .attr('transform', `scale(2,2)`)
                    .attr('z-index', 5000);

                }).on("mouseout", function(d, i) {

                   d3.select(this)
                    .filter('.not-center')
                    .transition('shrink').duration(300)
                    .attr("transform", `scale(1,1)`)
                    .attr('z-index', i);
                    
                }).on("click", function (d, i) {
                    


                    show_slideshow_container();
                    let key_frame_node = this.parentNode;
                   
                    let xTranslate = centerX - key_frame_node.getBoundingClientRect().x;
                    let yTranslate = centerY - key_frame_node.getBoundingClientRect().y;
                    
                    d3.select(this)
                        .classed('not-center', false)
                        .transition('display').duration(600)
                        .attr("transform", `translate(${xTranslate}, ${yTranslate}) scale(${image_scale},${image_scale})`)



                    //console.log(elem)
                    //console.log(elem.attr('x'));
                    //console.log(elem.attr('y'));

                    /*d3.select(this)
                    .transition('display').duration(500)
                    .attr('transform', `scale(1, 1)`)
                    

                    let slides = d3.select("#slideshow-container") //1. select parent
                        .selectAll("image") //2. select children (all images in the div, none to start)
                        .data( d.images ); //3. bind to the array

                    slides.enter() //4. access the placeholders
                        .append("image")
                        .attr('xlink:href', d => d) 
                        .attr('x', -small_img_width/2)
                        .attr('y', -small_img_height-20)
                        .attr('width', small_img_width)
                        .attr('height', small_img_height)*/

                })

                return enter;
            },
        update => update,
        exit => exit.remove()
    )
}

document.addEventListener('DOMContentLoaded', (event) => {
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;


    document.getElementById('project-start-container').style.display = 'block';
    document.getElementById('prompt-input-container').style.display = 'none';
    document.getElementById('timeline-container').style.display = 'none';
    document.getElementById('slideshow-container').style.display = 'none';

    timeline_svg = d3.select('#timeline-content')
        .attr('viewBox', `0 0 ${screen_width} ${screen_height}`)
        .append('g')

    slideshow_svg = d3.select('#slideshow-content')
        .attr('viewBox', `0 0 ${screen_width} ${screen_height}`)
        .append('g')
})