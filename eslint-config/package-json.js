import { ERROR } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: ['package.json'],
  rules: {
    'jsonc/sort-keys': [
      ERROR,
      {
        order: [
          // Project information
          'name',
          'version',
          'description',
          'keywords',
          'homepage',
          'bugs',
          'license',
          'author',
          'contributors',
          'repository',
          'funding',
          'private',

          // Technical usage information
          'engines',
          'engineStrict',
          'os',
          'cpu',
          'publishConfig',
          'workspaces',
          'type',
          'config',

          // Output/build definitions
          'files',
          'directories',
          'packageManager',
          'exports',
          'imports',
          'main',
          'browser',
          'bin',
          'man',

          // Scripts
          'scripts',

          // Other configuration
          'lint-staged',

          // Depdendencies
          'dependencies',
          'devDependencies',
          'peerDependencies',
          'peerDependenciesMeta',
          'bundleDependencies',
          'optionalDependencies',
          'overrides',
        ],
        pathPattern: '^$',
      },
      {
        order: { type: 'asc' },
        pathPattern: '^(?:dev|peer|optional|bundle)?[Dd]ependencies(?:Meta)?$',
      },
    ],
  },
};
