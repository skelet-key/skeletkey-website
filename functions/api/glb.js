const ALLOW = "https://3dai-service-fs.fsn1.your-objectstorage.com/";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range",
    "Access-Control-Expose-Headers": "Content-Length, Content-Type, Content-Range, Accept-Ranges",
  };
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  const u = new URL(request.url).searchParams.get("u") || "";
  if (!u.startsWith(ALLOW) || !u.toLowerCase().includes(".glb")) {
    return new Response("blocked", { status: 400 });
  }
  const init = { method: request.method === "HEAD" ? "HEAD" : "GET" };
  const range = request.headers.get("Range");
  if (range) init.headers = { Range: range };
  const upstream = await fetch(u, init);
  const headers = new Headers(upstream.headers);
  Object.entries(corsHeaders()).forEach(([k, v]) => headers.set(k, v));
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("Content-Type", "model/gltf-binary");
  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}
