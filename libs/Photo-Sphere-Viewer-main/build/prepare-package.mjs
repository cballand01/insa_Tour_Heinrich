/**
 * Copy the contents of each package "dist" folders to a root "dist" folder
 * In order to prepare the creation of the release ZIP
 */

import path from 'path';
import fs from 'fs-extra';

const PACKAGES_DIR = 'packages';
const DIST_DIR = 'dist';
const LICENSE_FILE = 'LICENSE';

fs.readdirSync(PACKAGES_DIR)
    .filter(name => name !== 'shared')
    .forEach((name) => {
        const source = path.join(PACKAGES_DIR, name, DIST_DIR);
        const destination = path.join(DIST_DIR, name);

        console.log(`copy ${name}`);

        fs.copySync(source, destination, {
            filter(name) {
                return name === source || ['/styles', '.module.js', '.cjs', '.css', '.scss', '.d.ts', '.d.mts', '.map', '.json'].some(ext => name.endsWith(ext));
            },
        });
    });

console.log(`COPY ${LICENSE_FILE}`);
fs.copySync(LICENSE_FILE, path.join(DIST_DIR, LICENSE_FILE));
