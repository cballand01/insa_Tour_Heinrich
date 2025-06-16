/**
 * Helper for pressable things (buttons, keyboard)
 * When the pressed thing goes up and was not pressed long enough, wait a bit more before execution
 * @internal
 */
export class PressHandler<TData = never> {
    private time = 0;
    private timeout: ReturnType<typeof setTimeout>;
    private data: TData;

    get pending() {
        return this.time !== 0;
    }

    constructor(private readonly delay = 200) {
        this.delay = delay;
    }

    down(data?: TData) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        this.time = new Date().getTime();
        this.data = data;
    }

    up(cb: (data: TData) => void) {
        if (!this.time) {
            return;
        }

        const elapsed = Date.now() - this.time;
        if (elapsed < this.delay) {
            this.timeout = setTimeout(() => {
                cb(this.data);
                this.timeout = undefined;
                this.time = 0;
                this.data = undefined;
            }, this.delay);
        } else {
            cb(this.data);
            this.time = 0;
            this.data = undefined;
        }
    }
}
