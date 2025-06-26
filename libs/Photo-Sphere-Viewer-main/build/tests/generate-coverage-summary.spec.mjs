import assert from 'assert';
import { execSync } from 'child_process';
import path from 'path';

const testDir = path.join(import.meta.dirname, 'fixtures/generate-coverage-summary');

describe('generate-coverage-summary', () => {
    it('should generate the summmary', () => {
        const result = execSync(`node ${path.join(import.meta.dirname, '../generate-coverage-summary.mjs')}`, { cwd: testDir, encoding: 'utf-8' });

        const expected = `
# \${\\textsf{\\color{#d3343c}59.4\\\\%}}$ lines, \${\\textsf{\\color{#d3b334}65.5\\\\%}}$ functions, \${\\textsf{\\color{#d3343c}44.2\\\\%}}$ branches

| Package | Lines | Line Coverage | Functions | Function Coverage | Branches | Branch Coverage |
| ------- | -----:| ------------- | ---------:| ----------------- | --------:| ----------------|
| **compass-plugin** | 155/163 | \${\\textsf{\\color{#248f29}95.1\\\\%}}$ | 26/27 | \${\\textsf{\\color{#248f29}96.3\\\\%}}$ | 41/48 | \${\\textsf{\\color{#248f29}85.4\\\\%}}$ |
| **core** | 1638/2830 | \${\\textsf{\\color{#d3343c}57.9\\\\%}}$ | 402/618 | \${\\textsf{\\color{#d3b334}65.0\\\\%}}$ | 519/1202 | \${\\textsf{\\color{#d3343c}43.2\\\\%}}$ |
| **shared** | 1/26 | \${\\textsf{\\color{#d3343c}3.9\\\\%}}$ | 0/8 | \${\\textsf{\\color{#d3343c}0.0\\\\%}}$ | 0/17 | \${\\textsf{\\color{#d3343c}0.0\\\\%}}$ |
`;

        assert.strictEqual(result.trim(), expected.trim());
    });
});
