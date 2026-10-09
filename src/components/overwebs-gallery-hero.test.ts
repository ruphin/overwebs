import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { OverwebsGalleryHero } from "./overwebs-gallery-hero.js";
import { heroById, type Hero } from "../lib/heroes.js";

const tracer = heroById.get("tracer") as Hero;
const ana = heroById.get("ana") as Hero;

const create = async (hero: Hero | undefined, unlocks = 0) => {
  const element = new OverwebsGalleryHero();
  element.hero = hero;
  element.unlocks = unlocks;
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const query = (element: OverwebsGalleryHero, selector: string) =>
  element.shadowRoot!.querySelector<HTMLElement>(selector)!;

describe("overwebs-gallery-hero", () => {
  beforeAll(() => {
    customElements.define("test-overwebs-gallery-hero", OverwebsGalleryHero);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders the hero name and portrait", async () => {
    const element = await create(tracer);
    expect(query(element, ".name").textContent).toBe("Tracer");
    expect(query(element, ".portrait").getAttribute("style")).toContain("/heroes/tracer.jpg");
  });

  it("shows unlocked/unlockable, clamped to the unlockable count", async () => {
    const element = await create(tracer, 37);
    expect(query(element, ".unlocked").textContent).toBe(`37/${tracer.unlockable}`);
    element.unlocks = 500;
    await element.updateComplete;
    expect(query(element, ".unlocked").textContent).toBe(
      `${tracer.unlockable}/${tracer.unlockable}`,
    );
  });

  it("sizes and colours the progress bar", async () => {
    const element = await create(ana, ana.unlockable / 2);
    const completion = query(element, ".completion");
    expect(completion.style.width).toBe("50%");
    expect(completion.getAttribute("style")).toContain(ana.color);
    element.unlocks = 0;
    await element.updateComplete;
    expect(completion.style.width).toBe("0%");
  });

  it("reflects new from hero.background", async () => {
    const element = await create(tracer);
    expect(element.hasAttribute("new")).toBe(true);
    element.hero = ana;
    await element.updateComplete;
    expect(element.hasAttribute("new")).toBe(false);
    expect(element.new).toBe(false);
  });

  it("renders a placeholder without a hero", async () => {
    const element = await create(undefined);
    expect(query(element, ".name").textContent).toBe("Unknown");
    expect(element.hasAttribute("new")).toBe(false);
  });

  it("rotates the flare on every animation iteration", async () => {
    const element = await create(tracer);
    const flare = query(element, ".flare");
    flare.dispatchEvent(new Event("animationiteration"));
    expect(flare.style.transform).toMatch(/^translate\(-50%, -50%\) rotate\(\d+deg\)$/);
  });
});
