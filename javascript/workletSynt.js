
class CUSTOMOSCNODE extends AudioWorkletNode {
    constructor(context) {
      super(context, 'custom-osc');
    }
  }

let customoscnode  

window.onload= () => {
    let accept = confirm("Start audio context?");
    if(accept){
      ac = new (
        window.AudioContext||
        window.webkitAudioContext||
        function() { throw "Browser does not support Web Audio API";}
      )();

      ac.audioWorklet.addModule('./javascript/audioWorkletProcessor.js')
      .then(() => {
        customoscnode = new CUSTOMOSCNODE(ac);
      })
      .catch(error => console.log(error));


    }else{
          alert("No context - no noise");
      }
    }
  
let context = new AudioContext();


let playBtn = document.getElementById('customstart');

playBtn.addEventListener('click', () => {

  console.log(customoscnode);
  customoscnode.connect(ac.destination);
  //https://stackoverflow.com/questions/57921909/how-to-code-an-oscillator-using-audioworklet 

});

//stop button

let stopBtn = document.getElementById('customstop');

stopBtn.addEventListener('click', () => {
  pulseOsc.stop();
  pulseOsc.disconnect();
});