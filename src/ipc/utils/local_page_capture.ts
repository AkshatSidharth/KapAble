import { BrowserWindow, session } from "electron";
import log from "electron-log";
import crypto from "node:crypto";

import { KapableError, KapableErrorKind } from "@/errors/kapable_error";

const logger = log.scope("local_page_capture");

/**
 * Captures a public web page with the browser KapAble is already built on.
 *
 * Upstream routes "clone this site" through a hosted crawl service. This fork
 * runs no such service, which left the whole capability dead rather than
 * degraded — so the page is loaded in an offscreen Electron window instead and
 * the screenshot comes off its own compositor. No account, no API key, and
 * nothing about the page leaves the machine.
 */
export interface LocalPageCapture {
  rootUrl: string;
  html: string;
  markdown: string;
  /** PNG data URL of the rendered page. */
  screenshot: string;
}

const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;
/**
 * Ceiling on the captured height.
 *
 * Tall pages are cropped rather than dropped: the model checks the image
 * against MAX_IMAGE_DIMENSION (8000px) and omits anything larger, so an
 * uncropped 12000px marketing page would arrive as no screenshot at all. The
 * top 6000px is what a design gets judged on anyway.
 */
const MAX_CAPTURE_HEIGHT = 6000;
const LOAD_TIMEOUT_MS = 30_000;
/** Time after load for fonts, images and entrance animations to settle. */
const SETTLE_MS = 1_200;
const MAX_HTML_CHARS = 400_000;

/**
 * Accepts what a person would type — "example.com" as readily as a full URL —
 * and refuses anything that is not a public web page.
 *
 * The scheme check is load-bearing: file:// would let a prompt read local
 * files through the screenshot, and custom schemes reach app-internal handlers.
 */
export function normalizeCaptureUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new KapableError("No URL was provided.", KapableErrorKind.Validation);
  }

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new KapableError(
      `"${rawUrl}" is not a valid URL.`,
      KapableErrorKind.Validation,
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new KapableError(
      `Only http and https pages can be captured (got "${parsed.protocol}").`,
      KapableErrorKind.Validation,
    );
  }

  return parsed.toString();
}

/**
 * Runs in the captured page. Produces a structural digest for the model to
 * read alongside the screenshot — the screenshot carries the design, this
 * carries the words, so exact copy does not have to be read off pixels.
 */
const EXTRACT_SCRIPT = `(() => {
  const clamp = (s, n) => (s && s.length > n ? s.slice(0, n) + "…" : s || "");
  const lines = [];
  const title = document.title?.trim();
  if (title) lines.push("# " + title);
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");
  if (description) lines.push("", clamp(description.trim(), 400));

  const seen = new Set();
  const nodes = document.body
    ? document.body.querySelectorAll("h1,h2,h3,h4,p,li,a,button,img")
    : [];
  for (const el of nodes) {
    // Skip anything the page is not actually showing; hidden nav and modal
    // copy would otherwise read as page content.
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const tag = el.tagName.toLowerCase();
    if (tag === "img") {
      const alt = (el.getAttribute("alt") || "").trim();
      if (alt) lines.push("![" + clamp(alt, 120) + "](image)");
      continue;
    }
    const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
    if (!text) continue;
    const key = tag + "|" + text;
    if (seen.has(key)) continue;
    seen.add(key);

    if (tag[0] === "h") lines.push("", "#".repeat(Number(tag[1]) || 2) + " " + clamp(text, 300));
    else if (tag === "li") lines.push("- " + clamp(text, 300));
    else if (tag === "a") lines.push("[" + clamp(text, 160) + "]");
    else if (tag === "button") lines.push("[button: " + clamp(text, 120) + "]");
    else lines.push(clamp(text, 600));
    if (lines.length > 1200) break;
  }
  return {
    markdown: lines.join("\\n"),
    html: document.documentElement.outerHTML,
    scrollHeight: Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.scrollHeight : 0,
    ),
  };
})()`;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function capturePageLocally(
  rawUrl: string,
  options: { signal?: AbortSignal } = {},
): Promise<LocalPageCapture> {
  const url = normalizeCaptureUrl(rawUrl);

  // A throwaway partition: the page gets no access to cookies or storage
  // belonging to KapAble or to any app being previewed. The name deliberately
  // has no "persist:" prefix, which is what makes Electron back it with an
  // in-memory session — so it needs no clearing afterwards and leaves nothing
  // on disk even if this process is killed mid-capture.
  const partition = `local-page-capture-${crypto.randomUUID()}`;
  const captureSession = session.fromPartition(partition, { cache: false });

  const win = new BrowserWindow({
    show: false,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    webPreferences: {
      session: captureSession,
      // This loads a page nobody here controls, so it gets no Node, no
      // preload, its own isolated world, and the OS sandbox.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      // Nothing is going to hear the page, and audio from an autoplaying
      // video during a capture is startling.
      backgroundThrottling: false,
    },
  });
  win.webContents.setAudioMuted(true);
  // A popup or a window.open() during capture would outlive this function.
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  const abort = () => win.destroy();
  options.signal?.addEventListener("abort", abort, { once: true });

  try {
    await Promise.race([
      win.loadURL(url),
      wait(LOAD_TIMEOUT_MS).then(() => {
        throw new KapableError(
          `Timed out after ${LOAD_TIMEOUT_MS / 1000}s loading ${url}.`,
          KapableErrorKind.External,
        );
      }),
    ]);

    await wait(SETTLE_MS);
    if (win.isDestroyed()) {
      throw new KapableError(
        "Capture was cancelled.",
        KapableErrorKind.UserCancelled,
      );
    }

    const extracted = (await win.webContents.executeJavaScript(
      EXTRACT_SCRIPT,
      true,
    )) as { markdown: string; html: string; scrollHeight: number };

    // Grow the window to the page's own height so the capture is the whole
    // design rather than the fold, then let layout settle at the new size.
    const fullHeight = Math.min(
      Math.max(extracted.scrollHeight || VIEWPORT_HEIGHT, VIEWPORT_HEIGHT),
      MAX_CAPTURE_HEIGHT,
    );
    if (fullHeight > VIEWPORT_HEIGHT) {
      win.setSize(VIEWPORT_WIDTH, fullHeight);
      await wait(400);
    }

    if (win.isDestroyed()) {
      throw new KapableError(
        "Capture was cancelled.",
        KapableErrorKind.UserCancelled,
      );
    }
    const image = await win.webContents.capturePage(undefined, {
      stayHidden: true,
    });
    if (image.isEmpty()) {
      throw new KapableError(
        `Captured an empty screenshot of ${url}.`,
        KapableErrorKind.External,
      );
    }

    logger.info(
      `Captured ${url} at ${VIEWPORT_WIDTH}x${fullHeight} (page height ${extracted.scrollHeight})`,
    );

    return {
      rootUrl: url,
      html: extracted.html.slice(0, MAX_HTML_CHARS),
      markdown: extracted.markdown,
      screenshot: `data:image/png;base64,${image.toPNG().toString("base64")}`,
    };
  } finally {
    options.signal?.removeEventListener("abort", abort);
    // Nothing to clear: the session is in-memory and dies with the window.
    // An earlier version awaited clearStorageData() here, which never settles
    // once the window owning the session is gone and hung the whole tool.
    if (!win.isDestroyed()) win.destroy();
  }
}
