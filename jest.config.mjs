const jestConfig = {
  preset: 'ts-jest',
  clearMocks: true,
  projects: ['<rootDir>/packages/**/jest.config.js'],
  testMatch: ['*.spec.ts', '*.spec.tsx']
}

export default jestConfig
