module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
