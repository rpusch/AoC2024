let input = require('fs').readFileSync('./input/day08.txt', 'utf8').replaceAll('\r','')
    .split('\n');

function inBounds(rc) {
    return rc[0] >= 0 && rc[1] >=0 && rc[0] < input.length && rc[1] < input[0].length;
}
function addVec(a,b) { return [a[0]+b[0], a[1]+b[1]]; }
function subVec(a,b) { return [a[0]-b[0], a[1]-b[1]]; }
function mulVec(a,num) { return [a[0]*num, a[1]*num]; }

let nodes = {}, antinodes = {};
for(let r=0; r<input.length; r++)
    for(let c=0; c<input[0].length; c++) {
        if(input[r][c] !== '.') {
            if(nodes.hasOwnProperty(input[r][c])) nodes[input[r][c]].push([r,c])
            else nodes[input[r][c]] = [[r,c]];
        }
    }

for(let freqs of Object.values(nodes)) {
    for(let i=0; i<freqs.length; i++) {
        for(let j=i+1; j<freqs.length; j++) {
            let delta = subVec(freqs[j], freqs[i]);
            let anti = addVec(freqs[j], delta);
            if(inBounds(anti)) antinodes[anti] = true;
            anti = subVec(freqs[i], delta);
            if(inBounds(anti)) antinodes[anti] = true;
        }
    }
}

console.log('part 1:', Object.keys(antinodes).length);

for(let freqs of Object.values(nodes)) {
    for(let i=0; i<freqs.length; i++) {
        for(let j=i+1; j<freqs.length; j++) {
            let delta = subVec(freqs[j], freqs[i]);
            let anti, dist = 0;
            do {
                anti = addVec(freqs[j], mulVec(delta, dist));
                if(inBounds(anti)) antinodes[anti] = true;
                dist++;
            } while(inBounds(anti));

            dist = 0;
            do {
                anti = subVec(freqs[i], mulVec(delta, dist));
                if(inBounds(anti)) antinodes[anti] = true;
                dist++;
            } while(inBounds(anti));
        }
    }
}

console.log('part 2:', Object.keys(antinodes).length);