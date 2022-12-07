// Data
let num_prompts = 0;
let centered_image_keyframe = -1;
let small_image_x = -1, small_image_y = -1;

let is_rendering = false;
//let data = []

let data = [
    {
        'keyframe': 0, 
        'prompt': 'A joyful little girl in a cosmonaut helmet and an orange cat standing in a bedroom, art by Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation' ,
        'images': ['https://i.redd.it/am7b4dmreoq11.png', 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg'],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    }, 
    {
        'keyframe': 12,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://i.redd.it/jspiicolbedz.png', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    },
    {
        'keyframe': 15,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://i.imgur.com/ZTUsHOk.png', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    },
    {
        'keyframe': 20,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F0cee96d2-af2c-4497-9937-e8151ba343b7_512x512.png', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    },
    {
        'keyframe': 25,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['https://artfilters-ai.com/img/logo.png', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    },
    {
        'keyframe': 40,
        'prompt': 'A small playful orange cat behind blue snow boots, Hayao Miyazaki, Memphis, Watercolor, Storybook, highly detailed, illustration, trending on artstation',
        'images': ['http://d5wt70d4gnm1t.cloudfront.net/media/a-s/articles/2055-716352946698/landscape-painting-list-512x512-c.jpg', 'https://media.istockphoto.com/id/1212275972/photo/parliament-hill-in-ottawa-ontario-canada.jpg?s=612x612&w=0&k=20&c=KN2Nc0OXQeT3pk5lqCh_qD_X-kzpAvxioB53PIpd3JY='],
        'tensors': [],
        'shapes': [],
        'selected_image_idx': 0
    }
]

let api_url = 'https://94281eab7ad9ab78.gradio.app'

let image_gen_url = api_url + '/run/predict'
let interpolate_gen_url =  api_url + '/run/predict_1'


let screen_width, screen_height;
let band_width;

let fps = 12;
let num_frames = 15;
let img_width = 512;
let img_height = 512;

let img_model = ""
let vid_model = ""

let frames = [...Array(num_frames+1).keys()]
let centerX, centerY;

// Render params
let svg;
const end_tick_height = 50;
const mid_tick_height = 30;
const timeline_padding = 100;


function submit_settings(){
    let reset = false;
    if (num_frames!=Number(document.getElementById("numFrames").value) 
        || img_width!=Number(document.getElementById("width").value)
        || img_height!=Number(document.getElementById("height").value)
        || fps!=document.getElementById("fps").value){
            is_rendering = false;
            reset = true;
    }

    num_frames = Number(document.getElementById("numFrames").value);
    frames = [...Array(num_frames+1).keys()]


    img_width = Number(document.getElementById("width").value)
    img_height = Number(document.getElementById("height").value)
    fps = Number(document.getElementById("fps").value)

    if (document.getElementById('imageGenModel').value == "LabLabAI"){
        document.getElementById('imageGenModel').style.display = 'none';
    } else {
        document.getElementById('imageGenModel').style.display = 'block';
    }

    hide_options();
    
    centerX = screen_width/2 - img_width/6;
    centerY = img_height;

    if (reset){
        svg.selectAll("*").remove();
        inital_render();
        show_prompt_input_container();
    }

    render();
}

function advanced_options(){
    document.getElementById('basic-settings').style.display = 'none';
    document.getElementById('advanced-settings').style.display = 'block';

}
 
function basic_options(){
    document.getElementById('basic-settings').style.display = 'block';
    document.getElementById('advanced-settings').style.display = 'none';


}
function show_options(){
   basic_options();

    document.getElementById('options-container').style.display = 'block';
    $("#options-container").fadeTo("fast", 1);

    
}

function hide_options(){
    $("#options-container").fadeTo("fast", 0, () => 
        document.getElementById('options-container').style.display = 'none'
    );
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
            break;
        }
    }
    render();
}

function generate(){
    for (let entry of data){
        if (entry.keyframe == centered_image_keyframe){
            request_url(entry.keyframe, entry.prompt)
        }
    }
}







function convertDataURIToBinary(dataURI) {
    console.log(dataURI);
    
    var base64 = dataURI.replace(/^data[^,]+,/,'');
    var raw = window.atob(base64);
    var rawLength = raw.length;

    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    console.log(array);
    return array;
};


function done(output) {
	const url = webkitURL.createObjectURL(output);
    
	document.getElementById('awesome').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
    document.getElementById('awesome').style.display = '';

}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

function create_video(){
    for (let i = 0; i < frames.length; i++){
        if (i === frames[i]){ //frames not set
            return;
        } 
    }

    console.log("Frames collected. Rendering video...")

    let mem = []
    for (let i = 0; i < frames.length; i++){
        n = `img${ pad( i, 4 ) }.jpeg`
        console.log(n);
        mem.push({'name': n, 'data':convertDataURIToBinary(frames[i])})
    }

    const worker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
    let messages = '';
    worker.onmessage = function(e) {
		var msg = e.data;
		switch (msg.type) {
			case "stdout":
			case "stderr":
				messages = msg.data + "\n";
				break;
			case "exit":
				console.log("Process exited with code " + msg.data);
				//worker.terminate();
				break;

			case 'done':
				const blob = new Blob([msg.data.MEMFS[0].data], {
					type: "video/mp4"
				});
				done( blob )

			break;
		}
        console.log(messages)
	};

    worker.postMessage({
		type: 'run',
		TOTAL_MEMORY: 268435456,
		//arguments: 'ffmpeg -framerate 24 -i img%03d.jpeg output.mp4'.split(' '),

        arguments: ["-probesize", "100M", 
        "-analyzeduration", "100M",
        "-r", String(fps), 
        "-i", "img%04d.jpeg", 
        "-c:v", "libx264", 
        "-crf", "1", 
        "-vf", "scale=512:512", 
        "-pix_fmt", "yuv420p", 
        "-vb", "20M", 
        "out.mp4"],
		/*arguments: [
            '-r', String(fps),
            "-i", "img%04d.png", 
            '-frames:v', frames.length,
            '-c:v', 'libx264',
            "-vf", "scale=512:512",
            '-pix_fmt', 'yuv420p',
            '-crf', '17',
            '-preset', 'veryfast',
            '-pattern_type', 'sequence',
            "-vb", "20M", 
            "out.mp4"],*/
		//arguments: '-r 60 -i img%03d.jpeg -c:v libx264 -crf 1 -vf -pix_fmt yuv420p -vb 20M out.mp4'.split(' '),
		MEMFS: mem
	});



   






}

function interpolate(){

    data.sort(function(a, b){return a.keyframe-b.keyframe});
    is_rendering = true;
    
    for (let i = 0; i < data.length-1; i++){
        let keyframe1 = data[i].keyframe;
        let keyframe2 = data[i+1].keyframe;

        frames[keyframe1] = data[i].images[data[i].selected_image_idx]
        frames[keyframe2] = data[i+1].images[data[i+1].selected_image_idx]

        if (keyframe2 == keyframe1+1){
            continue;
        }

        tensor_data = { 'data': [
                    {
                        'tensor': data[i].tensors[data[i].selected_image_idx],
                        'keyframe': data[i].keyframe,
                        'size': data[i].shapes[data[i].selected_image_idx]
                    },
                    {
                        'tensor': data[i+1].tensors[data[i+1].selected_image_idx],
                        'keyframe': data[i+1].keyframe,
                        'size': data[i+1].shapes[data[i+1].selected_image_idx]
                    }
                ]
            }
        $.ajax({
            type: "POST",
            url: interpolate_gen_url,
            data: JSON.stringify(tensor_data),
            contentType: "application/json",
            dataType: 'json',
            success: function(result) {
                let k = 0;
                data_str = JSON.parse(result['data'])
       
                f=data_str.split(', b\'')
                for (let i in f){
                    f[i] = f[i].substring(0, f[i].length-1);
                }

                f[0] = f[0].substring(3, f[0].length);
                f[f.length-1] = f[f.length-1].substring(0, f[f.length-1].length-1);

                for (let j = keyframe1+1; j < keyframe2; j++){
                    frames[j] = 'data:image/jpeg;base64,'+f[k]
                    k+=1
                }

    


                render()
            },
            error: function (request, status, error) {
                console.log(request);
                console.log(status);
                console.log(error);
            }
        });
    }
}

//<img src="data:image/png;base64, [base64 encoded image string here]">
function request_url(keyframe, prompt){
    
    let loading_img = 'https://cdn-icons-png.flaticon.com/512/6356/6356659.png'
    
    let old_selected_idx;

    if (centered_image_keyframe == -1){
        obj = {
            'keyframe': keyframe,
            'prompt': prompt,
            'images': [loading_img],
            'tensors': [],
            'shapes': [],
            'selected_image_idx': 0
        }
        data.push(obj);
    } else {
        for (let entry of data){
            if (entry.keyframe == keyframe){
                entry.images.push(loading_img);
                old_selected_idx = entry.selected_image_idx;
                entry.selected_image_idx = entry.images.length-1;
            }
        }
    }
    
    render();
    prompt_data = {'data': [prompt]}
    
    $.ajax({
        type: "POST",
        url: image_gen_url,
        data: JSON.stringify(prompt_data),
        contentType: "application/json",
        dataType: 'json',
        success: function(result) {
  
            tensor = result['data'][0]['tensor_data']['tensor']
            t_size = result['data'][0]['tensor_data']['size']
            encoding = 'data:image/jpeg;base64,' + result['data'][1]
 
            for (let entry of data){
                if (entry.keyframe == keyframe){
                    entry.images[entry.images.length-1]=encoding
                    entry.tensors.push(tensor)
                    entry.shapes.push(t_size)
                }
            }
            render();
        },
        error: function (request, status, error) {
            centered_image_keyframe = -1;

            for (let i in data){
                if (data[i].keyframe == keyframe){
                    if (data[i].images.length == 1){
                        data.splice(i, 1)
                    } else {
                        data[i].images.pop()
                        data[i].selected_image_idx=old_selected_idx;
                        centered_image_keyframe = keyframe;
                    }
                    break;
                }
            }
            console.log(status);
            console.log(error);
            render();
            alert('Failed to generate image from API.')
        }
      });
}

function submit_prompt(){
    const frame = Number(document.getElementById("frame").value)
    
    if (frame < 0 || frame > num_frames){
        alert('Invalid frame number. Must be between ' + 0 + ' and ' + num_frames);
    }

    for (let entry of data){
        if (entry.keyframe == frame){
            alert('Frame already exists.');
            return
        }
    }


    const artists = Array.from(document.getElementById("artists").selectedOptions).map(({ value }) => value);
    const illustationStyle = document.getElementById("illustationStyle").value
    const prompt = document.getElementById("prompt").value

    document.getElementById("prompt").value = ''

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



    let frameScale = d3.scaleLinear()
    .domain([0, num_frames])
    .range([timeline_padding, width - timeline_padding]);

    // Add frames axis
    let frameScale_generator = d3.axisBottom()
            .ticks(num_frames)
            .scale(frameScale);

    let frame_axis = svg.append("g")
            .attr('transform', `translate(${0}, ${height-timeline_padding})`)
            .call(frameScale_generator);

    frame_axis.select(".domain")
            .attr("stroke-width","3")

    frame_axis.selectAll(".tick text")
            .attr("font-size","16");


    // Adding time axis
    let seconds = num_frames/fps

    let timeScale = d3.scaleLinear()
        .domain([0, seconds])
        .range([timeline_padding, width - timeline_padding]);

    let timeScale_generator = d3.axisTop()
            .ticks(seconds)
            .scale(timeScale);

    let time_axis = svg.append("g")
            .attr('transform', `translate(${0}, ${height-timeline_padding})`)
            .call(timeScale_generator);

    time_axis.select(".domain")
            .attr("stroke-width","3")

    time_axis.selectAll(".tick text")
            .attr("font-size","16");

    svg.append("text")             
            .attr("transform", `translate(${width/2}, ${height-timeline_padding+40})`)
            .style("text-anchor", "middle")
            .text("Seconds/Frames");
    


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


    let bandWidth = (width - 2*timeline_padding)/(num_frames)
    console.log(frames);
    svg.selectAll('rect.progress')
        .data(frames, (d, i) => i)
        .join('rect')
        .attr('x', (d, i) => timeline_padding+bandWidth*i)
        .attr('y', height-timeline_padding-15)
        .attr('width', bandWidth)
        .attr('height', 30)
        .style('fill', (d, i) => {

            if (i == d){
                return 'gray';
            }
            if (i == -1){
                return 'red';
            }
            return 'green';
        })
        .attr('class', 'progress')
        .attr('opacity', (d, i) =>{
            if (i==frames.length-1)
                return 0;
            return 0.5;
        })

    svg.selectAll('g.key-frame')
        .data(data, (d)=>d.keyframe)
        .join(
            enter => { 


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



            update.select('image').attr('xlink:href', (d) => {
                
                let start = 0;
                let end = num_frames;
                for (let entry of data){
                    if (entry.keyframe > start && start < d.keyframe ){
                        start = entry.keyframe+1;
                    }

                    if (entry.keyframe < end && end > d.keyframe ){
                        end = entry.keyframe-1;
                    }
                }
                console.log('update image ' + start + ', ' + end)

                for (;start < end; start++){
                    frames[start] = -1;
                }

                return d.images[d.selected_image_idx]
            });
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
    centerX = screen_width/2 - img_width/6;
    centerY = img_height;
    svg = d3.select('#svg-content');
    basic_options();

    var slider = document.getElementById("scale");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;
    
    slider.oninput = function() {
      output.innerHTML = this.value;
    }

    inital_render();
    render();
})