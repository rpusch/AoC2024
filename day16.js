let input = require('fs').readFileSync('./input/day16.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(d => d.split(''));
 
function add(a,b) { return [a[0] + b[0], a[1] + b[1]]; }
function gridAt(vec) { return input[vec[0]][vec[1]]; }
function setGridAt(vec,symbol) { input[vec[0]][vec[1]] = symbol; }
function print() {
    for(let line of input)
        console.log(line.join(''));
}
function printOptimal(opt) {
    for(let r=0; r<input.length; r++) {
        let s = "";
        for(let c=0; c<input[0].length; c++)
            s += opt.includes([r,c].toString()) ? 'O' : input[r][c];
        console.log(s);
    }        
}

let dirs = [[0,1], [1,0], [0,-1], [-1,0]];

let start, end, dir = 0;
for(let r=0; r<input.length; r++)
    for(let c=0; c<input[0].length; c++) {
        if(input[r][c] === 'S') start = [r,c]; 
        if(input[r][c] === 'E') end = [r,c];
    }

// this BFS algorithm does not work in the general case (for arbitrary turning cost)
// coding dijkstra was the correct play
function solve(start, dir) {
    let queue = [[start,dir,0]];
    let bests = {};
    while(queue.length > 0) {
        let [pos,dir,score] = queue.shift();
        if(gridAt(pos) === '#') continue;
        if(!(pos in bests) || bests[pos] > score) bests[pos] = score;
        else continue;
        queue.push([add(pos, dirs[dir]), dir, score + 1]);
        queue.push([add(pos, dirs[(dir+1)%4]), (dir+1)%4, score + 1001]);
        queue.push([add(pos, dirs[(dir+3)%4]), (dir+3)%4, score + 1001]);        
    }
    return bests;
}

let bestsForward = solve(start, 0);
let bestsBackward = solve(end, 0);
let bestLength = bestsForward[end];
console.log('part 1:', bestLength);

// this "match S to E and E to S lengths" would work in general case if dijkstra was coded
// I wouldn't have to do this wacky corner business below (which also won't work for general input)
let corners = Object.keys(bestsForward).filter(d => bestsForward[d] + bestsBackward[d] === bestLength);
corners.push(start.toString());

// mark every cell along the path between every pair of corners (as long as it doesn't go through a wall)
// this worked for my input but this will not work for every case, don't copy this idea
let optimals = {};
for(let i=0; i<corners.length; i++) {
    let a = corners[i].split(',').map(Number);
    for(let j=i+1; j<corners.length; j++) {
        let b = corners[j].split(',').map(Number);
        if(a[0] !== b[0] && a[1] !== b[1]) continue;
        let possible = [];
        if(a[0] === b[0]) {
            for(let k=Math.min(a[1],b[1]); k<=Math.max(a[1], b[1]); k++) {
                possible.push([a[0], k]);
            }
        }
        else {
            for(let k=Math.min(a[0],b[0]); k<=Math.max(a[0], b[0]); k++) {
                possible.push([k, a[1]]);
            }
        }
        if(possible.filter(d => gridAt(d) === '#').length === 0)
            possible.forEach(p => optimals[p] = true);
    }
}
optimals = Object.keys(optimals);
// printOptimal(optimals);
console.log('part 2:', optimals.length);