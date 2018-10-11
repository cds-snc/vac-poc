import React, { Component } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { withI18next } from "../lib/withI18next";
import { showQuestion } from "../utils/common";
import Layout from "../components/layout";
import GuidedExperience from "../components/guided_experience";
import GuidedExperienceProfile from "../components/guided_experience_profile";
import GuidedExperienceNeeds from "../components/guided_experience_needs";

export class Guided extends Component {
  constructor(props) {
    super(props);
    this.cookies = new Cookies();
    this.state = {
      section: this.props.sectionOrder[0]
    };
  }

  componentDidMount() {
    Router.onRouteChangeStart = newUrl => {
      let matches = newUrl.match(/section=([^&]*)/);
      const newState = {
        section: matches[1] || this.props.sectionOrder[0]
      };
      this.setState(newState);
    };

    const newState = {
      section: this.props.url.query.section || this.props.sectionOrder[0]
    };

    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps || this.state.section !== prevState.section) {
      this.setURL();
    }
  }

  setURL = (state = this.state) => {
    let href = "/guided?section=" + state.section;
    if (Object.keys(this.props.selectedNeeds).length > 0) {
      href += "&selectedNeeds=" + Object.keys(this.props.selectedNeeds).join();
    }
    this.props.reduxState.questions
      .filter(x => x.variable_name !== "needs")
      .forEach(x => {
        if (this.props.reduxState[x.variable_name]) {
          href += `&${x.variable_name}=${
            this.props.reduxState[x.variable_name]
          }`;
        }
      });
    href += "&lng=" + this.props.t("current-language-code");
    Router.replace(href);
  };

  setSection = section => {
    this.setState({ section: section });
    const current_index = this.props.sectionOrder.indexOf(section);
    this.props.sectionOrder.filter((x, i) => i > current_index).forEach(x => {
      if (x === "needs") {
        this.props.saveQuestionResponse("selectedNeeds", {});
      } else {
        this.props.saveQuestionResponse(x, "");
      }
    });
  };

  getNextSection = (displayable_sections, dynamicStepNumber) => {
    if (dynamicStepNumber + 1 >= displayable_sections.length) {
      return "benefits-directory";
    } else {
      return displayable_sections[dynamicStepNumber + 1];
    }
  };

  getPrevSection = (displayable_sections, dynamicStepNumber) => {
    if (dynamicStepNumber === 0) {
      return "index";
    } else {
      return displayable_sections[dynamicStepNumber - 1];
    }
  };

  getSubtitle = question => {
    if (this.props.t("current-language-code") === "en") {
      return question["guided_experience_english"];
    } else {
      return question["guided_experience_french"];
    }
  };
  getTooltip = question => {
    if (this.props.t("current-language-code") === "en") {
      return question["tooltip_english"];
    } else {
      return question["tooltip_french"];
    }
  };

  render() {
    const { t, i18n, store, reduxState, sectionOrder } = this.props;
    const { section } = this.state;
    const displayable_sections = sectionOrder.filter((x, i) =>
      showQuestion(x, i, reduxState)
    );
    const dynamicStepNumber = displayable_sections.indexOf(section);
    const question = reduxState.questions.filter(
      x => x.variable_name === section
    )[0];
    return (
      <Layout
        i18n={i18n}
        t={t}
        hideNoscript={false}
        showRefreshCache={false}
        title={t("titles.guided_experience")}
      >
        <GuidedExperience
          id={section}
          stepNumber={sectionOrder.indexOf(section)}
          nextSection={this.getNextSection(
            displayable_sections,
            dynamicStepNumber
          )}
          prevSection={this.getPrevSection(
            displayable_sections,
            dynamicStepNumber
          )}
          setSection={this.setSection}
          subtitle={this.getSubtitle(question)}
          helperText={this.getTooltip(question)}
          t={t}
          store={store}
        >
          {section === "needs" ? (
            <GuidedExperienceNeeds t={t} selectorType={section} store={store} />
          ) : (
            <GuidedExperienceProfile
              t={t}
              selectorType={section}
              store={store}
              options={question["multiple_choice_options"]}
            />
          )}
        </GuidedExperience>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveQuestionResponse: (question, response) => {
      dispatch({
        type: "SAVE_QUESTION_RESPONSE",
        data: { [question]: response }
      });
    }
  };
};

const mapStateToProps = reduxState => {
  return {
    reduxState: reduxState,
    selectedNeeds: reduxState.selectedNeeds,
    sectionOrder: reduxState.questions.map(x => x.variable_name)
  };
};

Guided.propTypes = {
  reduxState: PropTypes.object,
  sectionOrder: PropTypes.array.isRequired,
  // dispatch: PropTypes.func,
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  saveQuestionResponse: PropTypes.func.isRequired,
  store: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withI18next()(Guided));
