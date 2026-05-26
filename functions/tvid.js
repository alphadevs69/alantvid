export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  const ua = request.headers.get("user-agent") || "";
  const auth = request.headers.get("authorization") || "";

  const homepage = "https://alantvid.pages.dev/";
  const PASSWORD = "alan123";

  const lowerUA = ua.toLowerCase();

  const isBrowser =
    lowerUA.includes("mozilla") ||
    lowerUA.includes("chrome") ||
    lowerUA.includes("safari") ||
    lowerUA.includes("firefox");

  const isDownloader =
    lowerUA.includes("idm") ||
    lowerUA.includes("adm") ||
    lowerUA.includes("wget") ||
    lowerUA.includes("curl") ||
    lowerUA.includes("python") ||
    lowerUA.includes("aria2");

  if (isBrowser) {
    return Response.redirect(homepage, 302);
  }

  if (isDownloader) {
    return new Response("Forbidden", { status: 403 });
  }

  let password = url.searchParams.get("token") || url.searchParams.get("pass") || "";

  if (!password && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.replace("Basic ", ""));
      const splitIndex = decoded.indexOf(":");
      password = splitIndex >= 0 ? decoded.slice(splitIndex + 1) : "";
    } catch (e) {}
  }

  if (password !== PASSWORD) {
    return new Response("Password required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="AlanTV"',
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  const playlist = `#EXTM3U

#EXTINF:-1 tvg-name="Test Channel" group-title="TV",Test Channel
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
`;

  return new Response(playlist, {
    status: 200,
    headers: {
      "Content-Type": "audio/x-mpegurl; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}