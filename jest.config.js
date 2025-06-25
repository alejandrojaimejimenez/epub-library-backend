module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  moduleNameMapper: {
    '^@routes/(.*)$': '<rootDir>/src/presentation/http/routes/$1',
    '^@controllers/(.*)$': '<rootDir>/src/presentation/http/controllers/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/presentation/http/middlewares/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
    '^@config/(.*)$': '<rootDir>/src/shared/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@dtos/(.*)$': '<rootDir>/src/application/dtos/$1',
    '^@services/(.*)$': '<rootDir>/src/application/services/$1',
    '^@models/(.*)$': '<rootDir>/src/domain/models/$1',
    '^@repositories/(.*)$': '<rootDir>/src/domain/repositories/$1',
    '^@auth/(.*)$': '<rootDir>/src/infrastructure/auth/$1',
    '^@db/(.*)$': '<rootDir>/src/infrastructure/db/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@types/(.*)$': '<rootDir>/src/shared/types/$1',
    '^@constants/(.*)$': '<rootDir>/src/shared/constants/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1'
  }
};
