const HOMEPAGE = "https://alantvid.pages.dev/";

const allowedPlaylists = [
  "tvid",
  "jpn",
  "kor"
];

export async function onRequest(context) {
  const request = context.request;

  let name = context.params.playlist || "";
  name = Array.isArray(name) ? name.join("/") : name;
  name = name.replace(/^\/+|\/+$/g, "").toLowerCase();

  // Biarkan homepage dan file static jalan normal
  if (
    !name ||
    name === "index.html" ||
    name.includes(".") ||
    name.startsWith("assets/") ||
    name.startsWith("images/")
  ) {
    return await context.next();
  }

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const secFetchDest = request.headers.get("sec-fetch-dest") || "";
  const lowerUA = ua.toLowerCase();

  const isDownloader =
    lowerUA.includes("idm") ||
    lowerUA.includes("internet download manager") ||
    lowerUA.includes("adm") ||
    lowerUA.includes("advanced download manager") ||
    lowerUA.includes("wget") ||
    lowerUA.includes("curl") ||
    lowerUA.includes("python") ||
    lowerUA.includes("aria2") ||
    lowerUA.includes("httpie");

  const isPlayer =
    lowerUA.includes("ott") ||
    lowerUA.includes("navigator") ||
    lowerUA.includes("iptv") ||
    lowerUA.includes("tivimate") ||
    lowerUA.includes("vlc") ||
    lowerUA.includes("kodi") ||
    lowerUA.includes("exoplayer") ||
    lowerUA.includes("exo") ||
    lowerUA.includes("dalvik") ||
    lowerUA.includes("lavf") ||
    lowerUA.includes("mxplayer") ||
    lowerUA.includes("nsplayer") ||
    lowerUA.includes("okhttp");

  const isBrowser =
    lowerUA.includes("mozilla") ||
    lowerUA.includes("chrome") ||
    lowerUA.includes("safari") ||
    lowerUA.includes("firefox") ||
    accept.includes("text/html") ||
    secFetchDest === "document";

  if (!allowedPlaylists.includes(name)) {
    return new Response("Playlist not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (isDownloader) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isBrowser && !isPlayer) {
    return Response.redirect(HOMEPAGE, 302);
  }

  const playlistUrl = new URL(`/pl/${name}.m3u`, request.url);
  const playlistResponse = await fetch(playlistUrl.toString());

  if (!playlistResponse.ok) {
    return new Response("Playlist source error", { status: 502 });
  }

  const playlist = await playlistResponse.text();

  return new Response(playlist, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
