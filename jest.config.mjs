import nextJest from 'next/jest.js'

const creatJestConfig = nextJest({
  dir: './'
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  testEnvironment: 'node'
}

export default creatJestConfig(config)
