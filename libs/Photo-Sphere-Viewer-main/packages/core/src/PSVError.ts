export class PSVError extends Error {
    constructor(message: string, reason?: any) {
        super(reason && reason instanceof Error ? `${message}: ${reason.message}` : message);
        this.name = 'PSVError';
        (Error as any).captureStackTrace?.(this, PSVError);
    }
}
