const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

/**@type {import('jest').Config} */
const config = {
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  testEnvironment: 'node'
}

module.exports = createJestConfig(config)
