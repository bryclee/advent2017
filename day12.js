
const rawInput = require('fs').readFileSync('./inputs/day12.txt').toString().trim();
const ANSWERS = require('./answers.json');
const { runTests } = require('./utils.js');

const getInput = () => rawInput.split('\n')
    .reduce(
        (prgms, line) => {
            const [_, prgm, toPrgms ] = line.match(/(\d*) <-> (.*)/);

            return prgms.set(+prgm, toPrgms.split(', ').map(Number));
        },
        new Map()
    );

const getProgramSet = (prgms, idx, set = new Set()) => {
    return set.has(idx) ?
        set :
        prgms.get(idx).reduce(
            (s, p) => getProgramSet(prgms, p, s),
            set.add(idx)
        );
};

const test1 = input => {
    const set = getProgramSet(input, 0);

    return [...set.values()].length;
};

const test2 = input => {
    let set = new Set();
    let counter = 0;

    for (let key of input.keys()) {
        if (!set.has(key)) {
            set = getProgramSet(input, key, set);
            counter++;
        }
    }

    return counter;
};

describe('day12', () => {
    describe('test 1', () => {
        runTests([
            {
                input: new Map([
                    [0, [2]],
                    [1, [1]],
                    [2, [0,3,4]],
                    [3, [2,4]],
                    [4, [2,3,6]],
                    [5, [6]],
                    [6, [4,5]]
                ]),
                expected: 6
            },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day12.test1 }
        ], test1);
    });

    describe('test 2', () => {
        runTests([
            {
                input: new Map([
                    [0, [2]],
                    [1, [1]],
                    [2, [0,3,4]],
                    [3, [2,4]],
                    [4, [2,3,6]],
                    [5, [6]],
                    [6, [4,5]]
                ]),
                expected: 2
            },
            { desc: 'final input', input: getInput(), expected: ANSWERS.day12.test2 }
        ], test2);
    });
});

