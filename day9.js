class InvalidError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'InvalidError';
    }
}

class Group extends Array { }
class Garbage extends Array { }

const getInput = () => {
    return require('fs').readFileSync('./inputs/day9.txt').toString().trim();
};

const ANSWERS = require('./answers.json');

// Array helper, return first result from applying fn to items of the array
const first = (arr, fn) => {
    return arr.reduce((res, i) => res || fn(i), false);
};

// Make sure that the str passed is valid
const valid = str => str && str.length;

// Part 1 - PARSER RULES
// group: {}, {{},{}}
// garbage: <>, does not nest <
// cancel: !: cancels next char

const parseCancel = str => {
    if (!valid(str)) return null;
    else if (str[0] !== '!') return null;
    else return [
        null,
        str.slice(2)
    ];
};

// Return the first valid char, taking into account cancels
const parseChar = str => {
    if (!valid(str)) {
        throw new InvalidError('Unexpected end of input');
    }

    const res = parseCancel(str);

    return res ? parseChar(res[1]) : [ str[0], str.slice(1) ];
}

// Parse the contents of a group
const _parseGroupInternals = str => {
    let items = new Group();
    let res = parseSequence(str);

    while (res) {
        const parsed = res[0];
        str = res[1];

        if (parsed) {
            items.push(parsed);
        }

        const [ next, rem ] = parseChar(str);

        res = next === ',' && parseSequence(rem);
    }

    const [ next, rem ] = parseChar(str);

    if (next !== '}') {
        const err = new InvalidError(`Unexpected char ${next}\nfrom: ${str}`);

        throw err;
    }

    return [ items, rem ];
};

const parseGroup = str => {
    const [ next, rem ] = parseChar(str);

    if (next !== '{') return null;
    else return _parseGroupInternals(rem);
};

const parseGarbage = str => {
    let [ next, rem ] = parseChar(str);

    if (next !== '<') return null;
    else {
        const res = new Garbage();

        ([ next, rem ] = parseChar(rem));
        while (next !== '>') {
            res.push(next);
            ([ next, rem ] = parseChar(rem));
        }
        return [ res, rem ];
    }
}

const parseSequence = str => {
    return first(
        [
            parseGroup,
            parseGarbage
        ],
        p => p(str)
    );
};

const parse = str => {
    const [ parsed, rem ] = parseSequence(str);

    if (rem) throw new InvalidError(`Did not terminate\nRemaining: ${rem}`);

    return parsed;
}

// For counting the points of the groups in test 1
const _tallyGroups = (depth, tree) => {
    if (!(tree instanceof Group)) return 0;

    return tree.reduce(
        (sum, t) => sum + _tallyGroups(depth + 1, t),
        0
    ) + depth;
};

const tallyGroups = tree => {
    return _tallyGroups(1, tree);
};

// For counting the number of chars in the garbage in test 2
const tallyGarbage = tree => {
    return tree instanceof Garbage ? tree.length : tree.reduce(
        (sum, t) => sum + tallyGarbage(t),
        0
    );
};

const test1 = str => tallyGroups(parse(str));
const test2 = str => tallyGarbage(parse(str));

const runTests = (testCases, fn) => {
    testCases.forEach(tc => {
        test(tc.desc || tc.input, () => {
            expect(fn(tc.input)).toEqual(tc.expected);
        });
    });
};

describe('day 9', () => {
    describe('part 1', () => {
        testCases = [
            { input: '{}', expected: 1 },
            { input: '{{{}}}', expected: 6 },
            { input: '{{},{}}', expected: 5 },
            { input: '{{{},{},{{}}}}', expected: 16 },
            { input: '{!{}', expected: 1 },
            { input: '{<a>,<a>,<a>,<a>}', expected: 1},
            { input: '{{<a>},{<a>},{<a>},{<a>}}', expected: 9 },
            { input: '{{<!!>},{<!!>},{<!!>},{<!!>}}', expected: 9 },
            { input: '{{<a!>},{<a!>},{<a!>},{<ab>}}', expected: 3 },
            {
                desc: 'final input',
                input: getInput(),
                expected: ANSWERS.day9.test1
            }
        ];

        runTests(testCases, test1);
    });

    describe('part 2', () => {
        testCases = [
            { input: '<>', expected: 0 },
            { input: '<random characters>', expected: 17 },
            { input: '<<<<>', expected: 3 },
            { input: '<{!>}>', expected: 2 },
            { input: '<!!>', expected: 0 },
            { input: '<!!!>>', expected: 0 },
            { input: '<{o"i!a,<{i<a>', expected: 10 },
            {
                desc: 'final input',
                input: getInput(),
                expected: ANSWERS.day9.test2
            }
        ];

        runTests(testCases, test2);
    });
});
