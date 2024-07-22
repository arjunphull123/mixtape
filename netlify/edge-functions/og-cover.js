export default async (request, context) => {
    const url = new URL(request.url)
    
    // Get the page content.
    const response = await context.next()
    const page = await response.text()
    
    // Look for the OG image generator path.
    const search = 'Check out my mixtape'
    // Replace it with the path plus the querystring.
    console.log(url.searchParams.get('id'))
    const replace = `ID: ${url.searchParams.get('id')}`
    
    return new Response(page.replaceAll(search, replace), response);
}