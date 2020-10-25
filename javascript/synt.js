
let pulseOsc;
//AudioContext

window.onload= () => {
  let accept = confirm("Start audio context?");
  if(accept){
    ac = new (
      window.AudioContext||
      window.webkitAudioContext||
      function() { throw "Browser does not support Web Audio API";}
    )();

// calculate waveshaper function, for use in pwm oscillator

// this one for squared sawtooth
  let pulseCurve=new Float32Array(256);
  for(var i=0;i<128;i++) {
    pulseCurve[i]= -1;
    pulseCurve[i+128]=1;
  }
// and this one for sawtooth offset
  let constantOneCurve=new Float32Array(2);
  constantOneCurve[0]=1;
  constantOneCurve[1]=1;

//

  ac.createPWM = function() {

    //Use a normal oscillator as the basis of our new oscillator.
    let node=this.createOscillator();
    node.type="sawtooth";

    //Shape the output into a pulse wave.
    let pulseShaper=ac.createWaveShaper();
    pulseShaper.curve=pulseCurve;
    node.connect(pulseShaper);

    //Use a GainNode as our new "width" audio parameter.
    let width=ac.createGain();
    width.gain.value=0; //Default width.
    node.width=width.gain; //Add parameter to oscillator node.
    width.connect(pulseShaper);

    //Pass a constant value of 1 into the width – so the "width" setting is
    //duplicated to its output.
    let constantOneShaper=this.createWaveShaper(); // не совсем понимаю эту часть, нужно разобраться с аудиопараметрами
    constantOneShaper.curve=constantOneCurve;
    node.connect(constantOneShaper);
    constantOneShaper.connect(width);

    //Override the oscillator's "connect" method so that the new node's output
    //actually comes from the pulseShaper.
    node.connect=function() {
      pulseShaper.connect.apply(pulseShaper, arguments); // вспомнить apply
      return node;
    }

    //Override the oscillator's "disconnect" method.
    node.disconnect=function() {
      pulseShaper.disconnect.apply(pulseShaper, arguments);
      return node;
    }

    return node;

  };

    let canvas   = document.getElementById("oscilloscope");
    window.analyser = createOscilloscope(ac, canvas);

  }else{
     alert("No audio context - no music");
  }
};


// create analyzer
function createOscilloscope (context, element, params={
  "graphic":{
    "strokeColor":"rgb(255,255,0)",
    "strokeWidth":5,
    "bgColor":"rgb(0,0,0)",
    "speed":"100"
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

  let drawTime = 0;

  function draw() {

//create animation
    let drawVisual = requestAnimationFrame(draw);
//copy current waveform to dataArray
    analyser.getByteTimeDomainData(dataArray);
//sub function for organized code
    function subDraw() {
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
          gc.lineTo(element.width, element.height/2);
          gc.stroke();
          console.log(dataArray);
    }


    if (context.currentTime < 0.1){
          subDraw();
          analyser.isFirstStart = 0;
          drawTime = context.currentTime;
    }else if (context.currentTime - drawTime >= 0.5) {
          subDraw();
          drawTime = context.currentTime;
    }
    }

    draw();

    return analyser;
}



// play button

let playBtn = document.getElementById('play');

playBtn.addEventListener('click', () => {


  pulseOsc=ac.createPWM();
  pulseOsc.connect(analyser);
  analyser.connect(ac.destination);
  console.log(pulseOsc);
  pulseOsc.start();

});

//stop button

let stopBtn = document.getElementById('stop');

stopBtn.addEventListener('click', () => {
  pulseOsc.stop();
  pulseOsc.disconnect();
});

//frequency slider
let slider = document.getElementById('slider');

slider.addEventListener('input', (event)=>{
  pulseOsc.frequency.value = event.target.value;
});

//pwm slider

let pwmSlider = document.getElementById('pwm');

pwmSlider.addEventListener('input', (event)=>{

 pulseOsc.width.value = event.target.value/100;

});
