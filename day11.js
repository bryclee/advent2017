
const rawInput = require('fs').readFileSync('./inputs/day11.txt').toString().trim();
const ANSWERS = require('./answers.json');
const { runTests } = require('./utils.js');

const getInput = () => rawInput.split(',');

const normalize = as => {
    const min = as.reduce((a, b) => Math.abs(a) < Math.abs(b) ? a : b);

    return as.map(a => a - min);
};

const sign = n => n / Math.abs(n);

const parseDirection = ([a1, a2, a3], dir) => {
    const da1 = { 'n': 1, 's': -1 };
    const da2 = { 'sw': 1, 'ne': -1 };
    const da3 = { 'se': 1, 'nw': -1 };

    const na1 = (da1[dir] || 0) + a1;
    const na2 = (da2[dir] || 0) + a2;
    const na3 = (da3[dir] || 0) + a3;

    return normalize([na1, na2, na3]);
};

const getDistance = as => {
    // Only the first two matter after normalized
    const [a1, a2] = normalize(as).sort((a, b) => Math.abs(a) < Math.abs(b) ? 1 : -11);

    if (sign(a1) === sign(a2)) {
        return Math.abs(a1);
    } else {
        return Math.abs(a1) + Math.abs(a2);
    }
};

const test1 = input => {
    const position = input.reduce(parseDirection, [0, 0, 0]);

    return getDistance(position);
};

const test2 = input => {
    const { max: maxDistance } = input.reduce(({as, max}, dir) => {
        const nas = parseDirection(as, dir);

        return {
            as: nas,
            max: Math.max(max, getDistance(nas))
        };
    }, {
        as: [0, 0, 0],
        max: 0
    });

    return maxDistance;
};

describe('day11', () => {
    describe('test 1', () => {
        runTests([
            { input: 'ne,ne,ne'.split(','), expected: 3 },
            { input: 'ne,ne,sw,sw'.split(','), expected: 0 },
            { input: 'ne,ne,s,s'.split(','), expected: 2 },
            { input: 'se,sw,se,sw,sw'.split(','), expected: 3 },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day11.test1 }
        ], test1);
    });

    describe('test 2', () => {
        runTests([
            { desc: 'final input', input: getInput(), expected: ANSWERS.day11.test2 }
        ], test2);
    });
});

