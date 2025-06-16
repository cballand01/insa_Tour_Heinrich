import type { Navbar } from '../components/Navbar';
import { AbstractMoveButton, MoveButtonDirection } from './AbstractMoveButton';

export class MoveRightButton extends AbstractMoveButton {
    static override readonly id = 'moveRight';

    constructor(navbar: Navbar) {
        super(navbar, MoveButtonDirection.RIGHT);
    }
}
