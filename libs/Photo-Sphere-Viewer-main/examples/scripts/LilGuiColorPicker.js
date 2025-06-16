import { Controller } from 'lil-gui';
import 'https://cdn.jsdelivr.net/npm/@eastdesire/jscolor/jscolor.min.js';

class ColorController extends Controller {

    constructor(parent, object, property, alpha = 'auto') {
        super(parent, object, property, 'color');

        this.$input = document.createElement('input');
        this.$input.setAttribute('aria-labelledby', this.$name.id);
        this.$input.value = this.getValue();

        this.$widget.appendChild(this.$input);

        this.picker = new window.jscolor(this.$input, {
            preset: 'dark',
            format: 'any',
            alphaChannel: alpha,
            borderRadius: 0,
            borderWidth: 0,
            height: 100,
            width: 150,
            sliderSize: 10,
            previewSize: 20,
            previewPadding: 3,
        });

        this.picker.onInput = () => {
            this.setValue(this.picker.toString());
        };
    }
}

export function addColorPicker(gui, object, property, alpha) {
    return new ColorController(gui, object, property, alpha);
}
