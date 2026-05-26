export async function onRequest(context) {
  const request = context.request;
  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const auth = request.headers.get("authorization") || "";

  const homepage = "https://alantvid.pages.dev/";
  const PASSWORD = "alan123"; // ganti password di sini

  const lowerUA = ua.toLowerCase();

  const downloaderAgents = [
    "idm",
    "internet download manager",
    "adm",
    "advanced download manager",
    "wget",
    "curl",
    "python",
    "aria2",
    "okhttp"
  ];

  const playerAgents = [
    "ott",
    "ott navigator",
    "vlc",
    "kodi",
    "tivimate",
    "iptv",
    "exoplayer",
    "dalvik",
    "lavf",
    "mxplayer",
    "nsplayer"
  ];

  const isDownloader = downloaderAgents.some(a => lowerUA.includes(a));
  const isPlayer = playerAgents.some(a => lowerUA.includes(a));

  const isBrowser =
    accept.includes("text/html") &&
    !isPlayer;

  if (isBrowser) {
    return Response.redirect(homepage, 302);
  }

  if (isDownloader) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!auth.startsWith("Basic ")) {
    return askPassword();
  }

  let decoded = "";

  try {
    decoded = atob(auth.replace("Basic ", ""));
  } catch (e) {
    return askPassword();
  }

  const splitIndex = decoded.indexOf(":");
  const password = splitIndex >= 0 ? decoded.slice(splitIndex + 1) : "";

  if (password !== PASSWORD) {
    return new Response("Wrong password", { status: 403 });
  }

  const playlist = `#EXTM3U

#EXTINF:-1 tvg-name="Test Channel" group-title="TV",Test Channel
https://example.com/live/test.m3u8
`;

  return new Response(playlist, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function askPassword() {
  return new Response("Password required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AlanTV"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}