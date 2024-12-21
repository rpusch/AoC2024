let input = require('fs').readFileSync('./input/day21.txt', 'utf8').replaceAll('\r','')
    .split('\n');

let numRow = { 7: 0, 8: 0, 9: 0, 4: 1, 5: 1, 6: 1, 1: 2, 2: 2, 3: 2, 0: 3, 'A': 3 };
let numCol = { 7: 0, 8: 1, 9: 2, 4: 0, 5: 1, 6: 2, 1: 0, 2: 1, 3: 2, 0: 1, 'A': 2 };
let arrowRow = { '^': 0, 'A': 0, '<': 1, 'v': 1, '>': 1};
let arrowCol = { '^': 1, 'A': 2, '<': 0, 'v': 1, '>': 2};
let arrowMap = { "0,1": '^', "0,2": 'A', '1,0': '<', '1,1': 'v', '1,2': '>' };

// all the ways to get from the "prev" key to the "curr" key on the numpad
// it discounts zigzags (like 7 to 6: >v>) because we know these will never be optimal paths
// either do all horizontal then all vertical (or vice versa), taking care to avoid the dead zone
// this is basically a "hardcoded" search tailored to the very constrained grid
function getAllNumPaths(prev, curr) {
    let [prevR, prevC] = [numRow[prev], numCol[prev]];
    let [currR, currC] = [numRow[curr], numCol[curr]];
    let paths = [];
    let h = new Array(Math.abs(currC-prevC)).fill(currC - prevC > 0 ? '>' : '<');
    let v = new Array(Math.abs(currR-prevR)).fill(currR - prevR > 0 ? 'v' : '^');
    if(prevC === 0 && currR === 3) // dead zone dodging
        paths.push([...h, ...v, 'A']);
    else if(prevR === 3 && currC === 0) // more dead zone dodging
        paths.push([...v, ...h, 'A']);
    else {
        // if here, no path goes through the dead zone, so take both [v,h] and [h,v] paths
        paths.push([...v, ...h, 'A']);
        if(h.length > 0 && v.length > 0)
            paths.push([...h, ...v, 'A']);
    }
    return paths.map(d => d.join(''));
}

// all the ways to get from the "prev" key to the "curr" key on the arrow pad
// same as the above function (discounts zigzags, dead zones), just uses the arrow layout
function getAllArrowPaths(prev, curr) {
    let [prevR, prevC] = [arrowRow[prev], arrowCol[prev]];
    let [currR, currC] = [arrowRow[curr], arrowCol[curr]];
    let paths = [];
    let h = new Array(Math.abs(currC-prevC)).fill(currC - prevC > 0 ? '>' : '<');
    let v = new Array(Math.abs(currR-prevR)).fill(currR - prevR > 0 ? 'v' : '^');
    if(prevC === 0)
        paths.push([...h, ...v, 'A']);
    else if(prevR === 0 && currC === 0)
        paths.push([...v, ...h, 'A']);
    else {
        paths.push([...v, ...h, 'A']);
        if(h.length > 0 && v.length > 0)
            paths.push([...h, ...v, 'A']);
    }
    return paths.map(d => d.join(''));
}

// we need to memoize the best string length at each possible depth
let memos = new Array(26);
for(let i=0; i<memos.length; i++) memos[i] = {};

// given a path on the numpad (eg, "029A"), and how many future robots will be involved,
// what's the fewest moves we can do this in?
// this is the parent recursive function since the numpad operates a little differently
// I'm sure this can be combined with solveArrowNumerical to have less code, but no big deal
function solveNumpadNumerical(seq, depth) {
    let topSum = 0;
    for(let i=0; i<seq.length; i++) {
        let paths = getAllNumPaths(i-1 < 0 ? 'A' : seq[i-1], seq[i]);
        let sols = [];
        for(let p of paths)
            sols.push(solveArrowNumerical(p, depth));
        sols.sort((a,b) => a - b);
        topSum += sols[0];
    }
    return topSum;
}

// given a path (eg, "v<<A") on the arrow keys, and a depth of the current robot, 
// what's the fewest number of moves we can do this in?
// recursively ask each new depth for the best path between each key in the path, then sum up the best results
// we must memoize each depth separately
function solveArrowNumerical(seq, depth) {
    if(depth === 0) return seq.length;
    if(seq in memos[depth]) return memos[depth][seq];

    let topSum = 0;
    for(let i=0; i<seq.length; i++) {
        // look at each pair of keys (each sequence starts with the robot's hand on A)
        let paths = getAllArrowPaths(i-1 < 0 ? 'A' : seq[i-1], seq[i]);
        let sols = [];
        for(let p of paths) {
            sols.push(solveArrowNumerical(p, depth-1));
        }
        sols.sort((a,b) => a - b);
        topSum += sols[0];
    }
    memos[depth][seq] = topSum;
    return topSum;
}

let sum = 0;
for(let seq of input) {
    let s = solveNumpadNumerical(seq, 2);
    sum += s * Number(seq.substring(0, 3));
}
console.log('part 1:', sum);
sum = 0;
for(let seq of input) {
    let s = solveNumpadNumerical(seq, 25);
    sum += s * Number(seq.substring(0, 3));
}
console.log('part 2:', sum);


// ////////////////////////////////////////////
// everything below here is old solutions to part 1 that didn't scale for part 2
// kept for posterity
return;

let memosString = new Array(26);
for(let i=0; i<memosString.length; i++) memosString[i] = {};

// these are the same as the solve functions above, just memoized on the string itself rather than a number
// these functions can generate an actual string of min length (useful for debugging small cases)
// for part 2, the strings have length that exceed RAM on your computer so no longer feasible
function solveNumpadString(seq, depth) {
    let topSol = "";
    for(let i=0; i<seq.length; i++) {
        let paths = getAllNumPaths(i-1 < 0 ? 'A' : seq[i-1], seq[i]);
        let sols = [];
        for(let p of paths)
            sols.push(solveArrowString(p, depth-1));
        sols.sort((a,b) => a.length - b.length);
        topSol += sols[0];
    }
    return topSol;
}

function solveArrowString(seq, depth) {
    if(depth === 0) return seq;
    if(seq in memosString[depth]) return memosString[depth][seq];
    
    let topSol = "";
    for(let i=0; i<seq.length; i++) {
        let a = [i-1 < 0 ? 'A' : seq[i-1], seq[i]];
        let paths = getAllArrowPaths(...a);
        let sols = [];
        for(let p of paths) {
            sols.push(solveArrowString(p, depth-1));
        }
        sols.sort((a,b) => a.length - b.length);
        topSol += sols[0];
    }
    memosString[depth][seq] = topSol;
    return topSol;
}

sum = 0;
for(let seq of input) {
    let s = solveNumpadString(seq, 3);
    console.log(seq + ":", s);
    sum += s.length * Number(seq.substring(0,3));
}
console.log(sum);

// this was a function that works in reverse (given a path on arrow keys, what keys were pressed?)
// useful for debugging the examples to find out why some moves were worse than others
function collapseArrows(seq) {
    let pos = [0,2];
    let s = "";
    for(let ch of seq) {
        if(ch === '<') pos[1]--;
        if(ch === '>') pos[1]++;
        if(ch === '^') pos[0]--;
        if(ch === 'v') pos[0]++;
        if(ch === 'A') {
            s += arrowMap[pos.toString()];
        }
    }
    return s;
} 