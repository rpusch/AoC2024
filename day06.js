let input = require('fs').readFileSync('./input/day06.txt', 'utf8').replaceAll('\r','') 
    .split('\n').map(d => d.split(''));

function outOfBounds(posR, posC) {
    return posR < 0 || posC < 0 || posR >= input.length || posC >= input[0].length;
}
function str(r,c) { return r + ',' + c; }

let dirs = [[-1,0], [0,1], [1,0], [0,-1]];

// returns the cells visited on success (an array of strings "r,c"), or empty array if there is a loop
function simulate(r, c) {
    let visited = {}; visited[str(r,c)] = [0];
    let dir = 0;
    while(true) {
        let nextR = r + dirs[dir][0], nextC = c + dirs[dir][1];
        if(outOfBounds(nextR, nextC)) break;
        while(input[nextR][nextC] === '#') {
            dir = (dir+1) % 4;
            nextR = r + dirs[dir][0];
            nextC = c + dirs[dir][1];
        }
        [r, c] = [nextR, nextC];
        if(visited[str(r,c)]) {
            if(visited[str(r,c)].includes(dir)) return [];
            else visited[str(r,c)].push(dir);
        }
        else
            visited[str(r,c)] = [dir];
    }
    return Object.keys(visited);
}

let guardR, guardC;
for(let r=0; r<input.length; r++)
    for(let c=0; c<input[0].length; c++)
        if(input[r][c] === '^') [guardR, guardC] = [r, c];

let originalPath = simulate(guardR, guardC);
console.log('part 1:', originalPath.length);

let loopCount = 0;
for(let [r,c] of originalPath.map(d => d.split(',').map(Number))) {
    if(r === guardR && c === guardC) continue;
    if(input[r][c] === '.') {
        input[r][c] = '#';
        if(simulate(guardR, guardC).length === 0)
            loopCount++;
        input[r][c] = '.';
    }
}
console.log('part 2:', loopCount);