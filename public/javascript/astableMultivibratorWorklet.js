/**
 * Emulation of first osc in atari punk console
 * constant pulse width
 * mutable frequency
 * square waveform
 */


class AstableMultivibrator extends AudioWorkletProcessor {

    constructor(){
        super();
        this.Frequency = 440;
        this.halfWave = Math.floor(sampleRate/this.Frequency/2);
        this.testCounter = 0;
    }

    static get parameterDescriptors(){

        return [
            {
                name: 'frequency',
                defaultValue: 440,
                minValue: 50,
                maxValue: 0.5 * sampleRate,
                automationRate: "k-rate"
            }
        ];
    }

    /**
     * 
     * @param {*} input - входящие данные, массив массивов объектов Float32Array 
     *  1 channel      2 channel и т.д.
     * [ [128 -samples ],         [128 - samples] ]
     *      32-bit floating-point   32-bit floating-point ???
     * инпута не будет, это генератор
     * @param {*} output  - тоже самое
     * @param {*} parameters 
     * @returns 
     */
    process(inputs, outputs, parameters){

        //сигнал моно, используем только один канал
        const output = outputs[0];

        const newFrequency = parameters['frequency'][0]

        if(this.Frequency != newFrequency){

            this.Frequency = newFrequency;
            this.halfWave = Math.floor(sampleRate/this.Frequency/2);
            this.testCounter = 0;
            console.log(this.testCounter);
            console.log(this.halfWave);
        }

        output.forEach(channel => {
            
            for (let i = 0; i < channel.length; i++) {

                channel[i] = this.testCounter < this.halfWave ? 1 : -1;
                
                if(this.testCounter != this.halfWave ){
                    this.testCounter ++;
                }else{
                    this.testCounter = 0;
                }
            }
        });


        // return true for new execution?
        return(true);
    }
}

//что делает данная функция - мэпит процессор?
registerProcessor('astable-multivibrator', AstableMultivibrator);

