let input = require('fs').readFileSync('./input/day14.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(s => { let [a,b,c,d] = ints(s); return {"p": [b,a], "v": [d,c]}; })

let dims = [103, 101]; 

function ints(s) {
    return [...s.matchAll(/-?\d+/g)].map(x => +(x[0]));
}

function simulate(numSec) {
    for(let robot of input) {
        robot.final = robot.p.map((p,i) => (p + robot.v[i] * numSec) % dims[i]);
        while(robot.final[0] < 0) robot.final[0] += dims[0];  
        while(robot.final[1] < 0) robot.final[1] += dims[1];
        robot.final = robot.final.map(d => Math.abs(d)); // handles -0 errors
    }
}

function getGrid() {
    let m = {};
    for(let robot of input)
        m[robot.final] = (m[robot.final] ?? 0) + 1;

    let sarr = [];
    for(let r=0; r<dims[0]; r++) {
        let s = "";
        for(let c=0; c<dims[1]; c++) 
            s += m[[r,c]] ? '1' : '.';
        sarr.push(s);
    }
    return sarr;
}

function getSafety() {
    let quads = { "0,0": [], "1,0": [], "0,1": [], "1,1": [] };
    let dimHalf = dims.map(d => Math.floor(d/2));
    let inQuads = input.filter(d => d.final[0] !== dimHalf[0] && d.final[1] !== dimHalf[1]);
    for(let robot of inQuads) {
        quads[[robot.final[0] < dimHalf[0] ? 0 : 1, robot.final[1] < dimHalf[1] ? 0 : 1]].push(robot);
    }
    return Object.values(quads).reduce((a,b) => a * b.length, 1);
}

simulate(100);
console.log('part 1:',getSafety());

function drawIfTree(sec) {
    simulate(sec);
    let grid = getGrid();

    // try to find any grid that has a bunch of robots in a row, maybe that's the grid we're looking for
    // it works but I tried many other ways to detect "Christmas tree-ness" that were deleted because they didn't work
    // other approaches that work: determine the periodicity of the graph, find one frame that "looks odd" and only look at multiples of that
    // or do statistical analysis on how spread out the points are and look at cases where stuff is more clustered than normal
    // this would assume the tree is drawn densely (and not sparsely) so no guarantee it would work, but it does for this problem
    // also, use part 1 to measure the safety of each frame, the one with the tree is the lowest by far (see code at bottom of file)
    // this part 1 apporoach is what I should have used at the start
    let counts = [];
    for(let i=0; i<grid.length; i++) counts.push((grid[i].match(/1111111111111111/g) || []).length);
    if(counts.filter(d => d > 0).length === 0) return;

    console.log(sec,'\n');
    console.log(grid.join('\n'));
}

function lookForTree() {
    // can adjust this bounds array to search subset of space
    // after trial and error, this was the range where my tree was
    let bounds = [6000, 8000];
    for(let i=bounds[0]; i<bounds[1]; i++) {
        drawIfTree(i);
    }
}

console.log('part 2: searching for Christmas tree...');
lookForTree();

// the below method also finds the correct frame just by sorting by smallest safety measure
let safeties = [];
for(let i=0; i<dims[0] * dims[1]; i++) {
    simulate(i);
    safeties.push([getSafety(), i]);
}
safeties.sort((a,b) => a[0] - b[0]);

console.log('lowest safeties are');
for(let i=0; i<5; i++) console.log(safeties[i]);