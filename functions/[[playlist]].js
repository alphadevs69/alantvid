const HOMEPAGE = "https://alantvid.pages.dev/";

const allowedPlaylists = ["tvid", "jpn", "kor"];

export async function onRequest(context) {
  const request = context.request;

  let name = context.params.playlist || "";
  name = Array.isArray(name) ? name.join("/") : name;
  name = name.replace(/^\/+|\/+$/g, "").toLowerCase();

  if (!name || name === "index.html" || name.includes(".")) {
    return await context.next();
  }

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const secFetchDest = request.headers.get("sec-fetch-dest") || "";
  const secFetchMode = request.headers.get("sec-fetch-mode") || "";

  const lowerUA = ua.toLowerCase();

  const isDownloader =
    lowerUA.includes("idm") ||
    lowerUA.includes("adm") ||
    lowerUA.includes("wget") ||
    lowerUA.includes("curl") ||
    lowerUA.includes("python") ||
    lowerUA.includes("aria2");

  const isRealBrowser =
    secFetchDest === "document" ||
    secFetchMode === "navigate";

  if (!allowedPlaylists.includes(name)) {
    return new Response("Playlist not found", { status: 404 });
  }

  if (isDownloader) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isRealBrowser) {
    return Response.redirect(HOMEPAGE, 302);
  }

  const playlistUrl = new URL(`/pl/${name}.m3u`, request.url);
  const res = await fetch(playlistUrl.toString());

  if (!res.ok) {
    return new Response("Playlist source error", { status: 502 });
  }

  const playlist = await res.text();

  return new Response(playlist, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    }
  });
}
