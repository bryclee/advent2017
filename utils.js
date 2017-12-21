module.exports.runTests = (testCases, fn) => {
    testCases.forEach(tc => {
        test(tc.desc || tc.input, () => {
            expect(fn(tc.input)).toBe(tc.expected);
        });
    });
}
