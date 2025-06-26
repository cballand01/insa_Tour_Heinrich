import type { Navbar } from '../components/Navbar';
import { AbstractMoveButton, MoveButtonDirection } from './AbstractMoveButton';

export class MoveDownButton extends AbstractMoveButton {
    static override readonly id = 'moveDown';

    constructor(navbar: Navbar) {
        super(navbar, MoveButtonDirection.DOWN);
    }
}
