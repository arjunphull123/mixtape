import { get } from 'https';

export function onRequest(event) {
    const { request } = event;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
        const apiUrl = `https://${request.headers.get("host")}/.netlify/functions/getTitle?id=${id}`;
        get(apiUrl, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                const { title } = JSON.parse(data);
                let html = event.response.body.toString();
                html = html.replace(/<meta id="meta-title" property="og:title" content=".*?"/, `<meta id="meta-title" property="og:title" content="${title}"`);
                event.respondWith(new Response(html, event.response));
            });
        }).on('error', err => {
            console.error(err);
        });
    }
}
