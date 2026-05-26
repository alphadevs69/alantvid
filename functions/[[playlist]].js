import playlists from "../data/index.js";

export async function onRequest(context) {
  let path = context.params.playlist || "";

  path = Array.isArray(path)
    ? path.join("/")
    : path;

  path = path
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

  // homepage & static file normal
  if (
    !path ||
    path === "index.html" ||
    path.includes(".")
  ) {
    return await context.next();
  }

  // playlist tidak ada
  if (!playlists[path]) {
    return Response.redirect(
      "https://alantvid.pages.dev/",
      302
    );
  }

  // langsung kirim playlist
  return new Response(playlists[path], {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.apple.mpegurl; charset=utf-8",

      "Access-Control-Allow-Origin":
        "*",

      "Cache-Control":
        "no-cache"
    }
  });
}
