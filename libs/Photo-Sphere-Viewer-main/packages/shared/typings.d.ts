declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.scss' {
    const content: any;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}

declare module '*.glsl' {
    const content: string;
    export default content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PKG_VERSION: string;
