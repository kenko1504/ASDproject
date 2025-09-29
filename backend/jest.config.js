export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: [
        '**/test/**/*.test.js',
        '**/__tests__/**/*.test.js'
    ],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js',
        'middleware/**/*.js'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};