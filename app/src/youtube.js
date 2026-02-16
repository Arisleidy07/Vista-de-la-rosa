export function getYouTubeId(input) {
  if (!input) return "";
  const raw = String(input).trim();

  // Already an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);

    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace("/", "").split("/")[0];
      return id || "";
    }

    // youtube.com/watch?v=<id>
    const v = url.searchParams.get("v");
    if (v) return v;

    // youtube.com/embed/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];

    return "";
  } catch {
    return "";
  }
}

export function getYouTubeEmbedUrl(input, options = {}) {
  const id = getYouTubeId(input);
  if (!id) return "";

  const {
    autoplay = false,
    muted = true,
    loop = false,
    controls = false,
    playsInline = true,
    fs = false,
    disablekb = true,
  } = options;

  const params = new URLSearchParams();
  params.set("modestbranding", "1");
  params.set("rel", "0");
  params.set("iv_load_policy", "3");
  params.set("disablekb", disablekb ? "1" : "0");
  params.set("fs", fs ? "1" : "0");
  params.set("playsinline", playsInline ? "1" : "0");
  params.set("controls", controls ? "1" : "0");

  if (autoplay) params.set("autoplay", "1");
  if (muted) params.set("mute", "1");

  if (loop) {
    params.set("loop", "1");
    // Required by YouTube to loop a single video
    params.set("playlist", id);
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
