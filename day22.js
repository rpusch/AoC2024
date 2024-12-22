let input = require('fs').readFileSync('./input/day22.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(Number);

function getNext(num) {
    num = Number(BigInt(num * 64) ^ BigInt(num)) % 16777216;
    num = Number(BigInt(Math.floor(num / 32)) ^ BigInt(num)) % 16777216;
    num = Number(BigInt(num * 2048) ^ BigInt(num)) % 16777216;
    return num;
}

// getting all 2000 numbers for all monkeys + setting up dicts takes about 5 seconds of runtime
let sum = 0;
let allDeltas = {};
for(let num of input) {
    let map = {};
    let next;
    // use a circular array to keep track of diff values to eliminate push/pop costs
    let diffs = new Array(4).fill(0);
    let diffsI = 0;
    for(let i=0; i<2000; i++) {
        next = getNext(num);
        diffs[diffsI] = next % 10 - num % 10;
        diffsI = (diffsI+1) % 4;
        if(i >= 3) {
            let str = "" + diffs[diffsI] + diffs[(diffsI+1)%4] + diffs[(diffsI+2)%4] + diffs[(diffsI+3)%4];
            if(!(str in map)) map[str] = next % 10;
        }
        num = next;
    }
    // use our temporary map to put this monkey's deltas in the big map
    for(let key in map) {
        if(!(key in allDeltas)) allDeltas[key] = [];
        allDeltas[key].push(map[key]);
    }
    sum += num;
}
console.log('part 1:', sum);

// even though it's a brute force search through all ~40,000 deltas, it runs more or less instantly
// most arrays for a given delta only have around 100 elements in them
let bestScore = -1;
let bestStr = "";
for(let key in allDeltas) {
    let total = allDeltas[key].reduce((a,b) => a+b);
    if(total > bestScore) {
        bestScore = total;
        bestStr = key;
    }
}
console.log('part 2:', bestScore);