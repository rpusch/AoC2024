let input = require('fs').readFileSync('./input/day05.txt', 'utf8').replaceAll('\r','')
    .split('\n\n');

function ints(s) {
    return [...s.matchAll(/\d+/g)].map(x => +(x[0]));
}

let rules = input[0].split('\n').map(d => ints(d));
let jobs = input[1].split('\n').map(d => ints(d));

let prereqs = {};

for(let rule of rules) {
    if(prereqs.hasOwnProperty(rule[1])) prereqs[rule[1]].add(rule[0]);
    else prereqs[rule[1]] = new Set([rule[0]]);
}

let successes = [], failures = [];
for(let job of jobs) {
    let failed = false;
    let i=0;
    while(i < job.length) {
        let inter = prereqs[job[i]]?.intersection(new Set(job.slice(i+1, job[i].length)));
        if(inter?.size > 0) {
            failed = true;
            let wrongIndex = job.findIndex(d => d === inter.values().next().value);
            [job[i], job[wrongIndex]] = [job[wrongIndex], job[i]];
        }
        else i++;
    }
    if(!failed) successes.push(job);
    else failures.push(job);
}

console.log('part 1:',successes.reduce((a,b) => a + b[Math.floor(b.length/2)], 0));
console.log('part 2:',failures.reduce((a,b) => a + b[Math.floor(b.length/2)], 0));
