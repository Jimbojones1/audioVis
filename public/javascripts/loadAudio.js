var app = app || {};

window.onload = function () {
    console.log('audio script loaded');

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

     var canvas = document.getElementById('myCanvas');
     var ctx = canvas.getContext('2d')

     function draw(){
        requestAnimationFrame(draw);

        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        console.log(arr)
        console.log(bufferLength, ' this is bufferLength')

        analyzer.getByteFrequencyData(arr);

        ctx.lineWidth = 1;
        ctx.strokeStyle = randColor();
        ctx.beginPath();

      var sliceWidth = 5;
      var x = 0;

      for(var i = 0; i < 1024; i++) {

        var v = arr[i] / 250.0;
        // console.log(v, '----this is v')

        // console.log('canvas height: ', canvas.height, " i: ", arr[i])
        var y = v * canvas.height/2;

        if(i === 0) {
          ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);
             ctx.strokeStyle = randColor();
            // ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();
        }

        if (x > 600){
          x -= sliceWidth;


        }
        else
          x += sliceWidth;
      }



    };

        draw()
     }


function randColor(){
  var r = Math.floor(Math.random() *250);
  var g = Math.floor(Math.random() *250);
  var b = Math.floor(Math.random() *250);

  return 'rgb(' + r + ',' + g + ',' + b + ')'
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





function createVisualizer(fftSize){


}
