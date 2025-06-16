import { MathUtils } from 'three';
import { PSVError } from '../PSVError';
import { wrap } from './math';

const enum DynamicMode {
    STOP,
    INFINITE,
    POSITION,
}

/**
 * Represents a variable that can dynamically change with time (using requestAnimationFrame)
 */
export class Dynamic {
    private readonly min: number;
    private readonly max: number;
    private readonly wrap: boolean;

    private mode = DynamicMode.STOP;
    private speed = 0;
    private speedMult = 0;
    private currentSpeed = 0;
    private target = 0;
    private __current = 0;

    get current(): number {
        return this.__current;
    }

    private set current(current: number) {
        this.__current = current;
    }

    constructor(
        private readonly fn: (val: number) => void,
        config: {
            min: number;
            max: number;
            defaultValue: number;
            wrap: boolean;
        },
    ) {
        this.min = config.min;
        this.max = config.max;
        this.wrap = config.wrap;
        this.current = config.defaultValue;

        if (this.wrap && this.min !== 0) {
            throw new PSVError('invalid config');
        }

        if (this.fn) {
            this.fn(this.current);
        }
    }

    /**
     * Changes base speed
     */
    setSpeed(speed: number) {
        this.speed = speed;
    }

    /**
     * Defines the target position
     */
    goto(position: number, speedMult = 1) {
        this.mode = DynamicMode.POSITION;
        this.target = this.wrap ? wrap(position, this.max) : MathUtils.clamp(position, this.min, this.max);
        this.speedMult = speedMult;
    }

    /**
     * Increases/decreases the target position
     */
    step(step: number, speedMult = 1) {
        if (speedMult === 0) {
            this.setValue(this.current + step);
        } else {
            if (this.mode !== DynamicMode.POSITION) {
                this.target = this.current;
            }
            this.goto(this.target + step, speedMult);
        }
    }

    /**
     * Starts infinite movement
     */
    roll(invert = false, speedMult = 1) {
        this.mode = DynamicMode.INFINITE;
        this.target = invert ? -Infinity : Infinity;
        this.speedMult = speedMult;
    }

    /**
     * Stops movement
     */
    stop() {
        this.mode = DynamicMode.STOP;
    }

    /**
     * Defines the current position and immediately stops movement
     * @param {number} value
     */
    setValue(value: number): boolean {
        this.target = this.wrap ? wrap(value, this.max) : MathUtils.clamp(value, this.min, this.max);
        this.mode = DynamicMode.STOP;
        this.currentSpeed = 0;
        if (this.target !== this.current) {
            this.current = this.target;
            if (this.fn) {
                this.fn(this.current);
            }
            return true;
        }
        return false;
    }

    /**
     * @internal
     */
    update(elapsed: number): boolean {
        // in position mode switch to stop mode when in the decceleration window
        if (this.mode === DynamicMode.POSITION) {
            // in loop mode, alter "current" to avoid crossing the origin
            if (this.wrap && Math.abs(this.target - this.current) > this.max / 2) {
                this.current = this.current < this.target ? this.current + this.max : this.current - this.max;
            }

            const dstStop = (this.currentSpeed * this.currentSpeed) / (this.speed * this.speedMult * 4);
            if (Math.abs(this.target - this.current) <= dstStop) {
                this.mode = DynamicMode.STOP;
            }
        }

        // compute speed
        let targetSpeed = this.mode === DynamicMode.STOP ? 0 : this.speed * this.speedMult;
        if (this.target < this.current) {
            targetSpeed = -targetSpeed;
        }
        if (this.currentSpeed < targetSpeed) {
            this.currentSpeed = Math.min(
                targetSpeed,
                this.currentSpeed + (elapsed / 1000) * this.speed * this.speedMult * 2,
            );
        } else if (this.currentSpeed > targetSpeed) {
            this.currentSpeed = Math.max(
                targetSpeed,
                this.currentSpeed - (elapsed / 1000) * this.speed * this.speedMult * 2,
            );
        }

        // compute new position
        let next = null;
        if (this.current > this.target && this.currentSpeed) {
            next = Math.max(this.target, this.current + (this.currentSpeed * elapsed) / 1000);
        } else if (this.current < this.target && this.currentSpeed) {
            next = Math.min(this.target, this.current + (this.currentSpeed * elapsed) / 1000);
        }

        // apply value
        if (next !== null) {
            next = this.wrap ? wrap(next, this.max) : MathUtils.clamp(next, this.min, this.max);
            if (next !== this.current) {
                this.current = next;
                if (this.fn) {
                    this.fn(this.current);
                }
                return true;
            }
        }

        return false;
    }
}
