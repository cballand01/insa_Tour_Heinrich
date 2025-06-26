import { callViewer, checkPosition, checkZoom, waitViewerReady } from '../../utils';
import { BASE_URL, NO_LOG } from '../../utils/constants';

describe('core: buttons', () => {
    beforeEach(() => {
        localStorage.photoSphereViewer_touchSupport = 'false';
        cy.visit('e2e/core/navbar.html');
        waitViewerReady();
        // createBaseSnapshot();
    });

    // does not work in headless mode
    it.skip('should enter and exit fullscreen', () => {
        cy.get('.psv-fullscreen-button').click();
        cy.wait(500);

        cy.document().its('fullscreenElement').should('not.be.null');

        cy.get('.psv-fullscreen-button').click();

        cy.document().its('fullscreenElement').should('be.null');
    });

    it('should zoom with buttons', () => {
        checkZoom(50);

        cy.get('[title="Zoom in"]').click();
        cy.wait(500);

        callViewer('check zoom >50')
            .then(viewer => expect(viewer.getZoomLevel()).gt(50));

        cy.get('[title="Zoom out"]').trigger('mousedown');
        cy.wait(500);
        cy.get('[title="Zoom out"]').trigger('mouseup');

        callViewer('check zoom <50')
            .then(viewer => expect(viewer.getZoomLevel()).lt(50));
    });

    it('should zoom with slider', () => {
        withZoomHandlePosition(({ element, x, y, width, height }) => {
            const clickPoint = { clientX: x + width * 0.5, clientY: y + height * 0.5 };
            const movePoint = { clientX: clickPoint.clientX + 20, clientY: clickPoint.clientY };

            element
                .trigger('mousedown', clickPoint)
                .trigger('mousemove', movePoint)
                .trigger('mouseup', movePoint);
        });

        checkZoom(75);

        withZoomHandlePosition(({ element, x, y, width, height }) => {
            const clickPoint = { clientX: x + width * 0.5, clientY: y + height * 0.5 };
            const movePoint = { clientX: 0, clientY: clickPoint.clientY };

            element
                .trigger('mousedown', clickPoint)
                .trigger('mousemove', movePoint)
                .trigger('mouseup', movePoint);
        });

        checkZoom(0);
    });

    it('should move left/right with buttons', () => {
        callViewer('set yaw =PI')
            .then(viewer => viewer.rotate({ yaw: Math.PI, pitch: 0 }));

        cy.get('[title="Move right"]').click();
        cy.wait(500);

        callViewer('check yaw >PI')
            .then(viewer => expect(viewer.getPosition().yaw).gt(Math.PI));

        cy.get('[title="Move left"]').trigger('mousedown');
        cy.wait(500);
        cy.get('[title="Move left"]').trigger('mouseup');

        callViewer('check zoom <Math.PI')
            .then(viewer => expect(viewer.getPosition().yaw).lt(Math.PI));
    });

    it('should move up/down with buttons', () => {
        checkPosition({ yaw: 0, pitch: 0 });

        cy.get('[title="Move up"]').click();
        cy.wait(500);

        callViewer('check pitch >0')
            .then(viewer => expect(viewer.getPosition().pitch).gt(0));

        cy.get('[title="Move down"]').trigger('mousedown');
        cy.wait(500);
        cy.get('[title="Move down"]').trigger('mouseup');

        callViewer('check pitch <0')
            .then(viewer => expect(viewer.getPosition().pitch).lt(0));
    });

    it('should download the panorama', () => {
        cy.get('.psv-download-button')
            .should('have.attr', 'href', BASE_URL + 'sphere-small.jpg')
            .should('have.attr', 'download', 'sphere-small.jpg');

        callViewer('set downloadName/downloadUrl').then(viewer => viewer.setOptions({
            downloadUrl: 'panorama-download.jpg',
            downloadName: 'my-panorama.jpg',
        }));

        cy.get('.psv-download-button')
            .should('have.attr', 'href', 'panorama-download.jpg')
            .should('have.attr', 'download', 'my-panorama.jpg');

        const png64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        callViewer('set downloadUrl base64').then(viewer => viewer.setOptions({
            downloadUrl: png64,
            downloadName: null,
        }));

        cy.get('.psv-download-button')
            .should('have.attr', 'href', png64)
            .should('have.attr', 'download', 'panorama.png');
    });

    function withZoomHandlePosition(cb: (res: {
        element: Cypress.Chainable<JQuery<HTMLElement>>;
        x: number;
        y: number;
        width: number;
        height: number;
    }) => void) {
        cy.get('.psv-zoom-range-handle').then((element) => {
            const { x, y, width, height } = element[0].getBoundingClientRect();

            cb({
                element: cy.wrap(element, NO_LOG),
                x, y, width, height,
            });
        });
    }
});
