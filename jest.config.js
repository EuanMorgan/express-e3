/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/config/test'],
  clearMocks: true,
  forceExit: true,
  resetMocks: true,
  restoreMocks: true,
};
