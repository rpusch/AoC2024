let input = require('fs').readFileSync('./input/day01.txt', 'utf8').replaceAll('\r','')
    .split('\n');

let left = [], right = [];
input.forEach(d => {
    let s = d.split('   ');
    left.push(+s[0]);
    right.push(+s[1]);
});

left.sort();
right.sort();

let sum = 0;
for(let i=0; i<left.length; i++) {
    sum += Math.abs(left[i]-right[i]);
}

console.log('part 1:',sum);

sum = 0;
for(let i=0; i<left.length; i++) {
    let matches = right.filter(d => d === left[i]);
    sum += left[i] * matches.length;
}

console.log('part 2:',sum);