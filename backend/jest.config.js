// Root Jest configuration for running all tests
/** @type {import('jest').Config} */
module.exports = {
  projects: [
    'gateway',
    'services/customer-service',
    'services/events',
    'services/inventory-service',
    'services/logistics-service',
    'services/order-service',
    'services/payment-service',
    'services/plant-mes-service',
    'services/pricing-service',
    'services/product-service',
    'services/quality-service',
  ].map(service => `<rootDir>/${service}/jest.config.js`),
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
