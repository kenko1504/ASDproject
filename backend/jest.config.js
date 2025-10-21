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
  verbose: true,
  // Separate test groups
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/test/**/*.test.js', '!**/test/**/*.e2e.test.js']
    },
    {
      displayName: 'grocery',
      testMatch: ['**/test/**/grocery*.test.js'],
      testTimeout: 30000
    }
  ]
};