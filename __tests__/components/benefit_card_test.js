import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import benefitEligibilityFixture from "../fixtures/benefitEligibility";
import { BenefitCard } from "../../components/benefit_cards";
import benefitsFixture from "../fixtures/benefits";
import benefitExamplesFixture from "../fixtures/benefitExamples";
import needsFixture from "../fixtures/needs";
import multipleChoiceOptionsFixture from "../fixtures/multiple_choice_options";
import questionsFixture from "../fixtures/questions_complex";

const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

jest.mock("react-ga");

describe("BenefitCard", () => {
  const mocked_fn = jest.fn();
  mocked_fn.mockReturnValue({ focus: jest.fn() });
  window.open = mocked_fn;

  let props;
  let mockStore, reduxData;
  let _mountedBenefitCard;
  const mountedBenefitCard = () => {
    if (!_mountedBenefitCard) {
      _mountedBenefitCard = mount(<BenefitCard {...props} {...reduxData} />);
    }
    return _mountedBenefitCard;
  };

  beforeEach(() => {
    props = {
      t: () => "en",
      benefit: benefitsFixture[1],
      currentLanguage: "en",
      veteranBenefitIds: [],
      familyBenefitIds: []
    };
    mockStore = configureStore();
    reduxData = {
      cookiesDisabled: false,
      needs: needsFixture,
      selectedNeeds: {},
      benefits: benefitsFixture,
      benefitEligibility: benefitEligibilityFixture,
      multipleChoiceOptions: multipleChoiceOptionsFixture,
      benefitExamples: benefitExamplesFixture,
      questions: questionsFixture,
      searchString: ""
    };
    props.store = mockStore(reduxData);

    _mountedBenefitCard = undefined;
    mockStore = configureStore();
    props.store = mockStore(reduxData);
  });

  it("passes axe tests", async () => {
    let html = mountedBenefitCard().html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("contains the name", () => {
    expect(mountedBenefitCard().text()).toContain(benefitsFixture[1].vacNameEn);
  });

  it("contains the description", () => {
    expect(
      mountedBenefitCard()
        .find(".cardDescription")
        .first()
        .text()
    ).toEqual(benefitsFixture[1].oneLineDescriptionEn);
  });

  it("Clicking the See More button expands the BenefitExpansion component", () => {
    mountedBenefitCard()
      .find("BenefitExpansion")
      .at(0)
      .simulate("click");
    expect(mountedBenefitCard().find("BenefitExpansion").length).toEqual(1);
  });

  describe("when language is French", () => {
    beforeEach(() => {
      props.t = () => "fr";
      props.currentLanguage = "fr";
    });

    it("contains the French name", () => {
      expect(mountedBenefitCard().text()).toContain(
        benefitsFixture[1].vacNameFr
      );
    });

    it("shows a child benefit title if the benefit has a child", () => {
      expect(
        mountedBenefitCard()
          .find("Paper")
          .first()
          .text()
      ).toContain("fr");
    });
  });

  it("has a needs tag", () => {
    reduxData.selectedNeeds["need_0"] = "need_0";
    expect(mountedBenefitCard().text()).toContain("NEED 0");
  });

  it("contains the LearnMoreButton", () => {
    expect(mountedBenefitCard().find("LearnMoreButton").length).toEqual(1);
  });
});
