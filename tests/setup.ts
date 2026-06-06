import { config } from "@vue/test-utils";
import { vi } from "vitest";

// Real composables as globals — mirrors Nuxt's auto-import behavior.
// useToast first: it has no deps and useFeed calls useToast() as a global.
import { useToast } from "../app/composables/useToast.js";
import { useSearch } from "../app/composables/useSearch.js";
import { useAppearance } from "../app/composables/useAppearance.js";
import { useFeed } from "../app/composables/useFeed.js";

globalThis.useToast = useToast;
globalThis.useSearch = useSearch;
globalThis.useAppearance = useAppearance;
globalThis.useFeed = useFeed;

// Nuxt router / navigation globals
globalThis.navigateTo = vi.fn();
globalThis.useRoute = vi.fn(() => ({ path: "/", params: {}, query: {} }));
globalThis.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));
globalThis.definePageMeta = vi.fn();

// Global stubs for Nuxt built-in components and Vue Transition
config.global.stubs = {
  NuxtLink: {
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
  NuxtLayout: {
    template: "<div><slot /></div>",
  },
  NuxtPage: {
    template: "<div />",
  },
  // Stub Transition so v-if content inside renders synchronously in tests
  Transition: {
    template: "<div><slot /></div>",
  },
};
