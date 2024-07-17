export default async function onRequest(event) {
    const { request } = event;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
        const apiUrl = `https://${request.headers.get("host")}/.netlify/functions/getTitle?id=${id}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch title: ${response.status}`);
            }
            const data = await response.json();
            const title = data.title;

            let html = await event.response.text();
            html = html.replace(/<meta id="meta-title" property="og:title" content=".*?"/, `<meta id="meta-title" property="og:title" content="${title}"`);
            return new Response(html, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8'
                },
                body: html
            });
        } catch (error) {
            console.error('Error updating meta title:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    } else {
        return new Response('Not Found', { status: 404 });
    }
}
