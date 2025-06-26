export default async (request) => {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${process.env.GH_TOKEN}`,
        },
        body: JSON.stringify({
            query: `
            query {
                repository(owner: "mistic100", name: "photo-sphere-viewer") {
                    pinnedDiscussions(first: 2) {
                        nodes {
                            discussion {
                                title
                                createdAt
                                url
                                body
                            }
                        }
                    }
                }
            }`,
        }),
    });

    const result = await response.json();

    const announcements = result.data.repository.pinnedDiscussions.nodes.map(n => n.discussion);

    return Response.json(announcements);
};
