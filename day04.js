let input = require('fs').readFileSync('./input/day04.txt', 'utf8').replaceAll('\r','')
    .split('\n');

function gridAt(c,r) {
    return (input[c]??[])[r]??'.';
}

function isStringXmas(c, r, dirC, dirR) {
    let s = gridAt(c, r);
    for(let i=1; i<=3; i++)
        s += gridAt(c + dirC*i, r + dirR*i);
    return s === "XMAS" ? 1 : 0;
}

function areDiagonalsMas(c, r) {
    let one = gridAt(c-1, r-1) + gridAt(c, r) + gridAt(c+1, r+1);
    let two = gridAt(c-1, r+1) + gridAt(c, r) + gridAt(c+1, r-1);
    return (one === "MAS" || one === "SAM") && (two === "MAS" || two === "SAM") ? 1 : 0;
}

let count1 = 0, count2 = 0;
for(let c=0; c<input.length; c++) {
    for(let r=0; r<input[0].length; r++) {
        for(let dirC=-1; dirC<=1; dirC++) {
            for(let dirR=-1; dirR<=1; dirR++) {        
                count1 += isStringXmas(c, r, dirC, dirR);
            }
        }
        count2 += areDiagonalsMas(c, r);
    }
}
console.log('part 1', count1);
console.log('part 2', count2);