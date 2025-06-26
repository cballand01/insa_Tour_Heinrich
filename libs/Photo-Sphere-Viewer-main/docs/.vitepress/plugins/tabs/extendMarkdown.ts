import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export default function extendMarkdown(md: MarkdownIt) {
    md.use(container, 'tabs', {
        render: (tokens, idx) => {
            const { nesting } = tokens[idx];

            if (nesting === 1) {
                return `<Tabs>\n`;
            } else {
                return `</Tabs>\n`;
            }
        },
    });

    md.use(container, 'tab', {
        render: (tokens, idx) => {
            const { nesting, info } = tokens[idx];
            const title = info.trim().slice('tab '.length);

            if (nesting === 1) {
                return `<Tab title="${title}">\n`;
            } else {
                return `</Tab>\n`;
            }
        },
    });
}
