import { GluonElement, css, noChange, type PropertyValues } from "@gluon/gluon";
import { transitionFor, type Background, type BackgroundSet } from "../lib/backgrounds.js";

/**
 * The fullscreen video background.
 *
 * Every unique `Background` of the set gets one `<video>` element (mirrored
 * sections share their object, and so their element). The elements are
 * managed imperatively: the template renders nothing.
 *
 * When `page` changes, the background for going from the previous page to the
 * new one is shown (see `transitionFor`). A transition video plays once and
 * then continues with its `transition` target, which loops. Videos load lazily:
 * their `src` is set when they are first shown or preloaded.
 *
 * With `lowBandwidth`, transition chains are skipped and no video is loaded or
 * played; only the poster images are shown.
 *
 * Videos play with sound unless `muted` is set. Browsers refuse to start audio
 * before the user has interacted with the page; when that happens the video is
 * played muted instead, and sound is turned on at the first click or key press.
 */
export class OverwebsBackground extends GluonElement {
  static override styles = css`
    video {
      position: fixed;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: calc(16 / 9 * 100vh);
      height: auto;
      transform: translate(-50%, -50%);
    }

    .hidden {
      display: none;
    }
  `;

  static override properties = {
    backgrounds: { type: Object },
    page: {},
    lowBandwidth: { type: Boolean },
    muted: { type: Boolean, attribute: true, reflect: true },
  };

  backgrounds: BackgroundSet | undefined = undefined;
  page = "";
  lowBandwidth = false;
  /** Silences the videos. */
  muted = false;

  /** The video element of every unique background of the current set. */
  #videos = new Map<Background, HTMLVideoElement>();
  /** Backgrounds whose video `src` has been assigned. */
  #loading = new Set<Background>();
  /** The background that is showing. */
  #current: Background | undefined;
  /** Aborts the `ended` continuation of the current transition video. */
  #continuation: AbortController | undefined;
  /** Pages that were reported to have no background. */
  #warned = new Set<string>();
  /** Whether the browser refused to play with sound, until the user interacts with the page. */
  #audioBlocked = false;
  /** Aborts the listeners that wait for the user interaction that unblocks audio. */
  #unblock: AbortController | undefined;

