const wallpapers = {
  clawd: "claude-code.svg",
  clouds: "cloud-drift.svg",
  honu: "honu-lagoon.svg",
  koiPond: "koi-pond.svg",
  jellyfish: "jellyfish.svg",
  paperBoats: "paper-boats.svg",
  fireflies: "fireflies.svg",
  moonlit: "moonlit.svg",
} as const;

type Wallpaper = keyof typeof wallpapers | "off";

const storageKey = "sajad-wallpaper";
const control = document.querySelector<HTMLLabelElement>("#wallpaper-control");
const select = document.querySelector<HTMLSelectElement>("#wallpaper-select");
const image = document.querySelector<HTMLImageElement>("#wallpaper-image");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function isWallpaper(value: string | null): value is Wallpaper {
  return value === "off" || (value !== null && Object.hasOwn(wallpapers, value));
}

function savedWallpaper(): Wallpaper | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return isWallpaper(value) ? value : null;
  } catch {
    return null;
  }
}

function renderWallpaper(value: Wallpaper) {
  document.body.dataset.wallpaper = value;

  if (select) select.value = value;
  if (!image) return;

  image.hidden = value === "off";
  if (value !== "off") image.src = `/wallpapers/${wallpapers[value]}`;
}

function applyMotionPreference() {
  if (!select) return;

  if (reducedMotion.matches) {
    select.disabled = true;
    select.title = "Animated wallpapers are off because reduced motion is enabled.";
    renderWallpaper("off");
    return;
  }

  select.disabled = false;
  select.title = "";
  renderWallpaper(savedWallpaper() ?? "moonlit");
}

if (control && select && image) {
  control.hidden = false;
  select.addEventListener("change", () => {
    if (!isWallpaper(select.value)) return;

    renderWallpaper(select.value);
    try {
      window.localStorage.setItem(storageKey, select.value);
    } catch {
      // The picker still works when storage is unavailable.
    }
  });

  applyMotionPreference();
  reducedMotion.addEventListener("change", applyMotionPreference);
}
