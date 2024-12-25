let input = require('fs').readFileSync('./input/day25.txt', 'utf8').replaceAll('\r','')
    .split('\n\n').map(d => d.split('\n'));

let locks = [], keys = [];

for(let device of input) {
    let arr = [...device[0].matchAll(/#/g)].length === device[0].length ? locks : keys;
    let marks = [];
    for(let c=0; c<device[0].length; c++) {
        marks.push(0);
        for(let r=0; r<device.length; r++)
            if(device[r][c] === '#') marks[c]++;
    }
    arr.push(marks);
}

let count = 0;
for(let lock of locks) {
    for(let key of keys) {
        let arr = lock.map((d,i) => d + key[i]);
        if(arr.filter(d => d > input[0].length).length === 0) count++;
    }
}

console.log('part 1:', count);