import oscilloscope from './oscilloscope.js'


class AstableMultivibratorNode extends AudioWorkletNode {

    constructor(context) {
      super(context, 'astable-multivibrator');
    }
}   

let canvas  = document.getElementById("oscilloscope");
let amv; 

/*
window.ac = new (
  window.AudioContext||
  window.webkitAudioContext||
  function() { throw "Browser does not support Web Audio API";}
)();

window.analyser = oscilloscope(ac, canvas)

ac.audioWorklet.addModule('./javascript/audioWorkletProcessor.js')
.then(() => {
  amv = new AstableMultivibratorNode(ac);
})
.catch(error => console.log(error))
*/

window.onload= () => {
    let accept = confirm("Start audio context?");

    if(accept){
      window.ac = new (
        window.AudioContext||
        window.webkitAudioContext||
        function() { throw "Browser does not support Web Audio API";}
      )();

      window.analyser = oscilloscope(ac, canvas)

      ac.audioWorklet.addModule('./javascript/astableMultivibratorWorklet.js')
      .then(() => {
        amv = new AstableMultivibratorNode(ac);
      })
      .catch(error => console.log(error));
      
    }else{
          alert("No context - no noise");
      }
    }
  
let frequencySlider = document.getElementById('frequency');


let playBtn = document.getElementById('customstart');

playBtn.addEventListener('click', () => {

  if(ac.state === 'suspended'){
    ac.resume()
  }

  console.log(amv);
  amv.connect(analyser);
  amv.connect(ac.destination);
  //https://stackoverflow.com/questions/57921909/how-to-code-an-oscillator-using-audioworklet 

  const amvFrequency = amv.parameters.get('frequency');
  console.log(amvFrequency);

  console.log(frequencySlider);
  
  frequencySlider.addEventListener('change', (event) => {

    amvFrequency.value = Number(event.target.value);
  });


});

//stop button

let stopBtn = document.getElementById('customstop');

stopBtn.addEventListener('click', () => {
  amv.disconnect(ac.destination);
});