/* eslint @typescript-eslint/no-var-requires: 0 */

const dotenv = require('dotenv')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

dotenv.config({ path: './.env.test' })

module.exports = {
  preset: 'ts-jest',
  displayName: 'server',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  rootDir: '.',
  modulePaths: ['<rootDir>/../../node_modules']
}
