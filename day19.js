let input = require('fs').readFileSync('./input/day19.txt', 'utf8').replaceAll('\r','')
    .split('\n\n'); 
 
let rules = input[0].split(', ');
let jobs = input[1].split('\n');
let memo = {}; 

function solve(job) {
    if(job.length === 0) return 1;
    if(job in memo) return memo[job];
    let count = 0;
    for(let rule of rules)
        if(job.startsWith(rule))
            count += solve(job.substring(rule.length));
    memo[job] = count;
    return count;
}

for(let job of jobs)
    solve(job);

console.log('part 1:', jobs.reduce((a,b) => a + (memo[b] > 0 ? 1 : 0), 0));
console.log('part 2:', jobs.reduce((a,b) => a + memo[b], 0));