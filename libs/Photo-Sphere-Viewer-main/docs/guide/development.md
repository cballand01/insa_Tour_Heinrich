# Development

Photo Sphere Viewer is developped in [TypeScript](https://www.typescriptlang.org/) and [SASS](https://sass-lang.com/).
The repository is a [Turborepo](https://turbo.build/repo) mono-repo containing the core package as well as official adapters and plugins.
The building process is based on [tsup](https://tsup.egoist.dev/) (toolkit based on esbuild) with a bunch of customizations.
The documentation is created with [VitePress](https://vitepress.dev/) and [TypeDoc](https://typedoc.org/).
Files are linted with [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/).
Tests are executed with [Mocha](https://mochajs.org/) and [Cypress](https://www.cypress.io/).
You will need [Node.js 20](https://nodejs.org/).

## Commands

-   launch the dev server with `npm run serve`
    -   watch only some packages wuth `npm run serve-filter`
-   launch the documentation with `npm run doc:serve`
-   launch the Cypress runner with `npm run e2e:open`
-   register all package for npm link with `npm run npm-link`
-   execute the linters with `npm run lint`
-   execute the unit tests with `npm run test`
-   execute the e2e tests with `npm run e2e:run`
-   build all the packages with `npm run build`
-   build the documentation with `npm run doc:build`
