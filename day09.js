let input = require('fs').readFileSync('./input/day09.txt', 'utf8').replaceAll('\r','');
let diskSize = 0;
for(let c of input)
    diskSize += +c;

function createDisk() {
    let arr = new Array(diskSize);
    let ptr = 0;
    for(let i=0; i<input.length; i++)
        for(let j=0; j<input[i]; j++) 
            arr[ptr++] = (i % 2 === 0) ? i/2 : -1;
    return arr;
}

function calculateChecksum(disk) {
    return disk.reduce((a,b,i) => a + i * Math.max(0, b), 0);
}

let disk = createDisk();
let front = 0, back = disk.length-1;
while(front < back) {
    while(disk[front] >= 0) front++;
    while(disk[back] < 0) back--;
    if(front < back)
        [disk[front], disk[back]] = [disk[back], disk[front]];
}

console.log('part 1:',calculateChecksum(disk));

disk = createDisk();
front = 0; back = disk.length-1;
while(front < back) {
    while(disk[front] >= 0) front++;
    while(disk[back] < 0) back--;
    if(front < back) {
        // find size of back block
        let temp = back;
        while(disk[temp] === disk[back]) temp--;
        let backSize = back - temp;

        // loop through all possible empty blocks, starting from first available
        let frontSize, movingFront = front;
        do {
            temp = movingFront;
            while(disk[temp] === disk[movingFront]) temp++;
            frontSize = temp - movingFront;
            // if we can make the swap, do it and move on
            if(frontSize >= backSize) {
                for(let i=0; i<backSize; i++)
                    [disk[movingFront+i], disk[back-i]] = [disk[back-i], disk[movingFront+i]];
                break;
            }
            // if not, we have to look for the next block that might fit
            else {
                movingFront += frontSize;
                while(disk[movingFront] >= 0) movingFront++;
            }
        } while(movingFront < back);
        // if we couldn't find a spot for the back block, move on from it
        if(disk[back] >= 0)
            back -= backSize;     
    }
}

console.log('part 2:',calculateChecksum(disk));