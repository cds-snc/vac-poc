/* eslint-env jest */

import { shallow } from "enzyme";
import Router from "next/router";

import React from "react";
import { FavouritesPage } from "../../pages/favourites";
import benefitsFixture from "../fixtures/benefits";
import elegibilityPathsFixture from "../fixtures/eligibilityPaths";
import needsFixture from "../fixtures/needs";
import configureStore from "redux-mock-store";
import examplesFixture from "../fixtures/examples";
import eligibilityPathsFixture from "../fixtures/eligibilityPaths";

const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

jest.mock("react-ga");

describe("A", () => {
  Router.router = {
    push: jest.fn()
  };
  Router.push = jest.fn();

  let props;
  let _mountedFavouritesPage;
  let mockStore, reduxData;

  const mountedFavouritesPage = () => {
    if (!_mountedFavouritesPage) {
      _mountedFavouritesPage = shallow(
        <FavouritesPage {...props} {...reduxData} />
      );
    }
    return _mountedFavouritesPage;
  };

  beforeEach(() => {
    props = {
      text: [],
      url: {
        query: {}
      },
      i18n: {
        addResourceBundle: jest.fn()
      },
      t: key => {
        return key === "current-language-code" ? "en" : key;
      },
      storeHydrated: true,
      dispatch: jest.fn(),
      benefits: benefitsFixture,
      eligibilityPaths: elegibilityPathsFixture,
      needs: needsFixture,
      examples: [],
      setPatronType: jest.fn(),
      setSelectedNeeds: jest.fn(),
      setServiceType: jest.fn(),
      setStatusAndVitals: jest.fn()
    };
    _mountedFavouritesPage = undefined;
    mockStore = configureStore();
    reduxData = {
      benefits: benefitsFixture,
      examples: examplesFixture,
      eligibilityPaths: eligibilityPathsFixture,
      needs: needsFixture,
      selectedNeeds: {},
      serviceType: "CAF",
      patronType: "family",
      statusAndVitals: "",
      favouriteBenefits: [benefitsFixture[0].id]
    };
    props.store = mockStore(reduxData);
  });

  it("passes axe tests", async () => {
    let html = mountedFavouritesPage().html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("has a working toggleFavourite function", async () => {
    let instance = mountedFavouritesPage().instance();
    instance.toggleFavourite("c0");
    instance.toggleFavourite("c1");
    expect(instance.cookies.get("favouriteBenefits")).toEqual(["c0", "c1"]);
    instance.toggleFavourite("c0");
    expect(instance.cookies.get("favouriteBenefits")).toEqual(["c1"]);
  });
});
