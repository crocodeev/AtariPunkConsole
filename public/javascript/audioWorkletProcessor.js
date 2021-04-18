const saw = value => value - Math.floor(value);


class CUSTOMOSC extends AudioWorkletProcessor {

    constructor(){
        super();
        this.counter = 0;
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
    

    //inputs - несколько входов, каждый может иметь несколько каналов
    //outputs - несколько выходов, каждый может иметь несколько каналов
    //channel - свойства, какие?
    // 128 сэмплов со значение от -1 до 1
    //parameters - кастомные или по уомлчанию? 
    //https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process 

    process (inputs, outputs, parameters) {
        //т.к. у нас генератор, входы не нужны
        //берём первый выход      
        const output = outputs[0] 
        //устанавливаем частоту
        const freqs = parameters.frequency
        //для каждого канала
        output.forEach(channel => {
          for (let i = 0; i < channel.length; i++) {

            // изменилось значение частоты или неt
            const freq = freqs.length > 1 ? freqs[i] : freqs[0]
            //https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope - о текущем времени и сэмрл рйете
            //https://github.com/GoogleChromeLabs/web-audio-samples/issues/188
            const globTime = currentTime + i / sampleRate
            //переменная, вероятно нужна для сдвига
            this.d += globTime * (this.prevFreq - freq)
            this.prevFreq = freq 
            const time = globTime * freq + this.d
            const vibrato = 0 // Math.sin(globTime * 2 * Math.PI * 7) * 2
            // for sinus wave
            //f(x) = A sin (ωt + φ)
    
            
            channel[i] = Math.sin(2*Math.PI * freqs[0] * (currentTime + i / sampleRate))
    
            

          }
        })
        //продолжает выполнение процесса
        return true
      }  
}

registerProcessor('custom-osc', CUSTOMOSC)