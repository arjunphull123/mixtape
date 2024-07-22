export default async (request, context) => {
    const url = new URL(request.url)
    
    // Get the page content.
    const response = await context.next()
    const page = await response.text()
    
    // Look for the OG image generator path.
    const search = ".netlify/functions/generator"
    // Replace it with the path plus the querystring.
    const replace = `.netlify/functions/generator?id=${url.searchParams.get('id')}`
    
    return new Response(page.replaceAll(search, replace), response);
}