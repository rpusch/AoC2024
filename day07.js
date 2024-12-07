let input = require('fs').readFileSync('./input/day07.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(d => { 
        let s = d.split(': '); 
        return { answer: +s[0], operands: s[1].split(' ').map(Number)}; 
    });

function add(a,b) { return a+b; }
function mul(a,b) { return a*b; }
function concat(a,b) { let p = 10; while(p <= b) p *= 10; return a*p + b; }
let funcs = [add, mul, concat];

function runTests(bitCount) {
    let total = 0;
    for(let job of input) {
        for(let i=0; i<Math.pow(bitCount, job.operands.length-1); i++) {
            let runningTotal = job.operands[0];
            let funcValue = i;
            for(let j=1; j<job.operands.length; j++) {
                let func = funcs[funcValue % bitCount];
                runningTotal = func(runningTotal, job.operands[j]);
                if(runningTotal > job.answer) break;
                funcValue = Math.floor(funcValue / bitCount);
            }
            if(runningTotal === job.answer) { 
                total += job.answer;
                break;
            }
        }
    }
    return total;
}

console.log('part 1:', runTests(2));
console.log('part 2:', runTests(3));