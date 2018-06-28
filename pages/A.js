import React, { Component } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { connect } from "react-redux";
import { withI18next } from "../lib/withI18next";
import Layout from "../components/layout";
import "babel-polyfill/dist/polyfill";
import benefitsFixture from "../__tests__/fixtures/benefits";
import textFixture from "../__tests__/fixtures/text";

import { logEvent } from "../utils/analytics";
import Cookies from "universal-cookie";

import GuidedExperience from "../components/guided_experience";
import GuidedExperienceProfile from "../components/guided_experience_profile";
import GuidedExperienceNeeds from "../components/guided_experience_needs";
import BB from "../components/BB";
import Favourites from "../components/favourites";
import { redux2i18n } from "../utils/redux2i18n";

export class A extends Component {
  constructor() {
    super();
    this.cookies = new Cookies();
    this.state = {
      favouriteBenefits: [],
      section: "BB",
      width: 1000
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
    // this.cookies.set("favouriteBenefits", [], { path: "/" });
  }

  componentWillMount() {
    redux2i18n(this.props.i18n, this.props.text);
    const newState = {
      favouriteBenefits: this.props.favouriteBenefits,
      section: this.props.url.query.section || "BB"
    };

    this.setState(newState);
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
    if (this.props.url.query.use_testdata) {
      this.props.dispatch({
        type: "LOAD_DATA",
        data: {
          benefits: benefitsFixture,
          text: textFixture
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps || this.state.section !== prevState.section) {
      this.setURL();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  }

  updateWindowWidth() {
    this.setState({ width: window.innerWidth });
  }

  setURL = (state = this.state) => {
    let href = "/A?section=" + state.section;
    if (Object.keys(this.props.selectedNeeds).length > 0) {
      href += "&selectedNeeds=" + Object.keys(this.props.selectedNeeds).join();
    }
    ["patronType", "serviceType", "statusAndVitals"].forEach(selection => {
      if (this.props[selection] !== "") {
        href += `&${selection}=${this.props[selection]}`;
      }
    });
    href += "&lng=" + this.props.t("current-language-code");
    Router.push(href);
  };

  setSection = section => {
    this.setState({ section: section });
  };

  setSelectedNeeds = ids => {
    let selectedNeeds = {};
    ids.forEach(id => {
      selectedNeeds[id] = id;
      logEvent("FilterClick", "need", id);
    });
    this.props.setSelectedNeeds(selectedNeeds);
  };

  setUserProfile = (criteria, id) => {
    logEvent("FilterClick", criteria, id);
    switch (criteria) {
      case "patronType":
        this.props.setPatronType(id);
        if (id === "organization") {
          this.props.setServiceType("");
          this.props.setStatusType("");
        }
        break;
      case "serviceType":
        this.props.setServiceType(id);
        break;
      case "statusAndVitals":
        this.props.setStatusType(id);
        break;
      default:
        return true;
    }
  };

  toggleSelectedEligibility = (criteria, id) => () => {
    switch (criteria) {
      case "patronType":
        this.props.setPatronType(id);
        if (id === "organization") {
          this.props.setServiceType("");
          this.props.setStatusType("");
        }
        break;
      case "serviceType":
        this.props.setServiceType(id);
        break;
      case "statusAndVitals":
        this.props.setStatusType(id);
        break;
      default:
        return true;
    }
  };

  toggleFavourite = id => {
    let favouriteBenefits = this.cookies.get("favouriteBenefits")
      ? this.cookies.get("favouriteBenefits")
      : [];
    if (favouriteBenefits.indexOf(id) > -1) {
      favouriteBenefits.splice(favouriteBenefits.indexOf(id), 1);
    } else {
      favouriteBenefits.push(id);
    }
    this.cookies.set("favouriteBenefits", favouriteBenefits, { path: "/" });
    this.setState({ favouriteBenefits: favouriteBenefits });
  };

  clearFilters = () => {
    this.props.setPatronType("");
    this.props.setServiceType("");
    this.props.setStatusType("");
  };

  clearNeeds = () => {
    this.props.setSelectedNeeds({});
  };

  sectionToDisplay = section => {
    let question, options;
    const { t } = this.props;

    const profileIsVetWSV =
      this.props["patronType"] === "service-person" &&
      this.props["serviceType"] === "WSV (WWII or Korea)";

    let previousSectionA4 = "A3";
    if (this.props.patronType === "") {
      previousSectionA4 = "A1";
    } else if (this.props.serviceType === "" || profileIsVetWSV) {
      previousSectionA4 = "A2";
    }
    if (
      this.props.patronType === "organization" &&
      ["A2", "A3", "A4"].indexOf(section) > -1
    ) {
      this.setSection("BB");
    }

    switch (true) {
      case section === "favourites":
        return (
          <Favourites
            id="favourites"
            t={t}
            benefits={this.props.benefits}
            eligibilityPaths={this.props.eligibilityPaths}
            examples={this.props.examples}
            selectedNeeds={this.props.selectedNeeds}
            setUserProfile={this.setUserProfile}
            setSection={this.setSection}
            pageWidth={this.state.width}
            favouriteBenefits={this.state.favouriteBenefits}
            toggleFavourite={this.toggleFavourite}
            url={this.props.url}
          />
        );

      case section === "BB" ||
        (section !== "A1" && this.props.patronType === "organization"):
        return (
          <BB
            id="BB"
            t={t}
            selectedNeeds={this.props.selectedNeeds}
            toggleSelectedEligibility={this.toggleSelectedEligibility}
            setSelectedNeeds={this.setSelectedNeeds}
            setUserProfile={this.setUserProfile}
            setSection={this.setSection}
            clearFilters={this.clearFilters}
            clearNeeds={this.clearNeeds}
            pageWidth={this.state.width}
            favouriteBenefits={this.state.favouriteBenefits}
            toggleFavourite={this.toggleFavourite}
            url={this.props.url}
            store={this.props.store}
          />
        );

      case section === "A4" ||
        (profileIsVetWSV && section === "A3") ||
        (this.props.serviceType === "" && section === "A3") ||
        (this.props.patronType === "" &&
          (section === "A3" || section === "A2")):
        return (
          <GuidedExperience
            id="A4"
            stepNumber={3}
            t={t}
            nextSection="BB"
            prevSection={previousSectionA4}
            subtitle={t("B3.What do you need help with?")}
            setSection={this.setSection}
          >
            <GuidedExperienceNeeds
              t={t}
              selectedNeeds={this.props.selectedNeeds}
              setSelectedNeeds={this.setSelectedNeeds}
            />
          </GuidedExperience>
        );

      case section === "A1":
        question = "patronType";
        return (
          <GuidedExperience
            id="A1"
            stepNumber={0}
            nextSection="A2"
            setSection={this.setSection}
            subtitle={t("GE." + question)}
            t={t}
          >
            <GuidedExperienceProfile
              value={this.props[question]}
              t={t}
              onClick={option => this.setUserProfile(question, option)}
              isDown={option => this.props[question] === option}
              options={Array.from(
                new Set(this.props.eligibilityPaths.map(ep => ep[question]))
              ).filter(st => st !== "na")}
            />
          </GuidedExperience>
        );
      case section === "A2":
        question = "serviceType";
        return (
          <GuidedExperience
            id="A2"
            stepNumber={1}
            nextSection="A3"
            prevSection="A1"
            setSection={this.setSection}
            subtitle={t("GE." + question)}
            t={t}
          >
            <GuidedExperienceProfile
              value={this.props[question]}
              t={t}
              onClick={option => this.setUserProfile(question, option)}
              isDown={option => this.props[question] === option}
              options={Array.from(
                new Set(this.props.eligibilityPaths.map(ep => ep[question]))
              ).filter(st => st !== "na")}
            />
          </GuidedExperience>
        );
      case section === "A3":
        question = "statusAndVitals";
        options = Array.from(
          new Set(this.props.eligibilityPaths.map(ep => ep[question]))
        ).filter(st => st !== "na");
        if (this.props.patronType === "service-person") {
          options.splice(options.indexOf("deceased"), 1);
        }
        if (this.props.serviceType === "WSV (WWII or Korea)") {
          options.splice(options.indexOf("stillServing"), 1);
        }
        return (
          <GuidedExperience
            id="A3"
            stepNumber={2}
            nextSection="A4"
            prevSection="A2"
            setSection={this.setSection}
            subtitle={t("GE." + question)}
            t={t}
          >
            <GuidedExperienceProfile
              value={this.props[question]}
              t={t}
              onClick={option => this.setUserProfile(question, option)}
              options={options}
              isDown={option => this.props[question] === option}
            />
          </GuidedExperience>
        );

      case (this.props.patronType !== "organization" && section === "A4") ||
        (profileIsVetWSV && section === "A3"):
        return (
          <GuidedExperience
            id="A4"
            stepNumber={3}
            t={t}
            nextSection="BB"
            prevSection={profileIsVetWSV ? "A2" : "A3"}
            subtitle={t("B3.What do you need help with?")}
            setSection={this.setSection}
          >
            <GuidedExperienceNeeds
              t={t}
              selectedNeeds={this.props.selectedNeeds}
              setSelectedNeeds={this.setSelectedNeeds}
            />;
          </GuidedExperience>
        );
    }
  };

  render() {
    if (
      this.props.patronType === "service-person" &&
      this.props.statusAndVitals === "deceased"
    ) {
      this.props.setStatusType("");
    }

    if (
      this.props.serviceType === "WSV (WWII or Korea)" &&
      this.props.statusAndVitals === "stillServing"
    ) {
      this.props.setStatusType("");
    }

    // Guided Experience skips statusAndVitals for service-person / WSV
    if (
      this.state.section !== "BB" &&
      this.props.patronType === "service-person" &&
      this.props.serviceType === "WSV (WWII or Korea)" &&
      this.props.statusAndVitals !== ""
    ) {
      this.props.setStatusType("");
    }

    return (
      <Layout
        i18n={this.props.i18n}
        t={this.props.t}
        hideNoscript={false}
        showRefreshCache={false}
      >
        {this.sectionToDisplay(this.state.section)}
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPatronType: patronType => {
      dispatch({ type: "SET_PATRON_TYPE", data: patronType });
    },
    setSelectedNeeds: needsObject => {
      dispatch({ type: "SET_SELECTED_NEEDS", data: needsObject });
    },
    setServiceType: serviceType => {
      dispatch({ type: "SET_SERVICE_TYPE", data: serviceType });
    },
    setStatusType: statusType => {
      dispatch({ type: "SET_STATUS_TYPE", data: statusType });
    }
  };
};

const mapStateToProps = reduxState => {
  return {
    benefits: reduxState.benefits,
    eligibilityPaths: reduxState.eligibilityPaths,
    examples: reduxState.examples,
    favouriteBenefits: reduxState.favouriteBenefits,
    needs: reduxState.needs,
    patronType: reduxState.patronType,
    serviceType: reduxState.serviceType,
    statusAndVitals: reduxState.statusAndVitals,
    selectedNeeds: reduxState.selectedNeeds,
    text: reduxState.text
  };
};

A.propTypes = {
  benefits: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
  eligibilityPaths: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  i18n: PropTypes.object.isRequired,
  needs: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
  favouriteBenefits: PropTypes.array.isRequired,
  patronType: PropTypes.string.isRequired,
  serviceType: PropTypes.string.isRequired,
  statusAndVitals: PropTypes.string.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  setPatronType: PropTypes.func.isRequired,
  setSelectedNeeds: PropTypes.func.isRequired,
  setServiceType: PropTypes.func.isRequired,
  setStatusType: PropTypes.func.isRequired,
  store: PropTypes.object,
  text: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withI18next()(A));
