const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  coverageDirectory: 'coverage',
  cacheDirectory: '<rootDir>/.jestcache',
  verbose: true,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};

module.exports = createJestConfig(customJestConfig);
