import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export default function extendMarkdown(md: MarkdownIt) {
    md.use(container, 'gallery', {
        render: (tokens, idx) => {
            const { nesting } = tokens[idx];

            if (nesting === 1) {
                return `<Gallery>\n`;
            } else {
                return `</Gallery>\n`;
            }
        },
    });

    md.use(container, 'item', {
        render: (tokens, idx) => {
            const { nesting } = tokens[idx];

            if (nesting === 1) {
                return `<GalleryItem>\n`;
            } else {
                return `</GalleryItem>\n`;
            }
        },
    });
}
