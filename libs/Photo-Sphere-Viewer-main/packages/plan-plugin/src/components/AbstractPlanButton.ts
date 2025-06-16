import { AbstractComponent } from '@photo-sphere-viewer/core';
import { PlanComponent } from './PlanComponent';

export const enum ButtonPosition {
    DEFAULT,
    DIAGONAL,
    HORIZONTAL,
    VERTICAL,
}

const INVERT_POSITIONS: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

function getButtonPosition(mapPosition: [string, string], direction: ButtonPosition): [string, string] {
    switch (direction) {
        case ButtonPosition.DIAGONAL:
            return [INVERT_POSITIONS[mapPosition[0]], INVERT_POSITIONS[mapPosition[1]]];
        case ButtonPosition.HORIZONTAL:
            return [mapPosition[0], INVERT_POSITIONS[mapPosition[1]]];
        case ButtonPosition.VERTICAL:
            return [INVERT_POSITIONS[mapPosition[0]], mapPosition[1]];
        default:
            return mapPosition;
    }
}

export abstract class AbstractPlanButton extends AbstractComponent {
    constructor(
        protected plan: PlanComponent,
        private position: ButtonPosition,
    ) {
        super(plan, {});
    }

    applyConfig() {
        this.container.className = `psv-plan__button psv-plan__button--${getButtonPosition(this.plan.config.position, this.position).join('-')}`;
        this.update();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update() {}
}
