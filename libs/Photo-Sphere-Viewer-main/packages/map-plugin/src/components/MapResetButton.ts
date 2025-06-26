import reset from '../icons/reset.svg';
import { AbstractMapButton, ButtonPosition } from './AbstractMapButton';
import type { MapComponent } from './MapComponent';

export class MapResetButton extends AbstractMapButton {
    constructor(map: MapComponent) {
        super(map, ButtonPosition.HORIZONTAL);

        this.container.innerHTML = reset;
        this.container.querySelector('svg').style.width = '80%';

        this.container.addEventListener('click', (e) => {
            map.reset();
            e.stopPropagation();
        });
    }

    override update() {
        this.container.title = this.viewer.config.lang['mapReset'];
    }
}
