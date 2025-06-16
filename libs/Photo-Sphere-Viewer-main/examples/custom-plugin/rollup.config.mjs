import generatePackageJson from 'rollup-plugin-generate-package-json';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';
import ts from 'rollup-plugin-ts';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.module.js',
            format: 'es',
            sourcemap: true,
        },
    ],
    external: [
        'three',
        '@photo-sphere-viewer/core',
    ],
    plugins: [
        ts(),
        postcss({
            extract: 'index.css',
            sourceMap: true,
            use: ['sass'],
        }),
        string({
            include: ['**/*.svg'],
        }),
        generatePackageJson({
            baseContents: (pkg) => {
                pkg = {
                    ...pkg,
                    main: 'index.cjs',
                    module: 'index.module.js',
                    types: 'index.d.ts',
                    style: 'index.css',
                };
                delete pkg.scripts;
                delete pkg.devDependencies;
                return pkg;
            },
            // this is only necessary for this demo, to override the "file" dependency
            additionalDependencies: {
                '@photo-sphere-viewer/core': '^5.0.0',
            },
        }),
    ],
};
