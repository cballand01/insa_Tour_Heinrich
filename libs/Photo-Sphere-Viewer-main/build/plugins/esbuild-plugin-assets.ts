import type { Plugin } from 'esbuild';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import prettyBytes from 'pretty-bytes';

/**
 * Generates static files in output directory
 */
export function assetsPlugin(files: Record<string, string | Promise<string>>): Plugin {
    return {
        name: 'assets',
        setup(build) {
            if (build.initialOptions.format !== 'esm') {
                return;
            }

            build.onEnd(() => {
                const outdir = build.initialOptions.outdir;

                return mkdir(path.resolve(outdir), { recursive: true })
                    .then(() =>
                        Promise.all(
                            Object.entries(files).map(([filename, contentOrPromise]) => {
                                const outpath = outdir + '/' + filename;
                                return Promise.resolve(contentOrPromise).then((content) => {
                                    console.log('ASSET', outpath, prettyBytes(content.length));
                                    return writeFile(outpath, content);
                                });
                            }),
                        ),
                    )
                    .then(() => undefined);
            });
        },
    };
}
