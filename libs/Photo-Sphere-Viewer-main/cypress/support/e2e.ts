import 'cypress-mochawesome-reporter/register';
import '@cypress/code-coverage/support';
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command';
import { NO_LOG } from '../utils/constants';

addCompareSnapshotCommand({
    errorThreshold: 0.05,
    failSilently: !Cypress.config('isInteractive'),
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface Chainable {
            compareScreenshots(name: string, options?: { errorThreshold?: number; hideViewer?: boolean }): Chainable<JQuery<HTMLElement>>;

            waitForResources(...names: string[]);
        }
    }
}

Cypress.Commands.add('compareScreenshots', { prevSubject: ['element'] }, (subject, name, options = {}) => {
    if (options.hideViewer !== false) {
        cy.get('.psv-canvas-container', { log: false }).then(container => container.hide());
    }

    cy.wrap(subject, { log: false }).compareSnapshot(name, options)
        .then((result) => {
            if (result.images.diff) {
                // @ts-ignore
                Cypress.Mochawesome.context.push({ title: `Visual regression diff (${name})`, value: 'data:image/png;base64,' + result.images.diff });
            }

            if (result.error) {
                throw new Error(result.error);
            }

            if (options.hideViewer !== false) {
                return cy.get('.psv-canvas-container', { log: false }).then(container => container.show());
            }
        });

    return cy.wrap(subject, { log: false });
});

Cypress.Commands.add('waitForResources', (...names) => {
    cy.log(`Waiting for resources ${names.join(', ')}`);

    cy.window(NO_LOG).then((win) => {
        return new Cypress.Promise((resolve, reject) => {
            let foundResources = false;

            const timeout = setTimeout(() => {
                if (foundResources) {
                    return;
                }

                clearInterval(interval);
                clearTimeout(timeout);

                reject(new Error(`Timed out waiting for resources ${names.join(', ')}`));
            }, 10000);

            const interval = setInterval(() => {
                foundResources = names.every((name) => {
                    return win.performance
                        .getEntriesByType('resource')
                        .find(item => item.name.endsWith(name));
                });

                if (!foundResources) {
                    return;
                }

                clearInterval(interval);
                clearTimeout(timeout);

                cy.log('Found all resources');
                resolve();
            }, 100);
        });
    });
});
