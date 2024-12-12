let input = require('fs').readFileSync('./input/day12.txt', 'utf8').replaceAll('\r','')
    .split('\n'); 

function gridAt(r,c) {
    return (input[r]??[])[c]??'.';
}

function getHorizBorders(r,c,plant) {
    let borders = [];
    if(gridAt(r-1,c) !== plant) borders.push([r,c,'u']);
    if(gridAt(r+1,c) !== plant) borders.push([r+1,c,'d']);
    return borders;
}

function getVertBorders(r,c,plant) {
    let borders = [];
    if(gridAt(r,c-1) !== plant) borders.push([r,c,'l']);
    if(gridAt(r,c+1) !== plant) borders.push([r,c+1,'r']);
    return borders;
}

function computeNumSides(region) {
    let hor = region.horizBorders, ver = region.vertBorders;
    // sort horizontal by row first, then col (vert opposite), so we can detect straight lines
    hor.sort((a,b) => a[0]-b[0] || a[1]-b[1]);
    ver.sort((a,b) => a[1]-b[1] || a[0]-b[0]);

    let num = 0;
    // for both horiz and vert: count a wall as consecutive unbroken lines on the same row/col
    // if we go to a new row/col, or there's a gap of more than 1 on same row/col, or
    // the wall has a different in-out facing, increase the number of sides
    for(let i=1; i<hor.length; i++) {
        if(hor[i][0] !== hor[i-1][0] || hor[i][1] - hor[i-1][1] > 1 || hor[i][2] !== hor[i-1][2])
            num++;
    }
    for(let i=1; i<ver.length; i++) {
        if(ver[i][1] !== ver[i-1][1] || ver[i][0] - ver[i-1][0] > 1 || ver[i][2] !== ver[i-1][2])
            num++;
    }
    return num + 2; // + 2 because our last wall on both horiz/vert do not get completed
}

let regions = [];
let dirs = [[0,1], [0,-1], [1,0], [-1,0]];

let used = {};
for(let r=0; r<input.length; r++) {
    for(let c=0; c<input[0].length; c++) {
        if([r,c] in used) continue;

        let reg = {plant: gridAt(r,c), area: 0, points: [], vertBorders: [], horizBorders: []};
        let queue = [[r,c]];
        // breadth-first search of a region
        // have to be careful that each square counts only once, hence the 'used' map
        while(queue.length > 0) {
            let square = queue.shift();
            if(square in used) continue;
            for(let dir of dirs) {
                let delta = [square[0] + dir[0], square[1] + dir[1]];
                if(gridAt(delta[0], delta[1]) === gridAt(square[0], square[1]))
                    queue.push(delta);
            }

            reg.area++;
            reg.vertBorders.push(...getVertBorders(square[0], square[1], reg.plant));
            reg.horizBorders.push(...getHorizBorders(square[0], square[1], reg.plant));
            reg.points.push(square);
            used[square] = true;
        }
        reg.perimeter = reg.vertBorders.length + reg.horizBorders.length;
        reg.numSides = computeNumSides(reg);
        regions.push(reg);
    }
}

console.log('part 1:', regions.reduce((a,b) => a + b.perimeter * b.area, 0));
console.log('part 2:', regions.reduce((a,b) => a + b.numSides * b.area, 0));