import CPU from "./cpu.js";

class Emulator {
    cpu;
    stop;
    delay = 0;
    prevImageData;
    prevCpuPC;
    debugVideo = true;
    debugState = true;
    debugMemory = false;
    prevSearchAddress;

    memory = new Proxy(new Uint8Array(new ArrayBuffer(0xffff)), {
        set: (target, index, value) => {
            target[index] = value;
            if(this.debugVideo && index >= 0x2400 && index < 0x4000)
                this.updatePixels(index);
            if(this.debugMemory)
                this.updateByte(index);
            return true;
        },

        get: (target, prop) => {
            if(prop == 'length')
                return target.length;
            return target[prop];
        }
    });

    constructor() {
        this.init().then(() => {
            document.getElementById('loading-div').style.display = 'none';
            document.getElementById('container').style.visibility = 'visible';
            this.resizeCanvasToDisplaySize(document.getElementById("video-display"));
            this.blankVideoDisplay();
        });
    }

    async init() {
        this.cpu = new CPU(this.memory);
        this.prevCpuPC = 0;
        this.stop = true;
        if(this.debugState)
            this.updateStateDisplay();
        if(this.debugMemory)
            this.initMemoryDisplay();
        if(this.debugVideo)
            this.blankVideoDisplay();
    }

    initMemoryDisplay() {
        let newMemoryDiv = document.createElement('div');
        newMemoryDiv.id = 'memory';
    
        let byteElement;
        for(let byteIndex in this.memory) {
            byteElement = document.createElement('span');
            byteElement.id = `memory-${byteIndex}`;
    
            byteElement.textContent += '00';
    
            newMemoryDiv.appendChild(byteElement);
    
            if(byteIndex != this.memory.length) {
                newMemoryDiv.appendChild(document.createTextNode(' '));
            }
        }
        let bottomDiv = document.getElementById('bottom');
        bottomDiv.replaceChild(newMemoryDiv, bottomDiv.children[1]);
    }
    
    async run() {
        this.stop = false;
        let program = document.getElementById('code-input')
            .value.split(' ')
            .map((e) =>  parseInt(e, 16));
        let index = this.cpu.load(program);
        if(index) {
            this.displayError(index);
            return;
        }
        
        while(this.cpu.PC < this.cpu.SP && !this.stop) {
            this.prevCpuPC = this.cpu.PC;
            if(this.cpu.cycle()) break;
            if(this.debugState) this.updateStateDisplay();
            if(this.debugMemory) this.updatePCHighlight();
            await this.sleep();
        }
    }
    
    displayError(index) {
        alert(`Error found at index ${index}`);
    }
    
