let input = require('fs').readFileSync('./input/day10.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(d => d.split('').map(n => n === '.' ? -1 : +n));

function gridAt(r,c) {
    return (input[r]??[])[c]??-1;
}

function search(r,c,value,str,mapP1,mapP2) {
    if(gridAt(r,c) !== value) return;
    if(value === 9) {
        mapP1[[r,c]] = true;        
        mapP2[str] = true;
        return;
    }
    search(r+1,c,value+1,str+`${r+1},${c}`,mapP1,mapP2);
    search(r-1,c,value+1,str+`${r-1},${c}`,mapP1,mapP2);
    search(r,c+1,value+1,str+`${r},${c+1}`,mapP1,mapP2);
    search(r,c-1,value+1,str+`${r},${c-1}`,mapP1,mapP2);
}

function getScore(r,c) {
    let mapP1 = {}, mapP2 = {};
    search(r,c,0,`${r},${c}`,mapP1,mapP2);
    return [Object.keys(mapP1).length, Object.keys(mapP2).length];
}

let counts = [];
for(let r=0; r<input.length; r++)
    for(let c=0; c<input[0].length; c++)
        counts.push(getScore(r,c));

console.log('part 1:',counts.reduce((a,b) => a + b[0], 0));
console.log('part 2:',counts.reduce((a,b) => a + b[1], 0));