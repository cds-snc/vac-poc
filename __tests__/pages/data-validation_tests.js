/* eslint-env jest */

import { shallow } from "enzyme";
import React from "react";

import { DataValidation } from "../../pages/data-validation";
import benefitsFixture from "../fixtures/benefits";
import eligibilityPathsFixture from "../fixtures/eligibilityPaths";
import needsFixture from "../fixtures/needs";
import examplesFixture from "../fixtures/examples";

jest.mock("react-ga");

describe("DataValidation", () => {
  let props;
  let _mountedDataValidation;

  const mountedDataValidation = () => {
    if (!_mountedDataValidation) {
      _mountedDataValidation = shallow(<DataValidation {...props} />);
    }
    return _mountedDataValidation;
  };

  beforeEach(() => {
    props = {
      t: key => key,
      i18n: {},
      benefits: benefitsFixture,
      eligibilityPaths: eligibilityPathsFixture,
      needs: needsFixture,
      examples: examplesFixture,
      classes: {}
    };
    _mountedDataValidation = undefined;
  });

  it("has a correct createData function", () => {
    const dataValidationInstance = mountedDataValidation().instance();

    const returnValuel1 = dataValidationInstance.createData("n1", 10, "s1");
    const returnValuel2 = dataValidationInstance.createData("n2", 20, "s2");
    expect(returnValuel1).toEqual({
      id: benefitsFixture.length + 2,
      name: "n1",
      value: 10,
      status: "s1"
    });
    expect(returnValuel2.id).toEqual(benefitsFixture.length + 3);
  });

  it("passes all tests using the default fixtures", () => {
    expect(mountedDataValidation().html()).toContain("Pass");
    expect(mountedDataValidation().html()).not.toContain("Fail");
  });

  it("fails if there are no benefits", () => {
    props.benefits = [];
    expect(mountedDataValidation().html()).toContain("Fail");
  });

  it("fails if there are no eligibility paths", () => {
    props.eligibilityPaths = [];
    expect(mountedDataValidation().html()).toContain("Fail");
  });

  it("fails if there are no needs", () => {
    props.needs = [];
    expect(mountedDataValidation().html()).toContain("Fail");
  });

  it("fails if there are no examples", () => {
    props.examples = [];
    expect(mountedDataValidation().html()).toContain("Fail");
  });
});
