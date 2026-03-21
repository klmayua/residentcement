const baseConfig = require('../jest.config.base.js');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  displayName: 'plant-mes-service',
  coverageDirectory: '<rootDir>/coverage',
};
