function getSampleInput() {
    return [0, 2, 7, 0];
}

function getInput() {
    const input = require('fs').readFileSync('inputs/day6.txt').toString();
    const state = input.trim().split('\t').map(x => +x);

    return state;
}

const ANSWERS = require('./answers.json');
const { runTests } = require('./utils');

const getKey = state => state.join(',');

const redistribute = state => {
    let blocks = state.reduce((a, b) => Math.max(a, b));
    let idx = state.findIndex(x => x === blocks);

    state[idx] = 0;

    while (blocks) {
        idx = (idx + 1) % state.length;
        state[idx]++;
        blocks--;
    }

    return state;
};

function test1(state) {
    const map = {};
    let steps = 0;

    while (!map[getKey(state)]) {
        map[getKey(state)] = true;
        redistribute(state);
        steps++;
    }

    return steps;
}

function test2(state) {
    const map = {};
    let steps = 0;

    while (!(getKey(state) in map)) {
        map[getKey(state)] = steps;
        redistribute(state);
        steps++;
    }

    return steps - map[getKey(state)];
}

describe('day 6', () => {
    describe('test 1', () => {
        runTests([
            { input: getSampleInput(), expected: 5 },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day6.test1 }
        ], test1);
    });

    describe('test 2', () => {
        runTests([
            { desc: 'final input', input: getInput(), expected: ANSWERS.day6.test2 }
        ], test2);
    });
});
