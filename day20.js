let input = require('fs').readFileSync('./input/day20.txt', 'utf8').replaceAll('\r','')
    .split('\n');

let start;
for(let r=0; r<input.length; r++)
    for(let c=0; c<input[0].length; c++)
        if(input[r][c] === 'S') start = [r,c];

let dirs = [[0,1], [1,0], [0,-1], [-1,0]];
function add(a,b) { return [a[0] + b[0], a[1] + b[1]]; }
function gridAt(vec) { return (input[vec[0]]??[])[vec[1]]??'#'; }

let path = []; // will be [r,c] pairs in order from S to E along the only valid path
let map = {}; // inverse map of path: index with [r,c], get the path index

// BFS to find the path, but with only one valid path there are many ways to do it
let queue = [start];
let seen = {};
while(queue.length > 0) {
    let cell = queue.shift();
    seen[cell] = true;
    map[cell] = path.length;
    path.push(cell);
    if(gridAt(cell) === 'E') break;

    for(let dir of dirs) {
        let delta = add(cell,dir);
        if(!(delta in seen) && gridAt(delta) !== '#')
            queue.push(delta);
    }
}

// look at all cells within manhattan range "spread" of each cell on the path
// if any of them are any faster than walking there along the path, add it
// this is more general than the way below but a bit slower due to dictionary lookup/assignment
function getCheats(path, spread) {
    let cheats = {};
    for(let cell of path) {
        for(let r=-spread; r<=spread; r++) {
            for(let c=-spread+Math.abs(r); c<=spread-Math.abs(r); c++) {
                let delta = add(cell, [r,c]);
                if(gridAt(delta) !== '#' && map[delta] > map[cell] + Math.abs(r) + Math.abs(c)) {
                    let dist = map[delta] - (map[cell] + Math.abs(r) + Math.abs(c));
                    if(!cheats[dist]) cheats[dist] = [];
                    cheats[dist].push([...cell, ...delta]);
                }
            }
        }
    }
    return cheats;
}

let picoMin = 100;
let cheats = getCheats(path, 2);
console.log('part 1:', Object.keys(cheats).filter(d => d >= picoMin)
    .reduce((a,b) => a + cheats[b].length, 0))

cheats = getCheats(path, 20);
console.log('part 2:', Object.keys(cheats).filter(d => d >= picoMin)
    .reduce((a,b) => a + cheats[b].length, 0))

// alternate way: look at all cells that are "picoMin" away on the path (index i+picoMin to end of array)
// if any of them have manhattan distance less than spread, add it
// this is about 3x as fast as the above solution (despite worse big-O, this uses array lookup)
// function getCheats(path, picoMin, spread) {
//     let cheats = {};
//     for(let i=0; i<path.length; i++) {
//         let a = path[i];
//         for(let j=i+picoMin; j<path.length; j++) {
//             let b = path[j];
//             let md = Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
//             if(md <= spread) {
//                 if(!cheats[j-i-md]) cheats[j-i-md] = [];
//                 cheats[j-i-md].push([...a, ...b]);
//             }
//         }
//     }
//     return cheats;
// }