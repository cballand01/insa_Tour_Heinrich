import { callViewer } from '../../utils';

describe('core: loader', () => {
    beforeEach(() => {
        cy.visit('e2e/core/loader.html');
        // createBaseSnapshot();
    });

    it('should have a loader', () => {
        cy.get('.psv-loader')
            .should('be.visible')
            .should('include.text', 'Loading...')
            .should((loader) => {
                const { x, y, width, height } = loader[0].getBoundingClientRect();
                expect({ x, y, width, height }).to.deep.eq({ x: 565, y: 375, width: 150, height: 150 });
            })
            .compareScreenshots('base');
    });

    it('should hide/show the loader', () => {
        callViewer('hide loader').then(viewer => viewer.loader.hide());

        cy.get('.psv-loader').should('not.be.visible');

        callViewer('show loader').then(viewer => viewer.loader.show());

        cy.get('.psv-loader').should('be.visible');
    });

    it('should change the loading text and image', () => {
        callViewer('set lang.loading').then(viewer => viewer.setOption('lang', { loading: 'Chargement...' }));

        cy.get('.psv-loader').should('include.text', 'Chargement...');

        callViewer('set loadingTxt').then(viewer => viewer.setOption('loadingTxt', 'Veuillez patienter'));

        cy.get('.psv-loader').should('include.text', 'Veuillez patienter');

        callViewer('set loadingImg').then(viewer => viewer.setOption('loadingImg', 'https://photo-sphere-viewer.js.org/favicon.png'));

        cy.waitForResources('favicon.png');
        cy.get('.psv-loader').compareScreenshots('loading-img');
    });

    it('should change the progression', () => {
        [[0, 0], [45, 45], [75, 75], [100, 100], [-20, 0], [150, 100]]
            .forEach(([progress, expected]) => {
                callViewer(`set progress ${progress}`).then(viewer => viewer.loader.setProgress(progress));

                cy.get('.psv-loader').compareScreenshots(`progress_${expected}`);
            });
    });
});
