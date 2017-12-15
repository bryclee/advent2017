const input = require('fs').readFileSync('./inputs/day5.txt').toString();
const instructions =
    input.split('\n')
        .filter(x => x)
        .map(x => Number(x));

function test1(inst) {
    inst = inst.slice();
    let position = 0;
    let steps = 0;

    while(position in inst) {
        const old = position;

        position += inst[position];
        inst[old]++;
        steps++;
    }

    return steps;
}

function test2(inst) {
    inst = inst.slice();
    let position = 0;
    let steps = 0;

    while (position in inst) {
        const jump = inst[position];
        const old = position;

        position += inst[position];
        if (jump >= 3) {
            inst[old]--;
        } else {
            inst[old]++;
        }
        steps++;
    }

    return steps;
}

const sampleInstructions = [0,3,0,1,-3];

console.log('test 1 with sample:', test1(sampleInstructions));
console.log('test 1:', test1(instructions));
console.log('test 2 with sample:', test2(sampleInstructions));
console.log('test 2:', test2(instructions));
