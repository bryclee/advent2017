const input = require('fs').readFileSync('./inputs/day5.txt').toString();
const getInput = () =>
    input.split('\n')
        .filter(x => x)
        .map(x => Number(x));
const ANSWERS = require('./answers.json');
const { runTests } = require('./utils');

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

describe('day 5', () => {
    describe('test 1', () => {
        runTests([
            { input: sampleInstructions, expected: 5 },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day5.test1 }
        ], test1);
    });

    describe('test 1', () => {
        runTests([
            { input: sampleInstructions, expected: 10 },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day5.test2 }
        ], test2);
    });
});
