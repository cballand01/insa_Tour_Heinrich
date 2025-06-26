/**
 * Add the version provided as first parameter to the options of the issue templates
 */

import fs from 'fs';
import yaml from 'yaml';

const VERSION = process.argv[2];
const MAX_VERSIONS = 10;
const OTHER_LABEL = 'other';

if (!VERSION) {
    console.warn('No version provided');
    process.exit(0);
}

['.github/ISSUE_TEMPLATE/bug_report.yml', '.github/ISSUE_TEMPLATE/support_request.yml'].forEach((filename) => {
    if (!fs.existsSync(filename)) {
        console.warn(`${filename} does not exists`);
        return;
    }

    const content = yaml.parse(fs.readFileSync(filename, { encoding: 'utf8' }));

    const item = content.body.find(({ id }) => id === 'version');
    if (!item) {
        console.warn(`Dropdown not found in ${filename}`);
        return;
    }

    const versions = item.attributes.options.filter(v => v !== OTHER_LABEL);
    if (versions.indexOf(VERSION) !== -1) {
        console.warn(`Version ${VERSION} already exists in ${filename}`);
        return;
    }

    console.log(`Add ${VERSION} in ${filename}`);
    versions.unshift(VERSION);
    if (versions.length > MAX_VERSIONS) {
        versions.splice(MAX_VERSIONS, versions.length - MAX_VERSIONS);
    }
    versions.push(OTHER_LABEL);

    item.attributes.options = versions;

    fs.writeFileSync(filename, yaml.stringify(content, { lineWidth: 0 }));
});
