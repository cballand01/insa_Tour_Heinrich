import { Service, SERVICES } from './constants';

const ORG = '@photo-sphere-viewer/';
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/';
const VERSION = '5';

type Package = {
    name: string;
    version: string;
    style?: boolean;
    external?: boolean;
    js?: string;
    css?: string;
};

type Params = {
    title: string;
    html: string;
    js: string;
    css: string;
    packages: Package[];
};

function buildCdnPath({ name, version, file }: { name: string; version: string; file: string }) {
    return CDN_BASE + name + '@' + version + '/' + file;
}

export function getFullPackages(version: string, packages: Package[]) {
    let core = packages.find(({ name }) => name === 'core');
    if (!core) {
        core = {
            name: 'core',
        } as Package;
        packages.unshift(core);
    }
    core.style = true;

    return packages
        .map(pkg => ({
            ...pkg,
            name: pkg.external ? pkg.name : ORG + pkg.name,
            version: pkg.external ? (pkg.version || 'latest') : (version || VERSION),
            js: pkg.external ? pkg.js : 'index.module.js',
            css: pkg.external ? pkg.css : 'index.css',
        }));
}

function getFullCss(css: string, packages: Package[], cdnImport: boolean) {
    return `
${packages
    .filter(({ style }) => style)
    .map(({ name, version, css }) => {
        return `@import '${cdnImport ? buildCdnPath({ name, version, file: css! }) : `${name}/${css}`}';`;
    })
    .join('\n')}

html, body, #viewer {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: sans-serif;
}

${css}
`.trim();
}

function getFullHtml(html: string, packages: Package[], importMap: boolean) {
    let fullHtml = `
<div id="viewer"></div>

${html}
`.trim();

    if (importMap) {
        fullHtml += `\n
<script type="importmap">
    {
        "imports": {
            "three": "${CDN_BASE}three/build/three.module.js",
            ${packages
                .map(({ name, version, js }) => {
                    return `"${name}": "${buildCdnPath({ name, version, file: js! })}"`;
                })
                .join(',\n            ')}
        }
    }
</script>
`;
    }

    return fullHtml;
}

export function getIframeContent({ title, html, js, css, packages }: Params) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${title}</title>

  <style>
    #loader {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: radial-gradient(#fff 0%, #fdfdfd 16%, #fbfbfb 33%, #f8f8f8 49%, #efefef 66%, #dfdfdf 82%, #bfbfbf 100%);
        color: #555;
        font-family: sans-serif;
        font-size: 2rem;
        font-weight: 600;
        text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        z-index: 9999;
    }
  </style>

  <style>
    ${getFullCss(css, packages, true)}
  </style>
</head>

<body>
  <div id="loader">Loading...</div>
  ${getFullHtml(html, packages, true)}

  <script type="module">
  ${js}
  document.querySelector('#loader').remove();
  </script>
</body>
</html>`;
}

function getJsFiddleValue({ title, js, css, html, packages }: Params) {
    return {
        title: title,
        html: getFullHtml(html, packages, true),
        js: js,
        css: getFullCss(css, packages, true),
    };
}

function getCodePenValue({ title, js, css, html, packages }: Params) {
    return {
        data: JSON.stringify({
            title: title,
            head: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            html: getFullHtml(html, packages, true),
            js: js,
            css: getFullCss(css, packages, true),
        }),
    };
}

function getStackBlitzValue({ title, js, css, html, packages }: Params) {
    return {
        'project[template]': 'typescript',
        'project[title]': title,
        'project[dependencies]': JSON.stringify(packages.reduce((deps, { name, version }) => {
            deps[name] = `${version}`;
            return deps;
        }, {})),
        'project[files][index.ts]': `import './styles.css';
${js}`,
        'project[files][styles.css]': getFullCss(css, packages, false),
        'project[files][index.html]': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${title}</title>
</head>

<body>
    ${getFullHtml(html, packages, false)}
</body>
</html>`,
    };
}

export function openService(service: Service, params: Params) {
    const form = document.createElement('form');
    form.target = '_blank';
    form.method = 'post';
    form.action = SERVICES[service].url;

    let data: Record<string, string>;
    switch (service) {
        case 'codepen':
            data = getCodePenValue(params);
            break;

        case 'jsfiddle':
            data = getJsFiddleValue(params);
            break;

        case 'stackblitz':
            data = getStackBlitzValue(params);
            break;
    }

    Object.entries(data).forEach(([name, value]) => {
        const input = document.createElement('textarea');
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();
}
