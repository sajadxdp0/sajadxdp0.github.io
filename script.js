// Progressive enhancement only. Dark only — no theme toggle, no stored theme.
// Modern ES module, no transpile needed by any current browser.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Footer year: always the current year, zero-maintained. */
const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());

/* Mark where the reader is. Exact match wins. */
const canonicalPath = (href) => {
  const p = new URL(href, location.href).pathname
    .replace(/index\.html?$/, "")
    .replace(/\.html$/, "/");
  return p.endsWith("/") ? p : `${p}/`;
};

const markNav = () => {
  const links = $$('nav[aria-label="Primary"] a[href]');
  if (!links.length) return;
  const here = canonicalPath(location.href);
  for (const a of links) {
    const to = canonicalPath(a.getAttribute("href"));
    if (to === here) a.setAttribute("aria-current", "page");
    else if (to !== "/" && here.startsWith(to)) a.dataset.section = "";
  }
};

/* Copy button next to any link that displays a bare email address. */
const wireCopyButtons = () => {
  const mailLinks = $$('a[href^="mailto:"]').filter(
    (a) => a.textContent.includes("@") && !a.closest(".copy-btn")
  );
  if (!mailLinks.length) return;

  const supportsClipboard =
    navigator.clipboard && window.isSecureContext;

  const status = document.createElement("span");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.className = "visually-hidden";
  document.body.append(status);

  const copyWithFallback = async (address) => {
    if (supportsClipboard) {
      try {
        await navigator.clipboard.writeText(address);
        return true;
      } catch {
        /* fall through to the legacy path */
      }
    }
    const ta = document.createElement("textarea");
    ta.value = address;
    ta.setAttribute("readonly", "");
    ta.className = "visually-hidden";
    document.body.append(ta);
    ta.select();
    let done = false;
    try {
      done = document.execCommand("copy");
    } catch {
      done = false;
    }
    ta.remove();
    return done;
  };

  for (const link of mailLinks) {
    const address = link.getAttribute("href")
      .replace(/^mailto:/, "")
      .split("?")[0]
      .trim();
    if (!address) continue;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy email address");
    link.insertAdjacentElement("afterend", btn);

    let reset;
    btn.addEventListener("click", async () => {
      const ok = await copyWithFallback(address);
      if (!ok) {
        window.prompt("Copy email address", address);
        return;
      }
      btn.textContent = "Copied";
      btn.classList.add("is-done");
      status.textContent = "Email address copied";
      clearTimeout(reset);
      reset = setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("is-done");
        status.textContent = "";
      }, 1600);
    });
  }
};

markNav();
wireCopyButtons();