    sleep() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
      }
    
    updateStateDisplay() {
        let registerDiv = document.getElementById('registers');
        let newRegisterDiv = document.createElement('div');
        let registerElement = document.createElement('p');
        registerElement.textContent = 'A: ' + this.cpu.A;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'B: ' + this.cpu.B;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'C: ' + this.cpu.C;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'D: ' + this.cpu.D;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'E: ' + this.cpu.E;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'H: ' + this.cpu.H;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'L: ' + this.cpu.L;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'PC: ' + this.cpu.PC;
        newRegisterDiv.appendChild(registerElement);
        registerElement = document.createElement('p');
        registerElement.textContent = 'SP: ' + this.cpu.SP;
        newRegisterDiv.appendChild(registerElement);
        registerDiv.replaceChild(newRegisterDiv, registerDiv.lastChild);
    
        let flagsDiv = document.getElementById('flags');
        let newFlagsDiv = document.createElement('div');
        let flagElement = document.createElement('p');
        flagElement.textContent = 'Z : ' + this.cpu.flags.Z;
        newFlagsDiv.appendChild(flagElement);
        flagElement = document.createElement('p');
        flagElement.textContent = 'S: ' + this.cpu.flags.S;
        newFlagsDiv.appendChild(flagElement);
        flagElement = document.createElement('p');
        flagElement.textContent = 'P: ' + this.cpu.flags.P;
        newFlagsDiv.appendChild(flagElement);
        flagElement = document.createElement('p');
        flagElement.textContent = 'CY: ' + this.cpu.flags.CY;
        newFlagsDiv.appendChild(flagElement);
        flagElement = document.createElement('p');
        flagElement.textContent = 'AC: ' + this.cpu.flags.AC;
        newFlagsDiv.appendChild(flagElement);
        flagsDiv.replaceChild(newFlagsDiv, flagsDiv.lastChild);
    }
    
    updateMemoryDisplay() {
        let newMemoryDiv = document.createElement('div');
        newMemoryDiv.id = 'memory';
    
        let byteElement;
        for(let byteIndex in this.memory) {
            byteElement = document.createElement('span');
            byteElement.id = `memory-${byteIndex}`;
    
            if(this.memory[byteIndex] < 10) { // Single number
                byteElement.textContent += '0' + this.memory[byteIndex];
            } else if(this.memory[byteIndex] > 10 && this.memory[byteIndex] < 16) { // Single Hex letter
                byteElement.textContent += '0' + this.memory[byteIndex].toString(16).toUpperCase();
            } else {
                byteElement.textContent += this.memory[byteIndex].toString(16).toUpperCase();
            }
    
            if(byteIndex == this.cpu.PC) {
                byteElement.classList.add('pc-highlight');
            }
    
            newMemoryDiv.appendChild(byteElement);
    
            if(byteIndex != this.memory.length) {
                newMemoryDiv.appendChild(document.createTextNode(' '));
            }
        }
        let bottomDiv = document.getElementById('bottom');
        bottomDiv.replaceChild(newMemoryDiv, bottomDiv.children[1]);
    }

    updateByte(index) {
        let byteElement = document.getElementById(`memory-${index}`);
        if(this.memory[index] < 10) { // Single number
            byteElement.textContent = '0' + this.memory[index];
        } else if(this.memory[index] > 10 && this.memory[index] < 16) { // Single Hex letter
            byteElement.textContent = '0' + this.memory[index].toString(16).toUpperCase();
        } else {
            byteElement.textContent = this.memory[index].toString(16).toUpperCase();
        }
    }

    updatePCHighlight() {
        document.getElementById(`memory-${this.prevCpuPC}`).classList.remove('pc-highlight');
        document.getElementById(`memory-${this.cpu.PC}`).classList.add('pc-highlight');
    }
    
    updateVideoDisplay() {
        const canvas = document.getElementById("video-display");
        const ctx = canvas.getContext('2d');
        let imageData = this.prevImageData;

        let index = 0;
        let currentByte;
        let currentBitValue;
        for(let j = 0x2400; j < 0x4000; j++) {
            currentByte = this.memory[j].toString(2);
            for(let i = 0; i < 8; i++) {
                currentBitValue = currentByte.charAt(i);
                if(currentBitValue != imageData.data[index]) {
                    imageData.data[index] = currentBitValue == 1 ? 255 : 0; // R
                    imageData.data[index+1] = currentBitValue == 1 ? 255 : 0; // G
                    imageData.data[index+2] = currentBitValue == 1 ? 255 : 0; // B
                    imageData.data[index+3] = 255; // A
                }
                index += 4;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        this.prevImageData = imageData;
    }

    updatePixels(byteIndex) {
        const canvas = document.getElementById("video-display");
        const ctx = canvas.getContext('2d');
        let imageData = this.prevImageData;

        let index = (byteIndex - 0x2400) * 4 * 8;
        let currentByte = this.memory[byteIndex].toString(2);
        let currentBitValue;
        for(let i = 0; i < 8; i++) {
            currentBitValue = currentByte.charAt(i);
            if(currentBitValue != imageData.data[index]) {
                imageData.data[index] = currentBitValue == 1 ? 255 : 0; // R
                imageData.data[index+1] = currentBitValue == 1 ? 255 : 0; // G
                imageData.data[index+2] = currentBitValue == 1 ? 255 : 0; // B
                imageData.data[index+3] = 255; // A
            }
            index += 4;
        }

        ctx.putImageData(imageData, 0, 0);
        this.prevImageData = imageData;
    }
    
    resizeCanvasToDisplaySize(canvas) {
        // look up the size the canvas is being displayed
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
     
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    
    blankVideoDisplay() {
        const canvas = document.getElementById("video-display");
        const ctx = canvas.getContext('2d');
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        this.prevImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    handleStop() {
        this.stop = !this.stop;
        console.log("Stopping");
    }
    
    updateDelay() {
        this.delay = document.getElementById('delay-input').value;
        if(this.delay < 0) {
            delay = 0;
            document.getElementById('delay-input').value = this.delay;
        }
        console.log("Delay set to " + this.delay);
    }
    
    updateDebugVideo() {
        this.debugVideo = !this.debugVideo;
        if(this.debugVideo) {
            document.getElementById('left-side').style.visibility = 'visible';
            this.updateVideoDisplay();
        } else {
            document.getElementById('left-side').style.visibility = 'hidden';
        }
    }
    
    updateDebugRegisters() {
        this.debugState = !this.debugState;
        if(this.debugState) {
            document.getElementById('state-display').style.visibility = 'visible';
            this.updateStateDisplay();
        } else {
            document.getElementById('state-display').style.visibility = 'hidden';
        }
    }
    
    updateDebugMemory() {
        this.debugMemory = !this.debugMemory;
        if(this.debugMemory) {
            document.getElementById('bottom').style.visibility = 'visible';
            this.updateMemoryDisplay();
        } else {
            document.getElementById('bottom').style.visibility = 'hidden';
        }
    }

    removeSearchHighlight(e) {
        if(e != null && e.target.id == 'clear-button')
            document.getElementById('memory-search-input').value = '';
        if(this.prevSearchAddress != null)
            document.getElementById(`memory-${this.prevSearchAddress}`).classList.remove('search-highlight');
    }

    searchMemory() {
        let searchAddress = parseInt(document.getElementById('memory-search-input').value, 16);
        if(isNaN(searchAddress) || searchAddress >= 0xffff) {
            alert("Invalid address")
            return;
        }
        this.removeSearchHighlight();
        this.prevSearchAddress = searchAddress;
        let byteElement = document.getElementById(`memory-${searchAddress}`);
        byteElement.classList.add('search-highlight');
        byteElement.scrollIntoView(false);
    }
}

export default Emulator;