module.exports = {
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/', '/examples/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 75,
            lines: 80,
            statements: 80,
        },
    },
};
