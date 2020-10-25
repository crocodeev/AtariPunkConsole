let  oscilloscope = function (context, element, params={
  "graphic":{
    "strokeColor":"rgb(255,255,0)",
    "strokeWidth":5,
    "bgColor":"rgb(0,0,0)",
    "speed":""
  },
  "audio":{
    "fftSize":2048,
    "smoothingTimeConstant":1,
  }
}) {

  let analyser = context.createAnalyser();

  analyser.height = element.height;
  analyser.width  = element.width;
  analyser.strokeColor = params.graphic.strokeColor;
  analyser.strokeWidth = params.graphic.strokeWidth;

  analyser.fftSize               = params.audio.fftSize;
  analyser.smoothingTimeConstant = params.audio.smoothingTimeConstant;

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

//create graphic context and blcak rectange

  let gc = element.getContext('2d');
  gc.fillStyle = params.graphic.bgColor;
  gc.fillRect(0,0,element.width, element.height);

//create function for draw wave

  function draw() {

//create animation
    let drawVisual = requestAnimationFrame(draw);

//copy current waveform to dataArray
    analyser.getByteTimeDomainData(dataArray);

//clean background
    gc.fillStyle = 'rgb(0, 0, 0)';
    gc.fillRect(0, 0, element.width, element.height);

//draw line

    gc.lineWidth = 5;
    gc.strokeStyle = 'rgb(255, 255, 0)';
    gc.beginPath();
    // define segment lenght
    let sliceWidth = element.width * 1.0 / bufferLength;
    //x-axis coordinate
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {

    //y-axis coordinate
    let v = dataArray[i] / 128.0;
    let y = v * element.height/2;

    if(i === 0) {
      gc.moveTo(x, y);
    } else {
      gc.lineTo(x, y);
    }
    //move to next segment
    x += sliceWidth;
    }
    //gc.lineTo(element.width, element.height/2);
    gc.stroke();
    //more time smoothing
    setTimeout(draw, params.graphic.speed);
  }

    draw()

    return analyser;
}

export { oscilloscope }
