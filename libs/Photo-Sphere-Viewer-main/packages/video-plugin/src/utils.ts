export function formatTime(time: number) {
    const seconds = Math.round(time % 60);
    const minutes = Math.round(time - seconds) / 60;
    return `${minutes}:${('0' + seconds).slice(-2)}`;
}
