import reset from '../icons/reset.svg';
import { AbstractPlanButton, ButtonPosition } from './AbstractPlanButton';
import type { PlanComponent } from './PlanComponent';

export class PlanResetButton extends AbstractPlanButton {
    constructor(plan: PlanComponent) {
        super(plan, ButtonPosition.HORIZONTAL);

        this.container.innerHTML = reset;
        this.container.querySelector('svg').style.width = '80%';

        this.container.addEventListener('click', (e) => {
            plan.reset();
            e.stopPropagation();
        });
    }

    override update() {
        this.container.title = this.viewer.config.lang['mapReset'];
    }
}
