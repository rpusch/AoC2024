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
let result;
for(let line of input) {
    for(let i=-1; i<line.length; i++) {
        if(i < 0) result = testSafety(line);
        else result = testSafety(line.toSpliced(i, 1));
        count += result;
        if(result > 0) break;
    }
}
console.log('part 2:',count);
