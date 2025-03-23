import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import"; // Import the "import" plugin
import typescriptParser from "@typescript-eslint/parser"; // Import the parser

export default [
  {
    ignores: ["**/dev", "**/.next/*", "**/temp.js", "config/*"]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 2021,
      sourceType: "module",
      parser: typescriptParser, // Use the imported parser object
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": typescriptPlugin,
      import: importPlugin, // Add the "import" plugin
    },
    rules: {
      "react/no-unescaped-entities": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
          message: "Do not use spread arguments in Array.push",
        },
      ],
      "no-unused-vars": "error",
      "import/no-duplicates": "error", // Ensure this rule works with the "import" plugin
      "import/no-unresolved": "off",
      "import/order": "off",
      "simple-import-sort/imports": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
