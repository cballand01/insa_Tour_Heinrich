const BaseReporter = require('mocha/lib/reporters/base');
const SpecReporter = require('mocha/lib/reporters/spec');

module.exports = class MultiReporter extends BaseReporter {
    constructor(runner, options) {
        super(runner, options);

        new SpecReporter(runner, {});

        if (options.reporterOptions?.cypress) {
            const MochawesomeReporter = require('cypress-mochawesome-reporter/lib/reporter');
            this.mochawesome = new MochawesomeReporter(runner, {
                reporterOptions: {
                    reportFilename: '[name]',
                },
            });
        } else {
            const JsonReporter = require('mocha/lib/reporters/json');
            new JsonReporter(runner, {
                reporterOption: {
                    output: 'reports/mocha.json',
                },
            });
        }
    }

    done(failures, exit) {
        if (this.mochawesome) {
            this.mochawesome.done(failures, exit);
        } else {
            exit(failures);
        }
    }
};
