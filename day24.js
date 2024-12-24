let input = require('fs').readFileSync('./input/day24.txt', 'utf8').replaceAll('\r','')
    .split('\n\n');

// data setup and parsing
let funcs = {'AND': function(a,b) { return a && b; }, 'OR': function(a,b) { return a || b; },
    'XOR': function(a,b) { return a ^ b; }}

let wires = {}, rules = [], x = [], y = [], z = [];
for(let [wire, val] of input[0].split('\n').map(d => d.split(': '))) {
    wires[wire] = +val;
    if(wire[0] === 'x') x.push(wire);
    if(wire[0] === 'y') y.push(wire);
}
for(let [one, op, two, _, out] of input[1].split('\n').map(d => d.split(' '))) {
    rules.push({"one": one, "func": op, "two": two, "out": out});
    if(out[0] === 'z') z.push(out);
}
x.sort(); y.sort(); z.sort();
const MAXWIRE = +x[x.length-1].substring(1);

// some helper functions
function getDecimal(z) {
    let res = 0, factor = 1;
    for(let val of z) {
        res += val * factor;
        factor *= 2;
    }
    return res;
}
// pass 'x' or 'y' for type, and a decimal value for val
function setBinary(type, val) {
    for(let i=0; i<=MAXWIRE; i++)
        wires[type + String(i).padStart(2, '0')] = 0;
    let i=0;
    while(val > 0) {
        wires[type + String(i++).padStart(2,'0')] = val % 2;
        val = Math.floor(val/2);
    }
}

function swap(out1, out2) {
    let rule1, rule2;
    for(let rule of rules) {
        if(rule.out === out1) rule1 = rule;
        if(rule.out === out2) rule2 = rule;
    }
    if(!rule1 || !rule2) console.log('failed to swap',out1,out2);
    [rule1.out, rule2.out] = [rule2.out, rule1.out];
}

// the main function that runs the circuit
// don't pass it startX or startY to have it run with the values currently in x/y
function solve(startX=-1, startY=-1) {
    if(startX>=0) setBinary('x', startX);
    if(startY>=0) setBinary('y', startY);
    while(true) {
        let done = true;
        for(let rule of rules) {
            if(rule.out in wires) continue;
            else if(rule.one in wires && rule.two in wires) {
                done = false;
                wires[rule.out] = funcs[rule.func](wires[rule.one], wires[rule.two]);
            }
        }
        if(done) break;
    }
    return getDecimal(z.map(d => wires[d]));
}

console.log('part 1:', solve());
// these values were manually found with inspection (see below)
let ans = ['z14','hbk','kvn','z18','dbb','z23','cvh','tfn'];
ans.sort();
console.log('part 2:',ans.join(','));

return;

// if these swaps are uncommented, the machine works in all test cases
// that is, you won't get any failed messages when running the tests
//swap('hbk','z14');
//swap('kvn','z18');
//swap('dbb','z23');
//swap('cvh','tfn');

function printTrace(wire, printFirst=10000) {
    let arr = [wire];
    let count = 0;
    while(arr.length > 0) {
        let w = arr.shift();
        let rule = rules.filter(d => d.out === w);
        if(rule.length > 0) {
            rule = rule[0];
            arr.push(rule.one); arr.push(rule.two);
            if((count++) < printFirst) console.log(w + ":", rule.one, rule.func, rule.two);
        }
    }
}

// try adding 2^n + 0, and 2^n + 2^n (for all n between 0 and 44, the max)
// this turns on only 1 (or 2) bits on across the whole system, so find out what happens
// turns out the result breaks in a few very specific spots, which indicate 
// which part of the adding machine has instructions swapped
for(let a=0; a<=44; a++)
    for(let b=0; b<=1; b++) {
        wires = {};
        let arg1 = Math.pow(2,a);
        let arg2 = b === 0 ? 0 : arg1;
        let res = solve(arg1, arg2);
        if(isNaN(res)) { console.log('NaN means a bit of z was not set'); return; }
        if(arg1 + arg2 !== res) {
            console.log('failed on',arg1,'(2^' + a + ') + ' + arg2 + ' = ' + res);
        }
    } 

// take a look at the instructions that output certain bits that are wrong
// manually inspect which instructions look bad compared to "working" bits
// for example, 2^23 + 0 = 2^24, so something is fishy in the z23 and z24 area
printTrace('z23', 7);
console.log();
printTrace('z24', 7);

return;

// some more cases that can break even if the above cases work
for(let a=0; a<=44; a++)
    for(let b=0; b<=43; b++) {
        wires = {};
        let arg1 = Math.pow(2,a) + Math.pow(2,b);
        let arg2 = Math.pow(2,b);
        let res = solve(arg1, arg2);
        if(isNaN(res)) { console.log('NaN means a bit of z was not set'); return; }
        if(arg1 + arg2 !== res) {
            console.log('failed on',a,b,arg1,' + ' + arg2 + ' = ' + res);
        }
    }