import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export default function extendMarkdown(md: MarkdownIt) {
    md.use(container, 'module', {
        render: (tokens, idx) => {
            const { nesting } = tokens[idx];
            if (nesting === 1) {
                return `<div class="custom-block tip module">\n`;
            } else {
                return `</div>\n`;
            }
        },
    });
}
