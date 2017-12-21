const fs = require('fs');
const ANSWERS = require('./answers.json');
const input = fs.readFileSync('./inputs/day4.txt').toString();
const passphrases = input.split('\n').filter(x => x);

function validate(fn, str) {
    const words = str.split(' ');
    const dict = {};

    return !words.some(word => {
        const key = fn(word);

        if (dict[key]) return true;

        dict[key] = (dict[key] || 0) + 1;
        return false;
    });
}

const validateDuplicates = validate.bind(null, x => x);
const validateAnagrams = validate.bind(null, x => x.split('').sort().join(''));

function test1(passphrases) {
    const result = passphrases.reduce((sum, n) => {
        if (validateDuplicates(n)) {
            sum++;
        }

        return sum;
    }, 0);

    return result;
}

function test2(passphrases) {
    const result = passphrases.reduce((sum, n) => {
        if (validateDuplicates(n) && validateAnagrams(n)) {
            sum++;
        }

        return sum;
    }, 0);

    return result;
}

describe('day 4', () => {
    describe('test 1', () => {
        test('final input', () => {
            expect(test1(passphrases)).toBe(ANSWERS.day4.test1);
        });
    });

    describe('test 2', () => {
        test('final input', () => {
            expect(test2(passphrases)).toBe(ANSWERS.day4.test2);
        });
    });
});
