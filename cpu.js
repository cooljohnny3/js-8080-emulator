class CPU {    
    A = 0; // Accumulator
    B = 0;
    C = 0;
    D = 0;
    E = 0;
    H = 0;
    L = 0;

    PC = 0; // Program Counter
    SP = 0xffff-1; // Stack Pointer

    flags = {
        Z: 1, // Zero
        S: 0, // Sign
        P: 0, // Parity
        CY: 0, // Carry
        AC: 0, // Aux Carry
    };

    constructor(memory) {
        this.memory = memory;
    }

    load(program) {
        for(let index in program) {
            if(program[index].toString(16).length > 2)
                // Return index of error
                return index;
            this.memory[index] = program[index];
        }
    }

    cycle() {
        let answer, address, temp;
        // fetch
        let opcode = this.memory[this.PC];
        //execute
        switch(opcode) {
            case 0x00: // NOP
                break;
            case 0x01: // LXI B,D16
                this.B = this.memory[this.PC+2];
                this.C = this.memory[this.PC+1];
                this.PC += 2;
                break;
            case 0x02: // STAX B
                this.memory[this.BC] = this.A;
                break;
            case 0x03: // INX B
                this.BC +=1;
                break;
            case 0x04: // INR B
                this.B += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x05: // DCR B
                this.B -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x06: // MVI B,D8
                this.B = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x07: // RLC
                this.flags.CY = this.A.toString(2).charAt(0);
                this.A = ((this.A << 1) & 0xff) | this.flags.CY;
                break;
            case 0x08: // -
                break;
            case 0x09: // DAD B
                answer = this.HL + this.BC;
                this.flags.CY = answer > 65534 ? 1 : 0;
                this.HL = answer;
                break;
            case 0x0a: // LDAX B
                this.A = this.memory[this.BC];
                break;
            case 0x0b: // DCX B
                this.BC -=1;
                break;
            case 0x0c: // INR C
                this.C += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x0d: // DCR C
                this.C -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x0e: // MVI C,D8
                this.C = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x0f: // RRC
                this.flags.CY = this.A.toString(2).charAt(this.A.toString(2).length-1);
                this.A = (this.A >> 1) | (this.flags.CY << 7);
                break;
            case 0x10: // -
                break;
            case 0x11: // LXI D,D16
                this.D = this.memory[this.PC+2];
                this.E = this.memory[this.PC+1];
                this.PC += 2;
                break;
            case 0x12: // STAX D
                this.memory[this.DE] = this.A;
                break;
            case 0x13: // INX D
                this.DE += 1;
                break;
            case 0x14: // INR D
                this.D += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x15: // DCR D
                this.D -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x16: // MVI D,D8
                this.D = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x17: // RAL
                this.flags.CY = this.A.toString(2).charAt(0);
                this.A = (this.A << 1) & 0xff;
                break;
            case 0x19: // DAD D
                answer = this.HL + this.DE;
                this.flags.CY = answer > 65534 ? 1 : 0;
                this.HL = answer;
                break;
            case 0x1a: // LDAX D
                this.A = this.memory[this.DE];
                break;
            case 0x1b: // DCX D
                this.DE -=1;
                break;
            case 0x1c: // INR E
                this.E += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x1d: // DCR E
                this.E -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x1e: // MVI E,D8
                this.E = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x1f: // RAR
                this.flags.CY = this.A.toString(2).charAt(this.A.toString(2).length-1);
                this.A = this.A >> 1;
                break;
            case 0x20: // -
                break;
            case 0x21: // LXI H,D16
                this.H = this.memory[this.PC+2];
                this.L = this.memory[this.PC+1];
                this.PC += 2;
                break;
            case 0x22: // SHLD adr
                this.memory[this.PC+1] = this.L;
                this.memory[this.PC+2] = this.H;
                this.PC += 2;
                break;
            case 0x23: // INX H
                this.HL +=1;
                break;
            case 0x24: // INR H
                this.H += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x25: // DCR H
                this.H -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x26: // MVI H,D8
                this.H = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x27: // DAA
                console.log("special");
                break;
            case 0x28: // -
                break;
            case 0x29: // DAD H
                answer = this.HL + this.HL;
                this.flags.CY = answer > 65534 ? 1 : 0;
                this.HL = answer;
                break;
            case 0x2a: // SHLD adr
                this.L = this.memory[this.PC+1];
                this.H = this.memory[this.PC+2];
                this.PC += 2;
                break;
            case 0x2b: // DCX H
                this.HL -=1;
                break;
            case 0x2c: // INR L
                this.L += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x2d: // DCR L
                this.L -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x2e: // MVI L,D8
                this.L = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x2f: // CMA (not)
                // TODO: check if correct
                this.A = ~this.A;
                break;
            case 0x30: // -
                break;
            case 0x31: // LXI SP,D16
                this.SP = this.parseAddress();
                this.PC += 2;
                break;
            case 0x32: // STA adr
                address = this.parseAddress();
                this.memory[address] = this.A;
                this.PC += 2;
                break;
            case 0x33: // INX SP
                this.SP += 1;
                break;
            case 0x34: // INR E
                this.HL += 1;
                break;
            case 0x35: // DCR E
                this.HL -= 1;
                break;
            case 0x36: // MVI M,D8
                this.memory[this.HL] = this.memory[this.PC+1];
                this.PC += 1;
                break;
            case 0x37: // STC
                this.flags.CY = 1;
                break;
            case 0x38: // -
                break;
            case 0x39: // DAD SP
                answer = this.HL + this.SP;
                this.flags.CY = answer > 65534 ? 1 : 0;
                this.HL = answer;
                break;
            case 0x3a: // LDA adr
                this.A = this.memory[parsetInt(`${this.memory[this.PC+2]}${this.memory[this.PC+1]}`)];
                this.PC += 2;
                break;
            case 0x3b: // DCX SP
                this.SP -= 1;
                break;
            case 0x3c: // INR A
                this.A += 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x3d: // DCR A
                this.A -= 1;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                break;
            case 0x3e: // MVI A,D8
                this.A = this.memory[this.PC+1]
                break;
            case 0x3f: // CMC
                this.flags.CY = !this.flags.CY;
                break;
            case 0x40: // MOV B,B
                this.B = this.B;
                break;
            case 0x41: // MOV B,C
                this.B = this.C;
                break;
            case 0x42: // MOV B,D
                this.B = this.D; 
                break;
            case 0x43: // MOV B,E
                this.B = this.E;
                break;
            case 0x44: // MOV B,H
                this.B = this.H;
                break;
            case 0x45: // MOV B,L
                this.B = this.L; 
                break;
            case 0x46: // MOV B,M
                this.B = this.meory[this.HL];
                break;
            case 0x47: // MOV B,A
                this.B = this.A; 
                break;
            case 0x48: // MOV C,B
                this.B = this.C;  
                break;
            case 0x49: // MOV C,C
                this.C = this.C; 
                break;
            case 0x4a: // MOV C,D
                this.C = this.D;  
                break;
            case 0x4b: // MOV C,E
                this.C = this.E;  
                break;
            case 0x4c: // MOV C,H
                this.C = this.H; 
                break;
            case 0x4d: // MOV C,L
                this.C = this.L; 
                break;
            case 0x4e: // MOV C,M
                this.C = this.memory[this.HL];
                break;
            case 0x4f: // MOV C,A
                this.C = this.A; 
                break;
            case 0x50: // MOV D,B
                this.D = this.B; 
                break;
            case 0x51: // MOV D,C
                this.D = this.C; 
                break;
            case 0x52: // MOV D,D
                this.D = this.D; 
                break;
            case 0x53: // MOV D,E
                this.D = this.E; 
                break;
            case 0x54: // MOV D,H
                this.D = this.H; 
                break;
            case 0x55: // MOV D,L
                this.D = this.L; 
                break;
            case 0x56: // MOV D.M
                this.D = this.memory[this.HL];
                break;
            case 0x57: // MOV D,A
                this.D = this.A;  
                break;
            case 0x58: // MOV E,B
                this.E = this.B;  
                break;
            case 0x59: // MOV E,C
                this.E = this.C;  
                break;
            case 0x5a: // MOV E,D
                this.E = this.D;  
                break;
            case 0x5b: // MOV E,E
                this.E = this.E;  
                break;
            case 0x5c: // MOV E,H
                this.E = this.B;  
                break;
            case 0x5d: // MOV E,L
                this.E = this.B;  
                break;
            case 0x5e: // MOV E,M
                this.E = this.memory[this.HL];
                break;
            case 0x5f: // MOV E,A
                this.E = this.A;  
                break;
            case 0x60: // MOV H,B
                this.H = this.B;  
                break;
            case 0x61: // MOV H,C
                this.H = this.C;  
                break;
            case 0x62: // MOV H,D
                this.H = this.D;  
                break;
            case 0x63: // MOV H,E
                this.H = this.E;  
                break;
            case 0x64: // MOV H,H
                this.H = this.B;  
                break;
            case 0x65: // MOV H,L
                this.H = this.B;  
                break;
            case 0x66: // MOV H,M
                this.H = this.memory[this.HL];
                break;
            case 0x67: // MOV H,A
                this.H = this.A;  
                break;
            case 0x68: // MOV L,B
                this.L = this.B;
                break;
            case 0x69: // MOV L,C
                this.L = this.C;
                break;
            case 0x6a: // MOV L,D
                this.L = this.D;
                break;
            case 0x6b: // MOV L,E
                this.L = this.E;
                break;
            case 0x6c: // MOV L,H
                this.L = this.H;
                break;
            case 0x6d: // MOV L,B
                this.L = this.B;
                break;
            case 0x6e: // MOV L,M
                this.L = this.memory[this.HL];
                break;
            case 0x6f: // MOV L,A
                this.L = this.A;
                break;
            case 0x70: // MOV M,B
                this.memory[this.HL] = this.B;
                break;
            case 0x71: // MOV M,C
                this.memory[this.HL] = this.C;
                break;
            case 0x72: // MOV M,D
                this.memory[this.HL] = this.D;
                break;
            case 0x73: // MOV M,E
                this.memory[this.HL] = this.E;
                break;
            case 0x74: // MOV M,H
                this.memory[this.HL] = this.H;
                break;
            case 0x75: // MOV M,L
                this.memory[this.HL] = this.L;
                break;
            case 0x76: // HLT
                console.log("Halted");
                return true;
            case 0x77: // MOV M,A
                this.memory[this.HL] = this.A;
                break;
            case 0x78: // MOV A,B
                this.A = this.B;
                break;
            case 0x79: // MOV A,C
                this.A = this.C;
                break;
            case 0x7a: // MOV A,D
                this.A = this.D;
                break;
            case 0x7b: // MOV A,E
                this.A = this.E;
                break;
            case 0x7c: // MOV A,H
                this.A = this.H;
                break;
            case 0x7d: // MOV A,L
                this.A = this.L;
                break;
            case 0x7e: // MOV A,M
                this.A = this.memory[this.HL];
                break;
            case 0x7f: // MOV A,A
                this.A = this.A;
                break;
            case 0x80: // ADD B
                answer = this.A + this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x81: // ADD C
                answer = this.A + this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x82: // ADD D
                answer = this.A + this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x83: // ADD E
                answer = this.A + this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x84: // ADD H
                answer = this.A + this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x85: // ADD L
                answer = this.A + this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x86: // ADD M
                answer = this.A + this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x87: // ADD A
                answer = this.A + this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x88: // ADC B
                answer = this.A + this.B + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x89: // ADC C
                answer = this.A + this.B + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x8a: // ADC D
                answer = this.A + this.D + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x8b: // ADC E
                answer = this.A + this.E + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x8c: // ADC H
                answer = this.A + this.H + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x8d: // ADC L
                answer = this.A + this.L + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x86: // ADC M
                answer = this.A + this.memory[this.HL] + this.flags.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x8f: // ADC A
                answer = this.A + this.A + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x90: // SUB B
                answer = this.A - this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x91: // SUB C
                answer = this.A - this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x92: // SUB D
                answer = this.A - this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x93: // SUB E
                answer = this.A - this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x94: // SUB H
                answer = this.A - this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x95: // SUB L
                answer = this.A - this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
    
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x96: // SUB M
                answer = this.A - this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x97: // SUB A
                answer = this.A - this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x98: // ADC B
                answer = this.A - this.B - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x99: // ADC C
                answer = this.A - this.B - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x9a: // ADC D
                answer = this.A - this.D - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x9b: // ADC E
                answer = this.A - this.E - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x9c: // ADC H
                answer = this.A - this.H - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x9d: // ADC L
                answer = this.A - this.L - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0x96: // SUB M
                answer = this.A - this.memory[this.HL] - this.flags.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.A = answer;
                break;
            case 0x9f: // ADC A
                answer = this.A - this.A - this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                break;
            case 0xa0: // ANA B
                this.A = this.A & this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa1: // ANA C
                this.A = this.A & this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa2: // ANA D
                this.A = this.A & this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa3: // ANA E
                this.A = this.A & this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa4: // ANA H
                this.A = this.A & this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa0: // ANA L
                this.A = this.A & this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa1: // ANA M
                this.A = this.A & this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa7: // ANA A
                this.A = this.A & this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa8: // XRA B
                this.A = this.A ^ this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xa9: // XRA C
                this.A = this.A ^ this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xaa: // XRA D
                this.A = this.A ^ this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xab: // XRA E
                this.A = this.A ^ this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xac: // XRA H
                this.A = this.A ^ this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xad: // XRA L
                this.A = this.A ^ this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xae: // XRA M
                this.A = this.A ^ this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xaf: // XRA A
                this.A = this.A | this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb0: // ORA B
                this.A = this.A | this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb1: // ORA C
                this.A = this.A | this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb2: // ORA D
                this.A = this.A | this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb3: // ORA E
                this.A = this.A | this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb4: // ORA H
                this.A = this.A | this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb5: // ORA L
                this.A = this.A | this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb6: // ORA M
                this.A = this.A | this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb7: // ORA A
                this.A = this.A | this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb8: // CMP B
                answer = this.A - this.B;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xb9: // CMP C
                answer = this.A - this.C;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xba: // CMP D
                answer = this.A - this.D;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xbb: // CMP E
                answer = this.A - this.E;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xbc: // CMP H
                answer = this.A - this.H;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xbd: // CMP L
                answer = this.A - this.L;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xbd: // CMP M
                answer = this.A - this.memory[this.HL];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xbf: // CMP A
                answer = this.A - this.A;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                break;
            case 0xc0: // RNZ
                if(this.flags.Z != 1)
                    this.return();
                break;
            case 0xc1: // POP B
                this.C = this.memory[this.SP];
                this.B = this.memory[this.SP+1];
                this.SP += 2;
                break;
            case 0xc2: // JNZ adr
                if(this.flags.Z != 0) {
                    this.jump(this.parseAddress());
                } else {
                    this.PC += 2;
                }
                break;
            case 0xc3: // JMP adr
                this.jump(this.parseAddress());
                break;
            case 0xc4: // CNZ adr
                if(this.flags.Z != 1) {
                    this.call(parseAddress());
                }
                break;
            case 0xc5: // PUSH B
                this.memory[this.SP-2] = this.C;
                this.memory[this.SP-1] = this.B;
                this.SP -= 2;
                break;
            case 0xc6: // ADI D8
                answer = this.A + this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                this.PC += 1;
                break;
            case 0xc7: // RST 0
                this.call(0);
                break;
            case 0xc8: // RZ
                if(this.flags.Z == 0)
                    this.return();
                break;
            case 0xc9: // RET
                this.return();
                break;
            case 0xca: // JZ adr
                if(this.flags.Z == 0) 
                    this.jump()
                else
                    this.Pc += 2;
                break;
            case 0xcb: // -
                break;
            case 0xcc: // CZ adr
                if(this.flags.Z == 1)
                    this.call(this.parseAddress());
                else
                    this.PC += 2;
                break;
            case 0xcd: // CALL adr
                this.call(this.parseAddress());
                break;
            case 0xce: // ACI D8
                answer = this.A + this.memory[this.PC+1] + this.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                this.PC += 1;
                break;
            case 0xcf: // RST 1
                this.call(8);
                break;
            case 0xd0: // RNC
                if(this.flags.CY != 1)
                    this.return();
                break;
            case 0xd1: // POP D
                this.E = this.memory[this.SP];
                this.D = this.memory[this.SP+1];
                this.SP += 2;
                break;
            case 0xd2: // JNC adr
                if(this.flags.CY != 1)
                    this.jump(this.parseAddress());
                else 
                    this.PC += 2;
                break;
            case 0xd3: // OUT D8
                console.log("special");
                this.PC += 1;
                break;
            case 0xd4: // CNC adr
                if(this.flags.CY != 1)
                    this.call(this.parseAddress());
                    this.PC += 2;
                break;
            case 0xd5: // PUSH D
                this.memory[this.SP-2] = this.E;
                this.memory[this.SP-1] = this.D;
                this.SP -= 2;
                break;
            case 0xd6: // SUI D8
                answer = this.A - this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                this.PC += 1;
                break;
            case 0xd7: // RST 2
                this.call(10);
            case 0xd8: // RC
                if(this.flags.CY)
                    this.return();
                break;
            case 0xd9: // -
                break;
            case 0xda: // JC adr
                if(this.flags.CY == 1) {
                    this.PC = this.parseAddress();
                    console.log('Jumping to ' + this.PC);
                } else {
                    this.PC += 2;
                }
                break;
            case 0xdb: // IN D8
                console.log('spacial');
                this.PC += 1;
                break;
            case 0xdc: // CC adr
                if(this.flags.CY == 1)
                    this.call(this.parseAddress());
                else
                    this.PC += 2;
                break;
            case 0xdd: // -
                break;
            case 0xde: // SBI D8
                answer = this.A - this.memory[this.PC+1] + this.flags.CY;
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: impliment AC check
                this.A = answer;
                this.PC += 1;
                break;
            case 0xdf: // RST 3
                this.call(18);
                break;
            
            case 0xe1: // POP H
                this.L = this.memory[this.SP];
                this.H = this.memory[this.SP+1];
                this.SP += 2;
                break;
            
            case 0xe3: // XTHL
                this.L = this.memory[this.SP];
                this.H = this.memory[this.SP+1]
                break;

            case 0xe5: // PUSH H
                this.memory[this.SP-2] = this.L;
                this.memory[this.SP-1] = this.H;
                this.SP -= 2;
                break;
            case 0xe6: // ANI D8
                // TODO: Verfy if correct
                answer = this.A & this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.A = answer;
                this.PC += 1;
                break;
            case 0xe7: // RST 4
                this.call(20);
                break;
                
            case 0xe9: // PCHL
                this.PC = parseInt(`${this.memory[this.H].toString(16)}${this.memory[this.L].toString(16)}`);
                break;
            
            case 0xeb: // XCHG
                temp = cpu.H;
                cpu.H = cpu.D;
                cpu.D = temp;
                temp = cpu.L;
                cpu.L = cpu.E;
                cpu.E = temp;
                break;
            
            case 0xed: // -
                break;
            case 0xee: // XRI D8
                this.A = this.A ^ this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.PC += 1;
                break;
            case 0xef: // RST 5
                this.call(28);
                break;
            case 0xf0: // RP
                if(this.flags.P == 1)
                    this.return();
                break;
            
            case 0xf2: // JP adr
                if(this.flags.P == 1)
                    this.PC = this.parseAddress();
                else
                    this.PC += 2;
                break;
            case 0xf3: // DI
                console.log('special');
                break;
            case 0xf4: // CP adr
                if(this.flags.P == 1)
                    this.call(this.parseAddress());
                else
                    this.PC += 2;
                break;
            
            case 0xf6: // ORI D8
                this.A = this.A | this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;

                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);

                // TODO: implement AC check
                this.PC += 1;
                break;
            case 0xf7: // RST 6
                this.call(30);
                break;
            
            case 0xf9: // SPHL
                this.SP = this.HL;
                break;
            
            case 0xfb: // EI
                console.log("special");
                break;       
            
            case 0xfd: // -
                break;
            case 0xfe: // CPI D8
                answer = this.A - this.memory[this.PC+1];
                this.flags.Z = answer == 0 ? 1 : 0;
                this.flags.S = answer < 0 ? 1 : 0;
                this.flags.CY = answer > 127 ? 1 : 0;
                // TODO: implement parity check
                // this.flags.P = checkParity(answer & 0xff);
    
                // TODO: implement AC check
                this.PC += 1;
                break;
            case 0xff: // RST 7
                this.call(38);
            default: this.unimplimented(opcode);
        }
        this.PC += 1;
    }

    unimplimented(code) {
        console.log('Unimplimented instruction ' + code);
    }

    parseAddress() {
        return parseInt(`${this.memory[this.PC+2]}${this.memory[this.PC+1]}`);
    }

    jump(address) {
        this.PC = address;
    }

    call(address) {
        let returnAddress = this.PC + 2;
        this.memory[this.SP-1] = (returnAddress >> 7) & 0xff;
        this.memory[this.SP-2] = returnAddress & 0xff;
        this.SP -= 2;
        this.PC = address;
    }

    return() {
        this.PC = this.memory[this.SP] | (this.memory[this.SP-1] << 7);
        this.SP += 2;
    }


    get BC() {
        return (this.B << 8) | this.C;
    }

    set BC(val) {
        this.B = (val & 0xff00) >> 8;
        this.C = val & 0x00ff;
    }

    get DE() {
        return (this.D << 8) | this.E;
    }

    set DE(val) {
        this.D = (val & 0xff00) >> 8;
        this.E = val & 0x00ff;
    }

    get HL() {
        return (this.H << 8) | this.L;
    }

    set HL(val) {
        this.H = (val & 0xff00) >> 8;
        this.L = val & 0x00ff;
    }
}

export default CPU;