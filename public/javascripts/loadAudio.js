var app = app || {};
app.value = 'purple';
app.rValue = '255';
app.bValue = '255';
app.gValue =  '255';
app.height =  100;
app.heightTwo = 200;
app.width = 2;
app.widthTwo = 3;
app.spacing = 20;
app.white = 20;
app.x = 30
app.lineWidth = 1
app.squareMode = true;
window.onload = function () {
    console.log('audio script loaded');

    var input = document.getElementById('colorInput');
    var sliderRed = document.getElementById('colorRGB');
    var sliderGreen = document.getElementById('colorGreen');
    var sliderBlue = document.getElementById('colorBlue');

    var heightOne = document.getElementById('heightOne');
    var heightTwo = document.getElementById('heightTwo');

    var width = document.getElementById('width');
    var btn   = document.getElementById('btn');

    var spacing = document.getElementById('spacing');
    var spacingTwo = document.getElementById('spacingTwo')

    var circleModeBtn = document.getElementById('circleMode');

    var boxControls  = document.getElementById('boxControls')

    sliderRed.addEventListener('input', function(){
      console.log('something', sliderRed.value)
      app.rValue = this.value;
    })

    sliderBlue.addEventListener('input', function(){
      console.log('something', sliderBlue.value)
      app.bValue = this.value;
    })

    sliderGreen.addEventListener('input', function(){
      console.log('something', sliderGreen.value)
      app.gValue = this.value;
    })


    heightOne.addEventListener('input', function(){
      console.log('something', this.value, heightOne.value)
      app.height = this.value;
    })


    heightTwo.addEventListener('input', function(){
      console.log('something', this.value, heightTwo.value)

      app.heightTwo = this.value;
    })

    width.addEventListener('input', function(){
      console.log('something', width.value)
      app.width = parseInt(this.value);
    })

    spacing.addEventListener('input', function(){
      console.log('spacing', spacing.value)
      app.spacing = parseInt(this.value);
    })

    spacingTwo.addEventListener('input', function(){
      console.log('spacing', spacing.value)
      app.widthTwo = parseInt(this.value);
    })

    btn.addEventListener('click', function(){
      app.value = grabInputValue(input)
    });

    circleMode.addEventListener('click', function(){
      console.log('circle mode', this.value)
      app.squareMode = !app.squareMode;

      app.squareMode ? changeInputNames('square', heightOne, heightTwo) : changeInputNames('circle', heightOne, heightTwo)

    })



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


function changeInputNames(modeControls, controlOne, controlTwo){

  if(modeControls === 'circle'){
    controlOne.labels[0].innerHTML = 'radius';
    controlTwo.labels[0].style.display = 'none';
    controlTwo.style.display = 'none'
  }
  else if(modeControls === 'square'){
    controlOne.labels[0].innerHTML = 'HeightOne';
    controlTwo.labels[0].style.display = 'inline-block';
    controlTwo.style.display = 'inline-block'

  }



}


function elementCreater(element, className, type, min, max, value, step){
  console.log(min)
    var element = document.createElement(element);
    element.type = type;
    element.min  = min || null;
    element.max  = max || null;
    element.value = value || null;
    element.step = step || null;
    element.className = className || '';
    return element
}



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

    var arrTwo = new Uint8Array(bufferLength)

    // getFloatTimeDomainData gets the current waveform being played
    // analyzer.fftSize is a constant which denotes the size of the Fast Fourier Transform
    // var array = new Float32Array(analyzer.fftSize);
    // analyzer.getFloatTimeDomainData(array)


    // function playPause(){
    //     if()
    // }

    var cvas = document.getElementById('layer2');
    var cxt = cvas.getContext('2d')


    function drawLayer1(){
        requestAnimationFrame(drawLayer1);


        // cxt.fillStyle = 'black';
        // cxt.fillRect(0, 0, 500, 500)
        cxt.clearRect(0, 0, cvas.width, cvas.height)

        // console.log(arr)
        // console.log(bufferLength, ' this is bufferLength')

        analyzer.getByteFrequencyData(arrTwo);

        // ctx.lineWidth = 50;
        // ctx.strokeStyle = randColor();
        // ctx.beginPath();

      var sliceWidth = app.spacing;
      var x = 0;

      for(var i = 0; i < 1024; i++) {

        var v = arrTwo[i] / 180.0;

        // console.log(v, '----this is v')

        // console.log('canvas height: ', canvas.height, " i: ", arr[i])
        var y = v * (cvas.height / 2);

        if(i === 0){
          cxt.moveTo(x, y);
        }
        else {
          if(app.squareMode){
            cxt.fillStyle = 'white';
            cxt.fillRect(x, y, app.white, v + 3);
          }


        }

          if (x > 700){
            x -= sliceWidth;
          }
          else {
            x += sliceWidth;
          }
        }//end of llops
      }//end of draw layer

    drawLayer1()








    // function drawBackground(){
    //   var cvas = document.getElementById('layer2');
    //   var cxt = cvas.getContext('2d')

    //   cxt.fillStyle = 'green';
    //   cxt.fillRect(0, 0, 500, 500);
    // }

    // drawBackground()

     var canvas = document.getElementById('layer1');
     var ctx = canvas.getContext('2d')

     function draw(){
        requestAnimationFrame(draw);

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // console.log(arr)
        // console.log(bufferLength, ' this is bufferLength')

        analyzer.getByteFrequencyData(arr);
        analyzer.getByteFrequencyData(arrTwo);
        // ctx.lineWidth = 50;
        // ctx.strokeStyle = randColor();
        // ctx.beginPath();

      var sliceWidth = app.spacing;
      var x = 0;

      for(var i = 0; i < 1024; i++) {

        var v = arr[i] / 230.0;
        var k = arrTwo[i] / 400;
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

          if(app.squareMode){
            ctx.fillStyle = app.value
            ctx.fillRect(x, y, v + app.width, app.height);
            ctx.fillStyle = 'rgb(' + app.rValue + ',' + app.gValue + ',' + app.bValue + ')'
            ctx.fillRect(x + 3, y + 3, k + app.widthTwo, app.heightTwo)
          }
          else{

            createCirles(40, 30, ctx, x, y, v)
            // ctx.beginPath();
            // ctx.arc(x + 3, y, v * app.height, 0, 2 * Math.PI, false);
            // ctx.lineWidth = 0.5;
            // ctx.strokeStyle = app.value;
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();
            // // ctx.arc(x + 3, y - 50, v + app.width, 0, 2 * Math.PI, false);
            // // ctx.arc(x + 3, y - 100, v + app.width, 0, 2 * Math.PI, false);
            // ctx.beginPath();
            // ctx.moveTo(x + 3, y + 30)
            // ctx.arc(x + 20, y + 30, v * app.height, 0, Math.cos(2 * Math.PI) * 100, false);
            // ctx.strokeStyle = app.value;
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();


            // ctx.beginPath();
            // ctx.moveTo(x + 3, y + 60)
            // ctx.arc(x + 3, y + 60, v * app.height, 0, Math.cos(2 * Math.PI), false);
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();
          }


        }
        else if (x % 2 === 0){
          ctx.fillStyle = randRGB('blue', app.gValue);
          ctx.fillRect(x, y, v + 2, 100);
        }
        else {

          if(app.squareMode){
            ctx.fillStyle = 'rgb(' + app.rValue + ',' + app.gValue + ',' + app.bValue + ')' || 'black'
            ctx.fillRect(x, y, v + app.width, app.height);
            ctx.fillStyle = 'rgb(' + app.gValue + ',' + app.rValue + ',' + app.bValue + ')' || 'black'
            ctx.fillRect(x + 3, y + app.width + 1, k + app.widthTwo, app.heightTwo);
          }
          else {
            // ctx.beginPath();
            // ctx.arc(x + 3, y, v * app.height, 0, 2 * Math.PI, false);
            // ctx.lineWidth = 0.5;
            // ctx.strokeStyle = app.value;
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();
            // // ctx.arc(x + 3, y - 50, v + app.width, 0, 2 * Math.PI, false);
            // // ctx.arc(x + 3, y - 100, v + app.width, 0, 2 * Math.PI, false);
            // ctx.beginPath();
            // ctx.moveTo(x + 3, y + 30)
            // ctx.arc(x + 3, y + 30, v * app.height, 0, 2 * Math.PI, false);
            // ctx.strokeStyle = app.value;
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();


            // ctx.beginPath();
            // ctx.moveTo(x + 3, y + 60)
            // ctx.arc(x + 3, y + 60, v * app.height, 0, 2 * Math.PI, false);
            // ctx.fillStyle = randColor();
            // ctx.fill();
            // ctx.stroke();
          }

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
            x -= sliceWidth - 500;
          }
          else {
            x += sliceWidth;
          }

     }// end of for loop

   }

        draw()

};


function createCirles(numberOfCirlces, distance, ctx, x, y, v){

  for (var i = 0; i < numberOfCirlces; i ++){


      ctx.moveTo(x + 3, y + distance)
      ctx.beginPath();
      ctx.arc(x + app.x, y + distance, v * app.height, 0, 2 * Math.PI, false);
      ctx.lineWidth = app.lineWidth;
      ctx.strokeStyle = app.value;
      ctx.fillStyle = randColor();
      ctx.fill();
      ctx.stroke();
      distance += 30
  }
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









