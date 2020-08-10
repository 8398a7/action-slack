module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  coverageDirectory: './coverage/',
  collectCoverage: true,
  preset: 'ts-jest',
  globalSetup: './__tests__/setupTest.ts',
};
