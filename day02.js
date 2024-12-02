let input = require('fs').readFileSync('./input/day02.txt', 'utf8').replaceAll('\r','')
    .split('\n')
    .map(d => d.split(' ').map(Number));

function testSafety(line) {
    let diff = [];
    for(let i=1; i<line.length; i++)
        diff.push(line[i]-line[i-1]);

    diff = diff.filter(d => Math.abs(d) >= 1 && Math.abs(d) <= 3 && 
        Math.sign(d) === Math.sign(diff[0]));

    return (diff.length + 1 === line.length) ? 1 : 0;
}

let count = 0;
for(let line of input)
    count += testSafety(line);

console.log('part 1:',count);

count = 0;
for(let line of input) {
    let result = 0;
    for(let i=-1; i<line.length && !result; i++) {
        result = testSafety(line.filter((_,index) => i !== index));
        count += result;
    }
}
console.log('part 2:',count);
