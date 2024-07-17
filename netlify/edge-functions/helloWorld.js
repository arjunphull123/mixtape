export default async (request, context) => {
    const url = new URL(request.url)
    
    // Get the page content.
    const response = await context.next()
    const page = await response.text()

    console.log("Hello, world")
    
    return new Response(page, response);
}

export const config = { path: "/mix/" };