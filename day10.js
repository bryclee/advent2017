const rawInput = require('fs').readFileSync('./inputs/day10.txt').toString().trim();
const getInput = () => {
    return rawInput.split(',').map(Number);
};
const ANSWERS = require('./answers.json');
const { runTests } = require('./utils.js');

const hash = (chain, [ first, ...rest ], i = 0, skip = 0) => {
    if (typeof first === 'undefined') return chain;

    const spill = i + first <= chain.length ? 0 : (i + first) % chain.length;
    const reversed =
        chain
            .slice(i, i + first)
            .concat(chain.slice(0, spill))
            .reverse();

    return hash(
        reversed.slice(reversed.length - spill)
            .concat(chain.slice(spill, i))
            .concat(reversed.slice(0, reversed.length - spill))
            .concat(chain.slice(i + first)),
        rest,
        (i + first + skip) % chain.length,
        skip + 1
    );
};

const test1 = ({n, lengths}) => {
    const chain =
        hash(
            Array.from(Array(n).keys()),
            lengths
        );

    return chain[0] * chain[1];
};

const getChunks = (arr, n) => arr.length === 0 ? [] : [arr.slice(0, n), ...getChunks(arr.slice(n), n)];

const test2 = str => {
    const starter = Array.from(Array(256).keys());
    const end = [17, 31, 73, 47, 23].map(c => String.fromCharCode(c)).join('');
    const lengths = `${str}${end}`.repeat(64).split('').map(c => c.charCodeAt());
    const sparseHash = hash(starter, lengths);
    const denseHash =
        getChunks(sparseHash, 16)
        .map(c => c.reduce((a, b) => a ^ b));
    const knotHash = denseHash.map(n => n.toString(16).padStart(2, '0')).join('');

    return knotHash;
};

describe('day 10', () => {
    describe('hash', () => {
        runTests([
            {
                desc: 'wrap over',
                input: {
                    n: 5,
                    lengths: [3],
                    i: 3
                },
                expected: [3, 1, 2, 0, 4]
            },
            {
                desc: 'in middle',
                input: {
                    n: 5,
                    lengths: [3],
                    i: 1
                },
                expected: [0, 3, 2, 1, 4]
            },
            {
                desc: 'in middle two step',
                input: {
                    n: 5,
                    lengths: [3, 3],
                    i: 1,
                    skip: 2
                },
                expected: [0, 1, 2, 3, 4]
            },
            {
                desc: 'most of list from middle',
                input: {
                    n: 5,
                    lengths: [5, 2],
                    i: 3,
                    skip: 2
                },
                /**
                 * 0 1 2 3 4
                 * 0 4 3 2 1
                 * 4 0 3 2 1
                 */
                expected: [4, 0, 3, 2, 1]
            },
            {
                desc: 'length 0 and 1 unchanged',
                input: {
                    n: 5,
                    lengths: [1, 0],
                    i: 4,
                    skip: 1
                },
                expected: [0, 1, 2, 3, 4]
            }
        ], ({n, lengths, i, skip}) => hash(Array.from(Array(n).keys()), lengths, i, skip));
    });

    describe('test 1', () => {
        runTests([
            {
                input: {
                    n: 5,
                    lengths: [3, 4, 1, 5]
                },
                expected: 12
            },
            {
                desc: 'final input',
                input: {
                    n: 256,
                    lengths: getInput()
                },
                expected: ANSWERS.day10.test1
            }
        ], test1);
    });

    describe('test 2', () => {
        runTests([
            { input: '', expected: 'a2582a3a0e66e6e86e3812dcb672a272' },
            { input: 'AoC 2017', expected: '33efeb34ea91902bb2f59c9920caa6cd' },
            { input: '1,2,3', expected: '3efbe78a8d82f29979031a4aa0b16a9d' },
            { input: '1,2,4', expected: '63960835bcdc130f0b66d7ff4f6a5a8e' },
            { desc: 'final input', input: rawInput, expected: ANSWERS.day10.test2 }
        ], test2);
    });
});
