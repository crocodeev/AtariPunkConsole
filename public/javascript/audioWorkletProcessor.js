const saw = value => value - Math.floor(value);


class CUSTOMOSC extends AudioWorkletProcessor {

    constructor(){
        super();
        this.counter = 0;
        this.fr = 480;
    }   

    /*
    prevFreq = 440 //предыдущая частота
    d = 0 //??
    */
    // почему статический метод, вместо просто get?
    
    static get parameterDescriptors() {
        return [{
          name: 'frequency',
          defaultValue: 440, //Float32Array
          minValue: 0,
          maxValue: 0.5 * sampleRate,
          automationRate: "a-rate" // чем отличается a от к
        }];
      }
    

    //https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process 

    process (inputs, outputs, parameters) {
            
        const output = outputs[0] 
        const freqs = parameters.frequency
        
        //для каждого канала
        output.forEach(channel => {

          for (let i = 0; i < channel.length; i++) {

            channel[i] = this.counter < this.fr/2 ? 1 : -1;

            if(this.counter < this.fr){
              this.counter++
            }else{
              this.counter = 0
            }
          }
        })
        //продолжает выполнение процесса
        return true
      }  
}

registerProcessor('custom-osc', CUSTOMOSC)