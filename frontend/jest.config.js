export default {
  testEnvironment: "jest-environment-jsdom", // Use jsdom for DOM testing
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest", // Transform JS/TSX files using Babel
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS files
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock image files
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"], // Jest setup file
  collectCoverage: true, // Enable coverage report
  coverageDirectory: "coverage", // Output coverage directory
  coverageReporters: ["json", "lcov", "text", "clover"], // Coverage report formats
};
