/**
 * Custom element used for the navbar demo
 * This example implements a custom zoom control
 */
export class CustomNavbarButton extends HTMLElement {
    constructor() {
        super();

        const dom = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        dom.appendChild(style);
        style.innerText = STYLE;

        const title = document.createElement('span');
        title.id = 'title';
        title.innerText = 'Custom element';
        dom.appendChild(title);

        this.input = document.createElement('input');
        this.input.type = 'range';
        dom.appendChild(this.input);

        this.value = document.createElement('span');
        this.value.id = 'value';
        dom.appendChild(this.value);

        this.input.addEventListener('input', () => {
            this.viewer.zoom(this.input.valueAsNumber);
        });
    }

    onUpdate() {
        this.input.value = this.viewer.getZoomLevel();
        this.value.innerText = this.input.valueAsNumber;
    }

    attachViewer(viewer) {
        this.viewer = viewer;
        this.onUpdate();
        viewer.addEventListener('zoom-updated', () => this.onUpdate());
    }
}

const STYLE = `
:host {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 0 10px;
}

#title {
    font-weight: bold;
}

input {
    margin: 0 10px;
}

#value {
    font-family: monospace;
    width: 2em;
}
`;
