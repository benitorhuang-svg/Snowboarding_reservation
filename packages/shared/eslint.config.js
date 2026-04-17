import tseslint from 'typescript-eslint';
import { baseConfig } from '../eslint-config/base.mjs';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts'],
  },
);
