let input = require('fs').readFileSync('./input/day11.txt', 'utf8').replaceAll('\r','')
    .split(' ').map(Number);

let stones = {};
input.forEach(d => { add(stones, d, 1); });

function add(map, key, val) { map[key] = (map[key] ?? 0) + val; }

function run(numLoops) {
    let old = stones;
    for(let loop=0; loop<numLoops; loop++) {
        let updated = {};
        for(let stone of Object.keys(old)) {
            if(+stone === 0) add(updated, 1, old[stone]); 
            else if(stone.length % 2 === 0) {
                add(updated, +stone.substring(0, stone.length/2), old[stone]);
                add(updated, +stone.substring(stone.length/2), old[stone]);
            }
            else add(updated, (+stone)*2024, old[stone]);
        }
        old = updated;
    }
    return Object.values(old).reduce((a,b) => a+b);
}

console.log('part 1',run(25));
console.log('part 2',run(75));