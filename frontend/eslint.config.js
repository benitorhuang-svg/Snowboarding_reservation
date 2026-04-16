import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import { baseConfig } from '../packages/eslint-config/base.mjs';

export default tseslint.config(...baseConfig, globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
});
