function getSampleInput() {
    return [0, 2, 7, 0];
}

function getInput() {
    const input = require('fs').readFileSync('inputs/day6.txt').toString();
    const state = input.trim().split('\t').map(x => +x);

    return state;
}

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

console.log('test1 with sample input:', test1(getSampleInput()));
console.log('test1 with input:', test1(getInput()));
console.log('test2 with input:', test2(getInput()));
