module.exports.runTests = (testCases, fn) => {
    testCases.forEach(tc => {
        test(
            tc.desc || (typeof tc.input === 'object' ? JSON.stringify(tc.input) : tc.input),
            () => {
                expect(fn(tc.input)).toEqual(tc.expected);
            }
        );
    });
};
