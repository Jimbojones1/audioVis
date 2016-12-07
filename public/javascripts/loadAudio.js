var app = app || {};
app.value = 'purple';
app.rValue = '255';
app.bValue = '255';
app.gValue =  '255';
window.onload = function () {
    console.log('audio script loaded');

    var input = document.getElementById('colorInput');
    var sliderRed = document.getElementById('colorRGB')
    var sliderGreen = document.getElementById('colorGreen')
    var sliderBlue = document.getElementById('colorBlue')

    var btn   = document.getElementById('btn');

    sliderRed.addEventListener('input', function(){
      console.log('something', sliderRed.value)
      app.rValue = sliderRed.value;
    })

    sliderBlue.addEventListener('input', function(){
      console.log('something', sliderBlue.value)
      app.bValue = sliderBlue.value;
    })

    sliderGreen.addEventListener('input', function(){
      console.log('something', sliderGreen.value)
      app.gValue = sliderGreen.value;
    })


    btn.addEventListener('click', function(){
      app.value = grabInputValue(input)
    });

    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);

    function onDrag(e){
        e.stopPropagation()
        e.preventDefault();
        return false;
    }



    function onDrop(e){
        e.stopPropagation();
        e.preventDefault();

        var droppedFile = e.dataTransfer.files;
        console.log('dropped file: ', droppedFile)


        createAudioElement(droppedFile[0])

        // return false
    }
} // end of window.onload



function grabInputValue(input){
  return input.value
}

function createAudioElement(file){

    app.audioElement = document.createElement('audio');
    app.audioElement.src = URL.createObjectURL(file)
    app.audioElement.controls = true;
    document.body.appendChild(app.audioElement);

    // create audio context in order to pipe it through audio nodes along the way to the speakers
    var ctx = new AudioContext();
    var sourceNode = ctx.createMediaElementSource(app.audioElement)

    // after analyzer node is created it can be connected to the speakers

    var analyzer = ctx.createAnalyser()
    // now connect the source Node to analyser so it can be connected to the speakers in the ctx.destination
    sourceNode.connect(analyzer);
    analyzer.connect(ctx.destination)

    console.log(analyzer.frequencyBinCount, ' this is fftSize')
    var bufferLength = analyzer.frequencyBinCount;
    var arr = new  Uint8Array(bufferLength);


    // getFloatTimeDomainData gets the current waveform being played
    // analyzer.fftSize is a constant which denotes the size of the Fast Fourier Transform
    // var array = new Float32Array(analyzer.fftSize);
    // analyzer.getFloatTimeDomainData(array)


    // function playPause(){
    //     if()
    // }

    var cvas = document.getElementById('layer2');
    var cxt = cvas.getContext('2d')
    function drawBackground(){
      var cvas = document.getElementById('layer2');
      var cxt = cvas.getContext('2d')

      cxt.fillStyle = 'green';
      cxt.fillRect(0, 0, 500, 500);
    }

    drawBackground()

     var canvas = document.getElementById('layer1');
     var ctx = canvas.getContext('2d')

     function draw(){
        requestAnimationFrame(draw);

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // console.log(arr)
        // console.log(bufferLength, ' this is bufferLength')

        analyzer.getByteFrequencyData(arr);

        // ctx.lineWidth = 50;
        // ctx.strokeStyle = randColor();
        // ctx.beginPath();

      var sliceWidth = 5;
      var x = 0;

      for(var i = 0; i < 1024; i++) {

        var v = arr[i] / 230.0;
        // console.log(v, '----this is v')

        // console.log('canvas height: ', canvas.height, " i: ", arr[i])
        var y = v * (canvas.height / 2);

        // if(i === 0) {
        //   // console.log(' if hit', x, y)
        //   ctx.moveTo(x, y);
        // }
        // else {
        //   // ctx.fillStyle = randColor();

        // }


        if (x % 2 === 0 && x % 5 ===0){
          ctx.fillStyle = app.value
          ctx.fillRect(x, y, v + 2, 100);
        }
        else if (x % 2 === 0){
          ctx.fillStyle = randRGB('blue', app.gValue);
          ctx.fillRect(x, y, v + 2, 100);
        }
        else {
          ctx.fillStyle = 'rgb(' + app.rValue + ',' + app.gValue + ',' + app.bValue + ')'
          ctx.fillRect(x, y, v + 2, 100);
        }

        // if (x > 0 && x < 100){
        //   ctx.fillStyle = randRGB('blue')
        //    ctx.fillRect(x, y, v + 2, 40);
        // }
        // else if(x > 100 && x < 200){
        //   ctx.fillStyle = randRGB('red')
        //    ctx.fillRect(x, y, v + 2, 40);
        // }
        // else if(x > 200 && x < 400){
        //   ctx.fillStyle = randRGB('green')
        //    ctx.fillRect(x, y, v + 2, 40);
        // }
        // else {
        //   ctx.fillStyle = 'white';
        // }



          if (x > 700){
            x -= sliceWidth;
          }
          else {
            x += sliceWidth;
          }

     }// end of for loop

   }

        draw()
     }


function randColor(){
  var r = Math.floor(Math.random() *255);
  var g = Math.floor(Math.random() *255);
  var b = Math.floor(Math.random() *255);

  return 'rgb(' + r + ',' + g + ',' + b + ')'
}


function randRGB(color, value){
  var r = Math.floor(Math.random() *250);
  var g = Math.floor(Math.random() *255) + 100;
  if (color === 'red'){
    return 'rgb(' + value + ',' + 255 + ',' + value + ')'
  }
  else if(color === 'blue'){
    return 'rgb(' + value + ',' + value + ',' + 255 + ')'
  }
  else {
    return 'rgb(' + r + ',' + g + ',' + r + ')'
  }



}



     // var svgContainer = d3.select("body").append("svg")
     //                               .attr("width", width)
     //                               .attr("height", height)

            // svg.attr("width", width);
            // svg.attr("height", height);
    // var xScale = d3.scale.linear()
    // .range([0, width])
    // .domain([0, array]);

    // var yScale = d3.scale.linear()
    // .range([height, 0])
    // .domain([-1, 1]);

    // var line = d3.svg.line()
    // .x(function(d, i) { return xScale(i); })
    // .y(function(d, i) { return yScale(d); });

    // svgContainer.append("path")
    //     .datum(array)
    //       .attr("d", line);



    // console.log(analyzer.getFloatTimeDomainData(array), ' this is the array that is being passed to the analyzer')
    // app.audioElement.play();
    // // createVisualizer(array)
    // // calling audioElement will allow the file to be played through the speakers
    // console.log(app.audioElement, ' this is audioElement')
// }






