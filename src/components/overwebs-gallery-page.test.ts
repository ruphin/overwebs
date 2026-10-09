import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-gallery-page.js";
import { heroes } from "../lib/heroes.js";
import { defaultPlayer, player } from "../lib/player.js";
import type { OverwebsGalleryHero } from "./overwebs-gallery-hero.js";
import type { OverwebsGalleryPage } from "./overwebs-gallery-page.js";
import type { OverwebsPageTitle } from "./overwebs-page-title.js";

const create = async (): Promise<OverwebsGalleryPage> => {
  const element = document.createElement("overwebs-gallery-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const cards = (element: OverwebsGalleryPage): HTMLElement[] => [
  ...element.shadowRoot!.querySelectorAll<HTMLElement>(".hero-gallery > .hero"),
];

describe("overwebs-gallery-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    player.set(defaultPlayer);
    vi.restoreAllMocks();
  });

  it("renders the title, player widget and back button", async () => {
    const element = await create();
    const root = element.shadowRoot!;
    expect(root.querySelector<OverwebsPageTitle>("overwebs-page-title")!.text).toBe("HERO GALLERY");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(root.querySelector("overwebs-global-button")!.getAttribute("action")).toBe("back");
  });

  it("renders one card per hero, in roster order", async () => {
    const element = await create();
    const rendered = cards(element).map(
      (card) => card.querySelector<OverwebsGalleryHero>("overwebs-gallery-hero")!.hero,
    );
    expect(rendered).toEqual(heroes);
  });

  it("links only the heroes that have backgrounds", async () => {
    const element = await create();
    cards(element).forEach((card, index) => {
      const hero = heroes[index]!;
      if (hero.background) {
        expect(card.tagName).toBe("A");
        expect(card.getAttribute("href")).toBe(`/main?background=${hero.id}`);
      } else {
        expect(card.tagName).not.toBe("A");
        expect(card.hasAttribute("href")).toBe(false);
      }
    });
    expect(heroes.some((hero) => hero.background)).toBe(true);
    expect(heroes.some((hero) => !hero.background)).toBe(true);
  });

  it("takes the unlock counts from the player store", async () => {
    player.set({ ...defaultPlayer, unlocks: { ana: 5, genji: 9 } });
    const element = await create();
    const unlocks = () =>
      Object.fromEntries(
        cards(element).map((card) => {
          const hero = card.querySelector<OverwebsGalleryHero>("overwebs-gallery-hero")!;
          return [hero.hero!.id, hero.unlocks];
        }),
      );
    expect(unlocks()).toMatchObject({ ana: 5, genji: 9, mercy: 0 });

    player.update((value) => ({ ...value, unlocks: { ...value.unlocks, mercy: 3 } }));
    await element.updateComplete;
    expect(unlocks()).toMatchObject({ ana: 5, genji: 9, mercy: 3 });
  });

  it("staggers the fade-in by 0.02s per card", async () => {
    const element = await create();
    const delays = cards(element).map((card) => parseFloat(card.style.animationDelay));
    expect(delays).toHaveLength(heroes.length);
    delays.forEach((delay, index) => expect(delay).toBeCloseTo(index * 0.02));
  });

  it("goes back in history when the back button is clicked", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const element = await create();
    element.shadowRoot!.querySelector<HTMLElement>("overwebs-global-button")!.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
