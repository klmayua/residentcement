const baseConfig = require('../jest.config.base.js');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  displayName: 'customer-service',
  coverageDirectory: '<rootDir>/coverage',
};
