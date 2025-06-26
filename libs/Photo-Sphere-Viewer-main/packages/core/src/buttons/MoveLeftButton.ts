import type { Navbar } from '../components/Navbar';
import { AbstractMoveButton, MoveButtonDirection } from './AbstractMoveButton';

export class MoveLeftButton extends AbstractMoveButton {
    static override readonly id = 'moveLeft';

    constructor(navbar: Navbar) {
        super(navbar, MoveButtonDirection.LEFT);
    }
}
