/**
 * Generates a markdown summary from the coverage report
 */

import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const TOTAL = '_total_';

const script = new vm.Script(readFileSync('cypress/reports/lcov-viewer/report-data.js'));
const context = vm.createContext({ window: {} });
script.runInContext(context);

const values = Object.values(context.window.COVERAGE_DATA)
    .reduce((result, { metrics, path }) => {
        const module = path.split('/').shift();
        [TOTAL, module].forEach((key) => {
            const moduleMetrics = result[key] ?? {
                branches: { total: 0, covered: 0 },
                functions: { total: 0, covered: 0 },
                lines: { total: 0, covered: 0 },
            };

            moduleMetrics.branches.total += metrics.branches.total;
            moduleMetrics.branches.covered += metrics.branches.covered;
            moduleMetrics.functions.total += metrics.functions.total;
            moduleMetrics.functions.covered += metrics.functions.covered;
            moduleMetrics.lines.total += metrics.lines.total;
            moduleMetrics.lines.covered += metrics.lines.covered;

            result[key] = moduleMetrics;
        });
        return result;
    }, {});

function percentWithColor({ covered, total }) {
    const percent = Math.round(covered / total * 10000) / 100;
    const color = percent >= 80 ? '#248f29' : percent >= 60 ? '#d3b334' : '#d3343c';
    return `\${\\textsf{\\color{${color}}${percent.toFixed(1)}\\\\%}}$`;
}

const summary = `
# ${percentWithColor(values[TOTAL].lines)} lines, ${percentWithColor(values[TOTAL].functions)} functions, ${percentWithColor(values[TOTAL].branches)} branches

| Package | Lines | Line Coverage | Functions | Function Coverage | Branches | Branch Coverage |
| ------- | -----:| ------------- | ---------:| ----------------- | --------:| ----------------|
${Object.entries(values)
        .filter(([name]) => name !== TOTAL)
        .map(([name, { lines, functions, branches }]) => {
            const entry = ({ covered, total }) => `${covered}/${total} | ${percentWithColor({ covered, total })}`;
            return `| **${name}** | ${entry(lines)} | ${entry(functions)} | ${entry(branches)} |`;
        })
        .join('\n')
}
`;

process.stdout.write(summary);
