import assert from 'assert';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const testDir = path.join(import.meta.dirname, 'fixtures/generate-typedoc-readme');

describe('generate-typedoc-readme', () => {
    it('should generate the readme', () => {
        execSync(`node ${path.join(import.meta.dirname, '../generate-typedoc-readme.mjs')}`, { cwd: testDir });

        const cases = {
            '.tmp/typedoc/README.md': `
# Core

- [Viewer](classes/Core.Viewer.html)
- [events](modules/Core.events.html)
- [utils](modules/Core.utils.html)

# Plugins

- [TestPlugin](modules/TestPlugin.html)

# Adapters

- [TestAdapter](modules/TestAdapter.html)`,

            'packages/core/.tmp/typedoc/README.md': `
NPM package : [@photo-sphere-viewer/core](https://www.npmjs.com/package/@photo-sphere-viewer/core)

Documentation : https://photo-sphere-viewer.js.org`,

            'packages/test-adapter/.tmp/typedoc/README.md': `
NPM package : [@photo-sphere-viewer/test-adapter](https://www.npmjs.com/package/@photo-sphere-viewer/test-adapter)

Documentation : https://photo-sphere-viewer.js.org/adapters/test.html`,

            'packages/test-plugin/.tmp/typedoc/README.md': `
NPM package : [@photo-sphere-viewer/test-plugin](https://www.npmjs.com/package/@photo-sphere-viewer/test-plugin)

Documentation : https://photo-sphere-viewer.js.org/plugins/test.html`,
        };

        Object.entries(cases).forEach(([file, expected]) => {
            const actual = readFileSync(path.join(testDir, file), { encoding: 'utf8' });
            assert.strictEqual(actual.trim(), expected.trim());
        });
    });
});
