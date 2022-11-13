// Data
let num_prompts = 0;
let centered_image_keyframe = -1;
let small_image_x = -1, small_image_y = -1;


let data = [
    {
        'keyframe': 24, 
        'prompt': 'A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation' ,
        'images': ['https://slm-assets.secondlife.com/assets/3789218/lightbox/512x512%20PNG%20Landscape%20Texture%20-%20Blue%20Sky.jpg?1308962474', 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg'],
        'selected_image_idx': 0
    }, 
    {
        'keyframe': 64,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://i.redd.it/jspiicolbedz.png', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'selected_image_idx': 0
    }
]


let screen_width, screen_height;


let num_frames = 100;
let img_width = 512;
let img_height = 512;


let centerX, centerY;


// Render params
let svg;
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
    num_frames = document.getElementById("numFrames").value
    img_width = document.getElementById("width").value
    img_height = document.getElementById("height").value

    document.getElementById('project-start-container').style.display = 'none';
    document.getElementById('svg-container').style.display = 'block';
    
    centerX = screen_width/2 - img_width/6;
    centerY = img_height;

    show_prompt_input_container();
    inital_render();
    render();
}


function show_prompt_input_container(){
    document.getElementById('prompt-input-container').style.display = 'block';
    $("#prompt-input-container").fadeTo("fast", 1);
}

function hide_prompt_input_container(){
    $("#prompt-input-container").fadeTo("fast", 0, () => 
        document.getElementById('prompt-input-container').style.display = 'none'
    );
}


function deletePrompt(){
    for (let i in data){
        if (data[i].keyframe == centered_image_keyframe){
            data.splice(i, 1)
            centered_image_keyframe = -1;
            render();
        }
    }
}

function generate(){
    for (let entry of data){
        if (entry.keyframe == centered_image_keyframe){
            request_url(entry.keyframe, entry.prompt)
        }
    }
}

//<img src="data:image/png;base64, [base64 encoded image string here]">
function request_url(keyframe, prompt){
    prompt_data = {'data': [prompt]}
    $.ajax({
        type: "POST",
        url: "https://0677cdc26e4f3cef.gradio.app/run/predict/",
        data: JSON.stringify(prompt_data),
        contentType: "application/json",
        dataType: 'json',
        success: function(result) {
            //console.log(typeof(result))
            encoding = result['data'][0]
            if (centered_image_keyframe == -1){
                obj = {
                    'keyframe': keyframe,
                    'prompt': prompt,
                    'images': [encoding],
                    'selected_image_idx': 0
                }
                data.push(obj);
            } else {
                for (let entry of data){
                    if (entry.keyframe == keyframe){
                        entry.images.push(encoding);
                        entry.selected_image_idx = entry.images.length-1;
                    }
                }
            }
            render();
        },
        error: function (request, status, error) {
            console.log(status)
            console.log(error)
        }
      });
}

function submit_prompt(){
    const frame = Number(document.getElementById("frame").value)
    if (frame < 0 || frame > num_frames){
        alert('Invalid frame number. Must be between ' + 0 + ' and ' + num_frames);
    }

    const artists = Array.from(document.getElementById("artists").selectedOptions).map(({ value }) => value);
    const illustationStyle = document.getElementById("illustationStyle").value
    const prompt = document.getElementById("prompt").value

/*A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, 
art by Hayao Miyazaki, 
Memphis, Watercolor, 
Storybook, highly detailed, illustration, trending on artstation
*/
    let complete_prompt = prompt;
    for (let artist in artists){
        complete_prompt +", art by " + artist;
    }
    complete_prompt+= ", " + illustationStyle;
    complete_prompt+=', Memphis, Storybook, highly detailed, illustration, trending on artstation'

    request_url(frame, complete_prompt);
}

