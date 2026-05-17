export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";

  const homepage = "https://alantv.pages.dev/";

  // Kalau ada yang mencoba akses .js, langsung 404
  if (url.pathname.endsWith(".js")) {
    return new Response("Not found", { status: 404 });
  }

  const allowedAgents = [
    "VLC",
    "Kodi",
    "TiviMate",
    "OTT",
    "ExoPlayer",
    "Lavf",
    "IPTV",
    "Dalvik",
    "NSPlayer",
    "MXPlayer"
  ];

  const isAllowed = allowedAgents.some(a =>
    ua.toLowerCase().includes(a.toLowerCase())
  );

  const isBrowser =
    accept.includes("text/html") &&
    !isAllowed;

  if (isBrowser) {
    return Response.redirect(homepage, 302);
  }

  const playlist = `#EXTM3U url-tvg="https://raw.githubusercontent.com/apistech/project/refs/heads/main/ApisTECH.xml,https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/indonesia.xml,https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/epg.xml,https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/unifitv.xml" refresh="3600"

# Developed by alan69@project
# This playlist is intended for development, testing, and personal use only.
# Redistribution or selling of this playlist is strictly prohibited.
# Please respect the original developer.

#EXTINF:-1 tvg-logo="https://www.mncvision.id/userfiles/image/channel/sctv.png" group-title="Indonesia tv 🇮🇩",SCTV
#EXTVLCOPT:http-user-agent=DENSGO/3.00.00 (Linux;Android 15.0.0;) ExoPlayerLib/2.19.1
#EXTVLCOPT:http-referrer=http://dens.tv
http://op-group1-swiftservehd-1.dens.tv/h/h217/02.m3u8

#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/INDOSIAR_Logo.png/1280px-INDOSIAR_Logo.png" group-title="Indonesia tv 🇮🇩",INDOSIAR
#EXTVLCOPT:http-referrer=https://m.visionplus.id
#EXTVLCOPT:http-user-agent=Mozilla/5.0
#KODIPROP:inputstream.adaptive.stream_headers=User-Agent=Mozilla/5.0
#KODIPROP:inputstream.adaptive.manifest_type=dash
#KODIPROP:inputstream.adaptive.license_type=clearkey
#KODIPROP:inputstream.adaptive.license_key=https://ck.dasarweddus.workers.dev/
https://d2tjypxxy769fn.cloudfront.net/out/v1/e930be336fed49e6b26a7554e113f7a4/index.mpd
`;

  return new Response(playlist, {
    headers: {
      "Content-Type": "audio/x-mpegurl; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
