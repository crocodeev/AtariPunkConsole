import oscilloscope from './oscilloscope.js'


class CUSTOMOSCNODE extends AudioWorkletNode {
    constructor(context) {
      super(context, 'custom-osc');
    }
  }

let canvas   = document.getElementById("oscilloscope");
let customoscnode 

window.onload= () => {
    let accept = confirm("Start audio context?");
    if(accept){
      window.ac = new (
        window.AudioContext||
        window.webkitAudioContext||
        function() { throw "Browser does not support Web Audio API";}
      )();

      window.analyser = oscilloscope(ac, canvas)

      ac.audioWorklet.addModule('./javascript/audioWorkletProcessor.js')
      .then(() => {
        customoscnode = new CUSTOMOSCNODE(ac);
      })
      .catch(error => console.log(error));


    }else{
          alert("No context - no noise");
      }
    }
  

let playBtn = document.getElementById('customstart');

playBtn.addEventListener('click', () => {

  console.log(customoscnode);
  customoscnode.connect(analyser);
  analyser.connect(ac.destination);
  //customoscnode.connect(ac.destination);
  //https://stackoverflow.com/questions/57921909/how-to-code-an-oscillator-using-audioworklet 

});

//stop button

let stopBtn = document.getElementById('customstop');

stopBtn.addEventListener('click', () => {
  pulseOsc.stop();
  pulseOsc.disconnect();
});