module.exports = {
  'testEnvironment': 'node',
  'verbose': true,
  'roots': ['<rootDir>/test', '<rootDir>/src'],
  'transform': {
    '\\.tsx?$': 'ts-jest'
  },
  'testRegex': '(\\.(test|spec))\\.(jsx?|tsx?)$',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
};