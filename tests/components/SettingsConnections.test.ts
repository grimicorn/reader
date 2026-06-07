import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SettingsConnections from "~/components/SettingsConnections.vue";
import { makeConnection } from "../fixtures";

const connected = makeConnection({
  id: "youtube",
  name: "YouTube",
  connected: true,
  account: "@mychannel",
  since: "Connected 2 days ago",
});
const disconnected = makeConnection({
  id: "twitter",
  name: "X",
  connected: false,
});

function stubFeed(connections = [connected, disconnected]) {
  vi.stubGlobal("useFeed", () => ({
    state: { connections },
    toggleConn: vi.fn(),
  }));
}

describe("SettingsConnections", () => {
  beforeEach(() => stubFeed());

  it("renders a card for each connection", () => {
    const wrapper = shallowMount(SettingsConnections);
    expect(wrapper.findAll(".conn")).toHaveLength(2);
  });

  it("shows Disconnect for connected accounts", () => {
    const wrapper = shallowMount(SettingsConnections);
    const buttons = wrapper.findAll("button.btn");
    expect(buttons[0].text()).toBe("Disconnect");
  });

  it("shows Connect for disconnected accounts", () => {
    const wrapper = shallowMount(SettingsConnections);
    const buttons = wrapper.findAll("button.btn");
    expect(buttons[1].text()).toBe("Connect");
  });

  it("calls toggleConn when button is clicked", async () => {
    const toggleConn = vi.fn();
    vi.stubGlobal("useFeed", () => ({
      state: { connections: [disconnected] },
      toggleConn,
    }));
    const wrapper = shallowMount(SettingsConnections);
    await wrapper.find("button.btn").trigger("click");
    expect(toggleConn).toHaveBeenCalledWith(disconnected);
  });

  it("shows live dot for connected accounts", () => {
    const wrapper = shallowMount(SettingsConnections);
    expect(wrapper.find(".live").exists()).toBe(true);
  });

  it("matches snapshot", () => {
    const wrapper = shallowMount(SettingsConnections);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
