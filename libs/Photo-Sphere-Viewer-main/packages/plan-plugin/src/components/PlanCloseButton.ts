import { CONSTANTS } from '@photo-sphere-viewer/core';
import icon from '../icons/map.svg';
import { AbstractPlanButton, ButtonPosition } from './AbstractPlanButton';
import type { PlanComponent } from './PlanComponent';

export class PlanCloseButton extends AbstractPlanButton {
    constructor(plan: PlanComponent) {
        super(plan, ButtonPosition.DEFAULT);

        this.container.addEventListener('click', (e) => {
            plan.toggleCollapse();
            e.stopPropagation();
        });
    }

    override applyConfig(): void {
        super.applyConfig();
        this.container.classList.add('psv-plan__button-close');
    }

    override update() {
        this.container.innerHTML = this.plan.collapsed ? icon : CONSTANTS.ICONS.close;
        this.container.title = this.plan.collapsed ? this.viewer.config.lang['map'] : this.viewer.config.lang.close;
    }
}