function inital_render(){
    let width = window.innerWidth, height = window.innerHeight;

    var scale = d3.scaleLinear()
    .domain([0, num_frames])
    .range([timeline_padding, width - timeline_padding]);

    // Add scales to axis
    var x_axis_generator = d3.axisBottom()
            .ticks(num_frames)
            .tickFormat(x => x%10==0 ? x : "")
            .scale(scale);
    let x_axis = svg.append("g")
            .attr('transform', `translate(${0}, ${height-timeline_padding})`)
            .call(x_axis_generator);

    x_axis.select(".domain")
            .attr("stroke-width","2")

    x_axis.selectAll(".tick text")
            .attr("font-size","16");

}

function render(){
    // Setting image
    let image_scale = 6;
    let image_y_offset = 100;

    let width = window.innerWidth, height = window.innerHeight;
    let range = width - 2*timeline_padding;

    function transform_keyframe(d){
        if (d.keyframe == centered_image_keyframe){
       
            let xTranslate = centerX - small_image_x;
            let yTranslate = centerY - small_image_y;
            
            return `translate(${xTranslate}, ${yTranslate}) scale(1,1)`;
        } else {

            return `scale(${1/image_scale}, ${1/image_scale})`
        }
    }

    if (centered_image_keyframe == -1){
        show_prompt_input_container();
    } else {
        hide_prompt_input_container();
    }


    svg.selectAll('g.key-frame')
        .data(data, (d)=>d.keyframe)
        .join(
            enter => { 
                //let keyframe = enter.datum().keyframe

                // Group element
                let keyframe_elem = enter.append('g')
                            .classed('key-frame', true)
                            .attr('transform', (d,i) => `translate(${d.keyframe/num_frames*range+timeline_padding}, ${height-timeline_padding})`)
  
                // Triangle symbol
                let triangle = d3.symbol()
                    .type(d3.symbolTriangle).size(500);

                keyframe_elem.append('path')
                    .attr('d', triangle)
                    .attr('fill', 'green')
                    .attr('transform', `translate(${0}, ${-20}) rotate(180)`)
                
                // Image group
                let imageGroup = keyframe_elem.append('g')
                                    .classed('img_group', true)
                                    .attr('top', 100)
                                    .attr('z-index', (d, i) => num_frames-d.keyframe);
                                    
                 imageGroup.append('image')
                    .attr('xlink:href', (d) => d.images[d.selected_image_idx])
                    .attr('x', -img_width/2)
                    .attr('y', -img_height-image_y_offset)
                    .attr('width', img_width)
                    .attr('height', img_height)

                imageGroup.append('rect')
                    .attr('class', 'image-border')
                    .attr('x', -img_width/2)
                    .attr('y', -img_height-image_y_offset)
                    .attr('width', img_width)
                    .attr('height', img_height)


                imageGroup.append('text')
                    .classed('options', true)
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', function(d) { return '14em'})
                    .text(function(d) { return '\uf104' })
                    .attr('x', -img_width+30)
                    .attr('y', (-img_height/2))
                    .attr("width", 50)
                    .attr("height", img_height/image_scale)
                    .attr('opacity', 0)
                    .attr('pointer-events', 'none')
                    .attr('cursor', 'none')
                    .on('click', function(event, d){
                        if (d.selected_image_idx==0){
                            d.selected_image_idx=d.images.length-1;
                        } else {
                            d.selected_image_idx-=1;
                        }
                        render();
                    })

                imageGroup.append('text')
                        .classed('options', true)
                        .attr('font-family', 'FontAwesome')
                        .attr('font-size', function(d) { return '14em'})
                        .text(function(d) { return '\uf105' })
                        .attr('x', (img_width/2)+60)
                        .attr('y', (-img_height/2))
                        .attr("width", 50)
                        .attr("height", img_height/image_scale)
                        .attr('opacity', 0)
                        .attr('pointer-events', 'none')
                        .attr('cursor', 'none')
                        .on('click', function(event, d){
                            if (d.selected_image_idx==d.images.length-1){
                                d.selected_image_idx=0;
                            } else {
                                d.selected_image_idx+=1;
                            }
                            render();
                        })
                imageGroup.append('text')
                        .classed('options', true)
                        .classed('page', true)
                        .attr('font-size', function(d) { return '3em'})
                        .text(function(d) { return (d.selected_image_idx+1) + '/' +d.images.length })
                        .attr('x', -30)
                        .attr('y', (-img_height-image_y_offset-10))
                        .attr('text-align', 'center')
                        .attr("width", 50)
                        .attr("height", 20)
                        .attr('opacity', 0)
                        .attr('pointer-events', 'none')
                        .attr('cursor', 'none')
        
                imageGroup.append("foreignObject")
                            .classed('options', true)
                            .attr("x", -img_width/2)
                            .attr("y", -image_y_offset)
                            .attr("width", img_width)
                            .attr("height", img_height)
                            .attr('pointer-events', 'none')
                            .attr('cursor', 'none')
                            .html(function(d) {
                                return `<textarea readonly>${d.prompt}</textarea>
                                        <button onclick="deletePrompt()"> Delete </button>
                                        <button onclick="generate()"> Generate </button>`
                            })
                            .attr('opacity', 0)

   
                imageGroup.attr('transform', (d) => transform_keyframe(d))

                imageGroup.on("mouseover", function(event, d) {
                    if (d.keyframe == centered_image_keyframe)
                        return;

                    d3.select(this)
                        .transition('grow').duration(300)
                        .attr('transform', `scale(${2/image_scale}, ${2/image_scale})`)
                        .attr('z-index', 5000);
                }).on("mouseout", function(event, d) {
                    if (d.keyframe == centered_image_keyframe)
                        return;

                    d3.select(this)
                        .transition('shrink').duration(300)
                        .attr("transform", `scale(${1/image_scale}, ${1/image_scale})`)
                        .attr('z-index', num_frames-d.keyframe);
                }).on("click", function(event, d){
                    //console.log(event.srcElement.tagName)
                    if (['text' , 'TEXTAREA', 'BUTTON'].includes(event.srcElement.tagName))
                        return;

                    if (centered_image_keyframe == -1){ //there is no centered keyframe
                        centered_image_keyframe = d.keyframe; 
                        let key_frame_node = this.parentNode;
                        small_image_x = key_frame_node.getBoundingClientRect().x+50;
                        small_image_y = key_frame_node.getBoundingClientRect().y;

                    } else {
                        if (centered_image_keyframe == d.keyframe){
                            centered_image_keyframe = -1;
                            small_image_x = -1;
                            small_image_y = -1;
                        } else {
                            centered_image_keyframe = d.keyframe;
                            let key_frame_node = this.parentNode;
                            small_image_x = key_frame_node.getBoundingClientRect().x+50;
                            small_image_y = key_frame_node.getBoundingClientRect().y;
                        }
                    }
                    render();
                })
                return keyframe_elem;
            },
        update => {
            update.select('image').attr('xlink:href', (d) => d.images[d.selected_image_idx]);
            update.select('g.img_group')
                .transition('translate').duration(500)
                .attr('transform', (d) => transform_keyframe(d))
                
            update.select('g.img_group').selectAll('.options')
                .transition('appear').duration(400)
                    .attr('opacity', (d) => (d.keyframe == centered_image_keyframe) ? 1 : 0)
                    .attr('pointer-events', 'auto')
                    .attr('cursor', 'auto')

            update.select('g.img_group').selectAll('.page')
                .text(function(d) { return (d.selected_image_idx+1) + '/' + d.images.length })

            return update;
        },
        exit => exit.remove()
    )
}

document.addEventListener('DOMContentLoaded', (event) => {
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;


    document.getElementById('project-start-container').style.display = 'block';
    document.getElementById('prompt-input-container').style.display = 'none';
    document.getElementById('svg-container').style.display = 'none';

    svg = d3.select('#svg-content');

})