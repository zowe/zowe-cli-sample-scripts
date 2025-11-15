const maxLines = 150;
module.exports = {
  "root": true,
  "env": {
    "es2021": true,
    "node": true,
    "jest/globals": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "ignorePatterns": [
    "**/*.d.ts"
  ],
  "overrides": [
    {
      "extends": [
        "plugin:mocha/recommended"
      ],
      "files": [
        "test/*.js"
      ],
      "rules": {
        "@typescript-eslint/no-magic-numbers": "off",
        "mocha/no-setup-in-describe": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "jest",
    "mocha",
    "unused-imports"
  ],
  "rules": {
    "max-len": ["warn", maxLines],
    "no-console": "off",
    "no-multiple-empty-lines": "warn",
    "no-trailing-spaces": "warn",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/comma-dangle": ["warn", "only-multiline"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/indent": ["warn", 2],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-magic-numbers": ["warn", {
      "ignore": [-1, 0, 1, 2],
      "ignoreDefaultValues": true,
      "ignoreReadonlyClassProperties": true
    }],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/semi": "warn",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": ["warn", {
      "args": "none"
    }]
  }
};
