import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SettingsPage from "~/pages/settings.vue";
import { useFeed } from "~/composables/useFeed";

const { state } = useFeed();

describe("settings page", () => {
  beforeEach(() => {
    state.feeds = [];
    state.connections = [];
    state.newFeedUrl = "";
  });

  it("renders the settings layout", () => {
    const wrapper = shallowMount(SettingsPage);
    expect(wrapper.find(".settings").exists()).toBe(true);
  });

  it("matches snapshot (empty state)", () => {
    const wrapper = shallowMount(SettingsPage);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
