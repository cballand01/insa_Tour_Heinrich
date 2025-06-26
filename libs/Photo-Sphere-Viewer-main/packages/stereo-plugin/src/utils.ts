/**
 * Returns the orientation of the screen
 */
export function getOrientation(): 'landscape' | 'portrait' {
    try {
        switch (screen.orientation.type) {
            case 'landscape-primary':
            case 'landscape-secondary':
                return 'landscape';
            case 'portrait-primary':
            case 'portrait-secondary':
                return 'portrait';
            default:
                throw new Error('unknown');
        }
    } catch {
        if (window.innerHeight > window.innerWidth) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }
}

/**
 * Wait for the screen to be in landscape orientation
 */
export function waitLandscape(cb: () => void): any {
    try {
        const listener = () => {
            if (getOrientation() === 'landscape') {
                cb();
            }
        };
        screen.orientation.addEventListener('change', listener);
        return listener;
    } catch {
        return setInterval(() => {
            if (getOrientation() === 'landscape') {
                cb();
            }
        }, 500);
    }
}

/**
 * Cancel the waiting for the landscape orientation
 */
export function cancelWaitLandscape(id: any) {
    if (typeof id === 'number') {
        clearInterval(id);
    } else {
        try {
            screen.orientation.removeEventListener('change', id);
        } catch {
            // empty
        }
    }
}
