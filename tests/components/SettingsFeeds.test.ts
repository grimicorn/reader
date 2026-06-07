import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SettingsFeeds from "~/components/SettingsFeeds.vue";
import { makeFeed } from "../fixtures";

function stubFeed(feedOverrides: object[] = []) {
  const feeds = feedOverrides.length
    ? feedOverrides.map((o) => makeFeed(o))
    : [
        makeFeed(),
        makeFeed({
          id: "f2",
          type: "podcast",
          name: "Test Podcast",
          status: "error",
          color: "var(--src-podcast)",
        }),
      ];

  vi.stubGlobal("useFeed", () => ({
    state: { newFeedUrl: "", feeds },
    addFeed: vi.fn(),
    removeFeed: vi.fn(),
  }));
}

describe("SettingsFeeds", () => {
  beforeEach(() => stubFeed());

  it("renders a row for each feed", () => {
    const wrapper = shallowMount(SettingsFeeds);
    expect(wrapper.findAll(".feed-row")).toHaveLength(2);
  });

  it("shows error badge for failed feeds", () => {
    const wrapper = shallowMount(SettingsFeeds);
    expect(wrapper.find(".feed-stat.error").exists()).toBe(true);
  });

  it("shows count badge for healthy feeds", () => {
    const wrapper = shallowMount(SettingsFeeds);
    expect(wrapper.find(".feed-stat.count").text()).toBe("5 new");
  });

  it("calls removeFeed with the feed id when remove is clicked", async () => {
    const removeFeed = vi.fn();
    vi.stubGlobal("useFeed", () => ({
      state: { newFeedUrl: "", feeds: [makeFeed()] },
      addFeed: vi.fn(),
      removeFeed,
    }));
    const wrapper = shallowMount(SettingsFeeds);
    await wrapper.find(".icon-btn").trigger("click");
    expect(removeFeed).toHaveBeenCalledWith("f1");
  });

  it("renders empty feed list without errors", () => {
    vi.stubGlobal("useFeed", () => ({
      state: { newFeedUrl: "", feeds: [] },
      addFeed: vi.fn(),
      removeFeed: vi.fn(),
    }));
    const wrapper = shallowMount(SettingsFeeds);
    expect(wrapper.findAll(".feed-row")).toHaveLength(0);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("matches snapshot with feeds", () => {
    const wrapper = shallowMount(SettingsFeeds);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
