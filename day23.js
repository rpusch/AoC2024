let input = require('fs').readFileSync('./input/day23.txt', 'utf8').replaceAll('\r','')
    .split('\n').map(d => d.split('-'));

let map = {};
for(let [a,b] of input) {
    if(!(a in map)) map[a] = {};
    map[a][b] = 1;
    if(!(b in map)) map[b] = {};
    map[b][a] = 1;
} 

let cliquesWithT = new Set();
let cliques = new Set();
for(let key in map) {
    let conns = Object.keys(map[key]);
    // check all pairs of connections to map[key], see if they are connected to each other
    for(let i=0; i<conns.length; i++)
        for(let j=i+1; j<conns.length; j++)
            if(conns[j] in map[conns[i]]) {
                let arr = [key, conns[i], conns[j]]
                arr.sort();
                if(arr.filter(d => d[0] === 't').length > 0)
                    cliquesWithT.add(arr.toString());
                cliques.add(arr.toString());
            }
}

console.log('part 1:', cliquesWithT.size);

// keep expanding our known set of all 3-cliques with one connection at a time
// if nothing new gets added during a pass, drop it. Last clique remaining is longest
while(true) {
    let newCliques = new Set();
    for(let clique of cliques) {
        let arr = clique.split(',');
        let toAdd = [];
        // we only have to check arr[0] for candidate connections (any candidate must be in this list)
        for(let conn of Object.keys(map[arr[0]])) {
            // check to see if conn is connected to all other computers in this clique
            let result = true;
            for(let j=1; j<arr.length && result; j++) {
                if(!(conn in map[arr[j]]))
                    result = false;
            }
            // we can only add one at a time, no guarantee two additions would connect to each other
            if(result) {
                toAdd.push(conn);
                break;
            }
        }
        if(toAdd.length > 0) {
            arr.push(...toAdd);
            arr.sort();
            newCliques.add(arr.toString());
        }
    }
    if(newCliques.size === 0) break; // we added nothing this pass, we must be at the largest clique
    cliques = newCliques;
}

console.log('part 2:', [...cliques][0]);