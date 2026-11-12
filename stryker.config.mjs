// Mutation testing: changes the code in small ways and checks that a unit test notices.
// It covers src/domain, where the business rules live and unit tests are required.
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: "vitest",
  vitest: { configFile: "vitest.config.mts" },
  mutate: [
    "src/domain/**/*.ts",
    "!src/domain/**/*.test.ts",
    "!src/domain/**/index.ts",
  ],
  reporters: ["clear-text"],
  tempDirName: "reports/stryker-tmp",
  cleanTempDir: "always",
  // Keep in step with thresholds.mutation_changed in factory/project.yaml.
  thresholds: { high: 90, low: 80, break: 70 },
};