  override render() {
    // The video elements are managed in `updated()`; rendering anything would remove them.
    return noChange;
  }

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has("backgrounds")) {
      this.#createVideos();
      // A new set starts fresh, as if there was no previous page.
      this.#showPage("", this.page);
    } else if (changed.has("page")) {
      this.#showPage((changed.get("page") as string | undefined) ?? "", this.page);
    }
    if (changed.has("muted")) {
      this.#applyMuted();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#unblock?.abort();
    this.#unblock = undefined;
  }

  /** Whether the videos are silent because the browser has not allowed audio yet. */
  get audioBlocked(): boolean {
    return this.#audioBlocked;
  }

  /** The video element that shows `background`, for tests and debugging. */
  videoFor(background: Background): HTMLVideoElement | undefined {
    return this.#videos.get(background);
  }

  #createVideos() {
    this.#stopCurrent();
    for (const video of this.#videos.values()) {
      video.remove();
    }
    this.#videos.clear();
    this.#loading.clear();

    for (const background of new Set(Object.values(this.backgrounds ?? {}))) {
      const video = document.createElement("video");
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.muted = this.muted || this.#audioBlocked;
      video.preload = "none";
      video.loop = !background.transition;
      video.classList.add("hidden");
      this.renderRoot.append(video);
      this.#videos.set(background, video);
    }
  }

  #showPage(from: string, to: string) {
    const backgrounds = this.backgrounds;
    if (!backgrounds || !to) {
      return;
    }
    const name = transitionFor(backgrounds, from, to);
    const background = name === undefined ? undefined : backgrounds[name];
    if (background) {
      this.#show(background);
    } else {
      if (!this.#warned.has(to)) {
        this.#warned.add(to);
        console.warn(`Page "${to}" has no background`);
      }
      this.#stopCurrent();
    }
  }

  /** Shows `background`, preloads what may follow it, and chains its transition. */
  #show(background: Background) {
    if (this.lowBandwidth) {
      background = this.#chainEnd(background);
    }
    const video = this.#videos.get(background);
    if (!video) {
      return;
    }

    video.poster = background.image;
    video.classList.remove("hidden");
    if (this.#current !== background) {
      this.#stopCurrent();
    } else {
      this.#continuation?.abort();
    }
    this.#current = background;

    if (!this.lowBandwidth && background.video !== undefined) {
      if (!this.#loading.has(background)) {
        this.#load(background, video);
        video.load?.();
      }
      this.#play(video);
    }

    for (const name of [
      ...(background.transition ? [background.transition] : []),
      ...(background.preload ?? []),
    ]) {
      this.#preload(name);
    }

    const next = background.transition && this.backgrounds?.[background.transition];
    if (next) {
      this.#continuation = new AbortController();
      video.addEventListener("ended", () => this.#show(next), {
        once: true,
        signal: this.#continuation.signal,
      });
    }
  }

  /**
   * Plays `video`, with sound unless `muted` or audio is blocked.
   *
   * When the browser refuses to start audio (no user interaction yet), the video
   * is played muted instead and sound is restored at the first interaction.
   */
  #play(video: HTMLVideoElement) {
    video.muted = this.muted || this.#audioBlocked;
    video.play?.()?.catch((error: unknown) => {
      if (video.muted || !(error instanceof DOMException) || error.name !== "NotAllowedError") {
        // Playback was refused altogether, or interrupted; the poster stays visible.
        return;
      }
      this.#audioBlocked = true;
      video.muted = true;
      video.play?.()?.catch(() => {
        // Even muted autoplay was refused; the poster stays visible.
      });
      this.#unblockAudioOnInteraction();
    });
  }

  /** Turns sound back on at the first click or key press on the page. */
  #unblockAudioOnInteraction() {
    if (this.#unblock) {
      return;
    }
    this.#unblock = new AbortController();
    const unblock = () => {
      this.#unblock?.abort();
      this.#unblock = undefined;
      this.#audioBlocked = false;
      this.#applyMuted();
    };
    for (const type of ["pointerdown", "keydown"] as const) {
      document.addEventListener(type, unblock, { signal: this.#unblock.signal, once: true });
    }
    this.disconnectSignal.addEventListener("abort", () => this.#unblock?.abort(), { once: true });
  }

  /** Applies `muted` (and the audio block) to the video that is showing. */
  #applyMuted() {
    const video = this.#current && this.#videos.get(this.#current);
    if (video) {
      video.muted = this.muted || this.#audioBlocked;
    }
  }

  /** Starts loading the background of section `name` (only its poster on low bandwidth). */
  #preload(name: string) {
    let background = this.backgrounds?.[name];
    if (!background) {
      return;
    }
    if (this.lowBandwidth) {
      background = this.#chainEnd(background);
    }
    const video = this.#videos.get(background);
    if (!video) {
      return;
    }
    if (!this.lowBandwidth && !this.#loading.has(background)) {
      this.#load(background, video);
    }
    video.poster = background.image;
  }

  #load(background: Background, video: HTMLVideoElement) {
    if (background.video === undefined) {
      return;
    }
    this.#loading.add(background);
    video.src = background.video;
    video.preload = "auto";
  }

  /** Follows the transitions of `background` to the background that loops. */
  #chainEnd(background: Background): Background {
    const seen = new Set<Background>();
    let next: Background | undefined = background;
    while (next?.transition && !seen.has(next)) {
      seen.add(next);
      background = next;
      next = this.backgrounds?.[next.transition];
    }
    return next ?? background;
  }

  /** Hides and rewinds the current video, and cancels its pending transition. */
  #stopCurrent() {
    this.#continuation?.abort();
    this.#continuation = undefined;
    const video = this.#current && this.#videos.get(this.#current);
    this.#current = undefined;
    if (!video) {
      return;
    }
    video.classList.add("hidden");
    if (!video.paused) {
      video.pause?.();
    }
    try {
      video.currentTime = 0;
    } catch {
      // Not seekable yet.
    }
  }
}
