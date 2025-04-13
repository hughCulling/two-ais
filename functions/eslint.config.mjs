    // functions/eslint.config.mjs
    // Flat ESLint configuration for Firebase Functions (Node.js/TypeScript)

    import globals from "globals";
    import pluginJs from "@eslint/js";
    import tseslint from "typescript-eslint";

    export default [
      // Configuration for Node.js environment globals
      {
        languageOptions: {
          globals: {
            ...globals.node, // Standard Node.js globals
          },
        },
      },

      // ESLint recommended base rules
      pluginJs.configs.recommended,

      // TypeScript specific rules (plugin and parser)
      // This replaces the need for separate parser/plugin definitions
      ...tseslint.configs.recommended,

      // Custom rule configurations
      {
        rules: {
          // Customize rules here if needed
          "quotes": ["error", "double"], // Enforce double quotes
          // Allow console logs in functions (often useful for debugging)
          "no-console": "off",
          // You might want to relax 'no-explicit-any' slightly for functions if needed,
          // but 'unknown' with type guards is generally better. Let's keep default for now.
          // "@typescript-eslint/no-explicit-any": "warn",
          // Add any other project-specific rules or overrides
        },
      },

      // Ignore build output directory
      {
        ignores: ["lib/**"],
      },
    ];
    