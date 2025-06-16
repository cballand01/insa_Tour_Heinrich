/**
 * Generate the release note
 */

import { stdin } from 'process';

const FROM_TAG = process.argv[2];
const TO_TAG = process.argv[3];

if (!FROM_TAG || !TO_TAG || FROM_TAG === TO_TAG) {
    process.stderr.write('No tags provided or same tags\n');
    process.exit(0);
}

let log = '';

stdin.setEncoding('utf8');

stdin.on('data', (chunk) => {
    log += chunk;
});

stdin.on('error', (e) => {
    process.stderr.write(e + '\n');
    process.exit(0);
});

stdin.on('end', () => {
    const content = `Full changelog: [${FROM_TAG}...${TO_TAG}](https://github.com/mistic100/Photo-Sphere-Viewer/compare/${FROM_TAG}...${TO_TAG})

${log
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !line.startsWith('chore') && !line.startsWith('doc'))
    .map(line => `- ${line}`)
    .join('\n')}`;

    process.stdout.write(content);
});
