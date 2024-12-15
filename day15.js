let input = require('fs').readFileSync('./input/day15.txt', 'utf8').replaceAll('\r','')
    .split('\n\n'); 

let grid = input[0].split('\n').map(d => d.split(''));
let grid2 = input[0].replaceAll('#','##').replaceAll('O','[]').replaceAll('.','..').replaceAll('@','@.')
    .split('\n').map(d => d.split(''));
let moves = input[1].replaceAll('\n','');

// helper functions
function add(a,b) { return [a[0] + b[0], a[1] + b[1]]; }
function mult(a,num) { return [a[0] * num, a[1] * num]; }
function gridAt(vec,grid) { return grid[vec[0]][vec[1]]; }
function setGridAt(vec,symbol,grid) { grid[vec[0]][vec[1]] = symbol; }
function print(grid) {
    for(let line of grid)
        console.log(line.join(''));
}
function getSum(grid) {
    let sum = 0;
    for(let r=0; r<grid.length; r++)
        for(let c=0; c<grid[0].length; c++)
            if(grid[r][c] === 'O' || grid[r][c] === '[') sum += 100 * r + c;
    return sum;
}
function getGuard(grid) {
    for(let r=0; r<grid.length; r++)
        for(let c=0; c<grid[0].length; c++)
            if(grid[r][c] === '@') return [r,c];
}

let dirs = {'<': [0, -1], '^': [-1, 0], '>': [0, 1], 'v': [1, 0] };

// part 1
let guard = getGuard(grid);
for (let move of moves) {
    let newg = guard;
    let count = 0;
    while (true) {
        newg = add(newg, dirs[move]);
        if(gridAt(newg, grid) === '.' || gridAt(newg, grid) === '#') break;
        count++;
    }

    if(gridAt(newg,grid) !== '#') {
        setGridAt(guard, '.', grid);
        setGridAt(add(guard, dirs[move]), '@', grid);
        if(count > 0)
            setGridAt(add(guard, mult(dirs[move], count+1)), 'O', grid);
        guard = add(guard, dirs[move]);
    }
}
console.log('part 1:', getSum(grid));

// part 2
guard = getGuard(grid2);
for(let move of moves) {
    let newg = add(guard, dirs[move]);
    let queue = [], index = 0;
    if(gridAt(newg, grid2) === '#') continue;
    if(gridAt(newg, grid2) === '[' || gridAt(newg, grid2) === ']') {
        if(gridAt(newg, grid2) === ']') newg = add(newg, [0,-1]);
        queue.push(newg);
    }

    // queue contains all the left sides of boxes '[' that need to be checked if they can be moved
    // as they keep cascading into more boxes, keep adding the left sides of those new boxes to the queue
    // if we ever hit a wall on any check, the whole loop fails and nothing moves
    let noWall = true;
    while(index < queue.length && noWall) {
        let item = queue[index], delta = add(item, dirs[move]);
        let toCheck = [];
        if(move === '<') toCheck.push(delta);
        else if(move === '>') toCheck.push(add(delta, dirs[move]));
        else {
            // we have to check two spots above or below the box
            // queue always containing position of '[' means ']' is one to the right
            toCheck.push(delta);
            toCheck.push(add(delta, [0,1]));
        }
        for(let check of toCheck) { 
            if(gridAt(check, grid2) === '#') noWall = false;
            else if(gridAt(check, grid2) === '[' || gridAt(check, grid2) === ']') {
                if(gridAt(check, grid2) === ']') check[1]--; // always take the left bracket '['
                queue.push(check);
            }
        }
        index++;
    }
    // if we completed the loop with no wall, then everything in the queue can now move
    // must be done in reverse order to not overwrite things
    if(noWall) {
        for(let i=queue.length-1; i>=0; i--) {
            let delta = add(queue[i], dirs[move]);
            setGridAt(queue[i], '.', grid2);
            setGridAt(add(queue[i], [0,1]), '.', grid2);
            setGridAt(delta, '[', grid2);
            setGridAt(add(delta, [0,1]), ']', grid2);            
        }
        // finally, move the guard too
        setGridAt(guard, '.', grid2);
        setGridAt(add(guard, dirs[move]), '@', grid2);
        guard = add(guard, dirs[move]);
    }
}

console.log('part 2:', getSum(grid2));