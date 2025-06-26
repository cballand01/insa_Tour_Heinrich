import { Controller } from 'lil-gui';

class TextController extends Controller {

    constructor(parent, object, property, rows = 4) {
        super(parent, object, property, 'textarea');

        this.$button = document.createElement('button');
        this.$button.innerText = 'Edit';
        this.$widget.appendChild(this.$button);

        this.$text = document.createElement('textarea');
        this.$text.rows = rows;
        Object.assign(this.$text.style, {
            border: '0',
            outline: 'none',
            resize: 'vertical',
            width: 'calc(100% - 2 * var(--spacing))',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--input-font-size)',
            borderRadius: 'var(--widget-border-radius)',
            background: 'var(--widget-color)',
            color: 'var(--text-color)',
            margin: 'var(--spacing)',
        })
        this.parent.$children.appendChild(this.$text);

        this.$button.addEventListener('click', () => this.doShow());

        this.$text.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) this.doSave();
            else if (e.key === 'Escape') this.doCancel();
        });

        this.$text.addEventListener('blur', () => this.doSave());

        this.doCancel();
    }

    doShow() {
        this.$text.style.display = 'block';
        this.$text.focus();
    }

    doSave() {
        this.$text.style.display = 'none';
        this.setValue(this.$text.value);
    }

    doCancel() {
        this.$text.style.display = 'none';
        this.$text.value = this.getValue();
    }
}

export function addTextarea(gui, object, property, rows) {
    return new TextController(gui, object, property, rows);
}
