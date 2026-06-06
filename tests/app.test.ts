import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import App from "~/app.vue";

describe("App", () => {
  it("renders the root div", () => {
    const wrapper = shallowMount(App);
    expect(wrapper.find("div").exists()).toBe(true);
  });

  it("includes overlay components", () => {
    const wrapper = shallowMount(App);
    // App renders global overlays (stubbed by shallowMount)
    const html = wrapper.html();
    expect(html).toContain("searchoverlay");
    expect(html).toContain("readerdetail");
    expect(html).toContain("apptoast");
  });

  it("matches snapshot", () => {
    const wrapper = shallowMount(App);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
