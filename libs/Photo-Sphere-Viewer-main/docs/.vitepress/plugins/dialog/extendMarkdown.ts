import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export default function extendMarkdown(md: MarkdownIt) {
    md.use(container, 'dialog', {
        render: (tokens, idx) => {
            const { nesting, info } = tokens[idx];

            if (nesting === 1) {
                const [, button, title] = info.match(/dialog "(.*?)" "(.*?)"/);
                return `<Dialog button="${button}" title="${title}">\n`;
            } else {
                return `</Dialog>\n`;
            }
        },
    });
}
