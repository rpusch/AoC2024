let input = require('fs').readFileSync('./input/day13.txt', 'utf8').replaceAll('\r','')
    .split('\n\n').map(s => { 
        let [a,b,c,d,e,f] = ints(s); return { "a": [a,b], "b": [c,d], "prize": [e,f]}; 
    }); 
 
function ints(s) {
    return [...s.matchAll(/\d+/g)].map(x => +(x[0]));
}

function solve() {
    let cost = 0;
    for(let play of input) {
        // do the algebra to get aCoeff * a = rhs (involving no division)
        let aCoeff = play.a[0] * play.b[1] - play.a[1] * play.b[0];
        let rhs = (play.prize[0] * play.b[1] - play.prize[1] * play.b[0]);
        if(rhs % aCoeff === 0) {
            let a = rhs / aCoeff;
            let b = (play.prize[0] - play.a[0] * a) / play.b[0];
            cost += a * 3 + b;
        }
    }
    return cost;
}

console.log('part 1:', solve());
input.forEach(d => {d.prize = d.prize.map(n => n + 10000000000000)});
console.log('part 2:', solve());