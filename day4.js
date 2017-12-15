const fs = require('fs');
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

    console.log('Test 1:', result);
}

function test2(passphrases) {
    const result = passphrases.reduce((sum, n) => {
        if (validateDuplicates(n) && validateAnagrams(n)) {
            sum++;
        }

        return sum;
    }, 0);

    console.log('Test 2:', result);
}


test1(passphrases);
test2(passphrases);
