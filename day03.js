let input = require('fs').readFileSync('./input/day03.txt', 'utf8').replaceAll('\r','')
    .split('\n');

function ints(s) {
    return [...s.matchAll(/\d+/g)].map(x => +(x[0]));
}

//let re = /mul\(\d{1,3},\d{1,3}\)/g
let re2 = /(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g

let included = 0;
let excluded = 0;
let on = true;

for(let line of input) {
    let matches = [...line.matchAll(re2)].map(d => d[0]);
    matches.forEach(d => {
        if(d.startsWith('don')) on = false;
        else if(d.startsWith('do')) on = true;
        else {
            let [a,b] = ints(d);
            if(on) included += a * b;
            else excluded += a * b;
        }
    })
}
console.log('part 1:',included + excluded);
console.log('part 2:',included);
