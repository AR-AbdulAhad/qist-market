export async function GET(request) {
  const { pathname } = new URL(request.url);

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sitemap.xml`;

  const res = await fetch(backendUrl, { next: { revalidate: 3600 } });
  const xml = await res.text();

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}