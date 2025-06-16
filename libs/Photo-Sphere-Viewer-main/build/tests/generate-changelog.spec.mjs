import assert from 'assert';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const testDir = path.join(import.meta.dirname, 'fixtures/generate-changelog');

describe('generate-changelog', () => {
    it('should generate the changelog', (done) => {
        const gitLog = readFileSync(path.join(testDir, 'git-log.txt'), { encoding: 'utf8' });

        const proc = exec(`node ${path.join(import.meta.dirname, '../generate-changelog.mjs')} 5.7.4 5.8.0`, { cwd: testDir }, (err) => {
            if (err) {
                assert.fail(err);
            }
        });

        let actual = '';
        proc.stdout.on('data', (data) => {
            actual += data;
        });

        proc.stdin.write(gitLog);
        proc.stdin.end();

        proc.on('exit', () => {
            const expected = `
Full changelog: [5.7.4...5.8.0](https://github.com/mistic100/Photo-Sphere-Viewer/compare/5.7.4...5.8.0)

- Fix #1329 virtual-tour: cannot click on arrows
- Fix #1326 markers: update marker failed when not in view
- Read additional XMP data
- Close #1288 dual fisheye adapter
- Fix overlays: export model
- Close #1163 virtual-tour: new arrows
- Close #1118 markers: add new "elementLayer" type
- Remove LittlePlanetAdapter`;

            assert.strictEqual(actual.trim(), expected.trim());

            done();
        });
    });
});
