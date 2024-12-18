let input = require('fs').readFileSync('./input/day18.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(d => d.split(',').map(Number));

let dim = 71;
let map = {};
for(let i=0; i<1024; i++)
    map[input[i]] = true;

// basic BFS, first time we find the bottom-right is guaranteed to be fewest number of steps
function getNumSteps() {
    let queue = [[0, 0, 0]]
    let seen = {};
    while(queue.length > 0) {
        let [r, c, steps] = queue.shift();
        if(r === dim-1 && c === dim-1)
            return steps;
        if([r,c] in seen) continue;
        seen[[r,c]] = true;
        for(let delta of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
            if(r < 0 || c < 0 || r >= dim || c >= dim) continue;
            if(delta in seen || delta in map) continue;
            queue.push([...delta, steps + 1]);
        }
    }
    return -1;
}

console.log('part 1:', getNumSteps());

// just work from the back of the list, deleting barriers until a solution can be found
// this works fine for this input (lots of very quickly failing walks)
// best solution for the general case is just to do a binary search
input.forEach(d => map[d] = true);
for(let i=input.length-1; i>=1025; i--) {
    delete map[input[i]];
    let steps = getNumSteps();
    if(steps > 0) {
        console.log('part 2:', input[i].join(','));
        break;
    }
}