import playlists from "../data/index.js";

const HOMEPAGE = "https://alantvid.pages.dev/";

const browserAllowedPaths = [
  "",
  "index.html",
  "style.css",
  "script.js",
  "nyawits.png",
  "app.apk",
  "favicon.ico"
];

export async function onRequest(context) {
  const request = context.request;

  let path = context.params.playlist || "";
  path = Array.isArray(path) ? path.join("/") : path;
  path = path.replace(/^\/+|\/+$/g, "").toLowerCase();

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const secFetchDest = request.headers.get("sec-fetch-dest") || "";
  const secFetchMode = request.headers.get("sec-fetch-mode") || "";
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

  const isBrowser =
    secFetchDest === "document" ||
    secFetchMode === "navigate" ||
    accept.includes("text/html");

  if (isDownloader) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (browserAllowedPaths.includes(path)) {
    return await context.next();
  }

  if (isBrowser) {
    return Response.redirect(HOMEPAGE, 302);
  }

  if (!/^[a-z0-9_-]+$/.test(path)) {
    return Response.redirect(HOMEPAGE, 302);
  }

  const playlist = playlists[path];

  if (!playlist || typeof playlist !== "string") {
    return Response.redirect(HOMEPAGE, 302);
  }

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
