import type { Navbar } from '../components/Navbar';
import { AbstractMoveButton, MoveButtonDirection } from './AbstractMoveButton';

export class MoveUpButton extends AbstractMoveButton {
    static override readonly id = 'moveUp';

    constructor(navbar: Navbar) {
        super(navbar, MoveButtonDirection.UP);
    }
}
