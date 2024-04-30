module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(js|tsx?)$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
    cacheDirectory: '.jest/cache',
    collectCoverage: true,
    coverageReporters: ['json-summary', 'text', 'lcov'],
  };