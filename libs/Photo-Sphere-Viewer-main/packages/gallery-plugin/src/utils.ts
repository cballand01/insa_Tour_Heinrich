export function clickRepeater(element: HTMLElement, cb: () => void) {
    let interval: ReturnType<typeof setInterval>;

    element.addEventListener('mousedown', () => {
        cb();

        clearInterval(interval);

        interval = setInterval(() => {
            // the element has been hidden
            if (element.style.pointerEvents === 'none') {
                clearInterval(interval);
            } else {
                cb();
            }
        }, 500);
    });

    element.addEventListener('mouseup', () => {
        clearInterval(interval);
    });
}
