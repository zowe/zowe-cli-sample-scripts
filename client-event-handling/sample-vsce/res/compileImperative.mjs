import { execSync } from "child_process";
import { resolve, join } from "path";
import { readFileSync, writeFileSync } from "fs";
(async () => {
  const impDir = resolve("node_modules/@zowe/imperative");
  const impTsConfigPath = join(impDir, "tsconfig.json");
  const impTsConfig = JSON.parse(readFileSync(impTsConfigPath).toString());
  delete impTsConfig.extends;
  impTsConfig.exclude = [
    "**/__tests__/**",
    "**/__mocks__/**",
  ];
  writeFileSync(impTsConfigPath, JSON.stringify(impTsConfig, null, 2));
  execSync(`tsc -p ${impTsConfigPath} --downlevelIteration`, {cwd: impDir, stdio: "inherit"});
})();