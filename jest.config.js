module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@controllers/(.*)$': '<rootDir>/src/presentation/http/controllers/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1'
  }
};
