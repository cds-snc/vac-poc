import React from "react";
import { mount } from "enzyme";
import NeedsSelector from "../../components/needs_selector";
import needsFixture from "../fixtures/needs";

const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

describe("NeedsSelector", () => {
  let props;
  let _mountedNeedsSelector;

  const mountedNeedsSelector = () => {
    if (!_mountedNeedsSelector) {
      _mountedNeedsSelector = mount(<NeedsSelector {...props} />);
    }
    return _mountedNeedsSelector;
  };

  beforeEach(() => {
    props = {
      t: key => key,
      needs: needsFixture,
      selectedNeeds: {},
      handleChange: jest.fn()
    };
    _mountedNeedsSelector = undefined;
  });

  it("passes axe tests", async () => {
    let html = mountedNeedsSelector().html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("has the exact number of children as passed", () => {
    const select = mountedNeedsSelector().find("Button");
    expect(select.length).toEqual(needsFixture.length);
  });

  it("works if needs haven't loaded yet", () => {
    props.needs = [];
    props.selectedNeeds = { 43534534: "43534534" };
    expect(mountedNeedsSelector());
  });

  it("works if language is en", () => {
    props.t = () => "en";
    expect(mountedNeedsSelector());
  });

  it("fires the the handleChange function when a need is selected", () => {
    mountedNeedsSelector()
      .find("Button")
      .at(0)
      .simulate("click");
    expect(props.handleChange).toHaveBeenCalled();
  });
});
