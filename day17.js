let input = require('fs').readFileSync('./input/day17.txt', 'utf8').replaceAll('\r','')
    .split('\n\n')

function ints(s) {
    return [...s.matchAll(/\d+/g)].map(x => +(x[0]));
}

// BigInt is mandatory for the XOR functions because basic XOR will fix the result to be 32 bits
function comboOp(op) { return [op, op, op, op, A, B, C][op]; }
function adv(ptr) { A = Math.floor(A / Math.pow(2, comboOp(program[ptr+1]))); return ptr+2; }
function bxl(ptr) { B = Number(BigInt(B) ^ BigInt(program[ptr+1])); return ptr+2; }
function bst(ptr) { B = comboOp(program[ptr+1]) % 8; return ptr+2; }
function jnz(ptr) { return A === 0 ? ptr+2 : program[ptr+1]; }
function bxc(ptr) { B = Number(BigInt(B) ^ BigInt(C)); return ptr+2; }
function out(ptr) { output.push(comboOp(program[ptr+1]) % 8); return ptr+2; }
function bdv(ptr) { B = Math.floor(A / Math.pow(2, comboOp(program[ptr+1]))); return ptr+2; }
function cdv(ptr) { C = Math.floor(A / Math.pow(2, comboOp(program[ptr+1]))); return ptr+2; }

let [A,B,C] = ints(input[0]);
let program = ints(input[1]);
let ops = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];
let output = [];

function runProgram(startA, startB, startC) {
    let ptr = 0;
    output = [];
    A = startA; B = startB; C = startC;
    while(ptr < program.length) {
        ptr = ops[program[ptr]](ptr);
    }
    return output.join(',');
}

console.log('part 1:', runProgram(A, B, C));

// my program breaks down into these instructions:
// every loop, we look at the last 3 bits of A (aka, a digit in base-8), and then chop it off
// we do some operations on these last 3 bits, including XORing it with some bigger section of the number
// B = A mod 8
// B = B XOR 3
// C = A / 2^B
// A = A / 8
// B = B XOR 5
// B = B XOR C
// output B mod 8
// jump to top (until A hits 0)

// build the number from the top down in powers of 8 (comparing to the back end of the output)
// this means we never have to worry about B = B XOR C (C coming from higher bits in A)
// because those bits are always accounted for if we build the number this way
function recurse(depth, num, program) {
    if(depth > program.length) return num;
    for(let j=0; j<8; j++) {
        let tempNum = num*8 + j;
        let result = runProgram(tempNum, 0, 0);
        if(program.slice(program.length-depth).join(',') === result) {
            // fix this base-8 digit and try to build the rest of the number
            let ret = recurse(depth+1, tempNum, program);
            if(ret >= 0) return ret; // if negative, the build didn't work so keep trying
        }
    }
    return -1;
}

console.log('part 2:', recurse(1, 0, program));