/**
 * Starts the server (first argument), launches the tests (second argument), then close the server
 */

import { spawn } from 'child_process';

const SERVE_SCRIPT = process.argv[2];
const TEST_SCRIPT = process.argv[3];

const serveProcess = spawn('yarn', SERVE_SCRIPT.split(' '), {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
});

const testProcess = spawn('yarn', TEST_SCRIPT.split(' '), {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
});

testProcess.on('exit', () => {
    serveProcess.kill();
});

process.on('SIGINT', () => {
    testProcess.kill();
    serveProcess.kill();
    process.exit();
});
