import React from "react";
import { NextSteps } from "../../components/next_steps";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import translate from "../fixtures/translate";

const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

describe("NextSteps", () => {
  let props;
  let mockStore, reduxState;
  beforeEach(() => {
    props = {
      t: translate,
      mapUrl: { query: {}, route: "/map" }
    };

    mockStore = configureStore();
    reduxState = {};
    props.store = mockStore(reduxState);
    props.reduxState = reduxState;
  });

  it("passes axe tests", async () => {
    let html = mount(<NextSteps {...props} {...reduxState} />).html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("register now link has a blank target", () => {
    expect(
      mount(<NextSteps {...props} {...reduxState} />)
        .find("#registerNowLink")
        .prop("target")
    ).toEqual("_blank");
  });

  it("myVAC account button uses the expected label", () => {
    expect(
      mount(<NextSteps {...props} {...reduxState} />)
        .find("#myVacAccountButton")
        .last()
        .text()
    ).toContain("nextSteps.myvac_button_text");
  });

  it("find nearby office link has expected href", () => {
    expect(
      mount(<NextSteps {...props} {...reduxState} />)
        .find("#nearbyOfficeLink")
        .prop("href")
    ).toEqual({ query: {}, route: "/map" });
  });
});
