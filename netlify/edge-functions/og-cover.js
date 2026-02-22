export default async (request, context) => {
  const url = new URL(request.url);
  const mixId = url.searchParams.get("id");

  // Get the page content.
  const response = await context.next();
  const page = await response.text();

  // If there's no id, or we already have a rewritten generator URL, leave HTML unchanged.
  if (!mixId || page.includes(".netlify/functions/generator?id=")) {
    return new Response(page, response);
  }

  // Replace only the base generator path once.
  const search = ".netlify/functions/generator";
  const replace = `.netlify/functions/generator?id=${encodeURIComponent(mixId)}`;

  return new Response(page.replace(search, replace), response);
};
