import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { css } from "react-emotion";
import Router from "next/router";
import Container from "./container";
import FilterText from "./typography/filter_text";
import Header from "./typography/header";
import Body from "./typography/body";
import Button from "./button";
import HeaderButton from "./header_button";
import AnchorLink from "./typography/anchor_link";
import { globalTheme } from "../theme";
import Paper from "./paper";
import { mutateUrl } from "../utils/common";

const box = css`
  padding: 25px 63px 63px 63px;
  @media only screen and (max-width: ${globalTheme.max.mobile}) {
    padding: 17px 26px 55px 26px;
  }
  display: inline-flex;
`;
const prevButton = css`
  margin-top: 50px;
  margin-bottom: 15px;
`;
const comma = css`
  margin-right: 0.5em;
`;
const questions = css`
  margin: 0;
  padding: 0;
`;
const body = css`
  margin-top: 5px;
  margin-bottom: 0px;
`;
export class GuidedExperience extends Component {
  jumpButtons = (t, reduxState) => {
    const eligibilityKeys = reduxState.questions
      .map(x => x.variable_name)
      .filter(x => x != "needs");
    let jsx_array = eligibilityKeys.map((k, i) => {
      if (!reduxState[k] || k === this.props.id) {
        return null;
      } else {
        let option = reduxState.multipleChoiceOptions.filter(
          x => x.variable_name === reduxState[k]
        )[0];
        let text;
        if (t("current-language-code") === "en") {
          text = option.ge_breadcrumb_english
            ? option.ge_breadcrumb_english
            : option.display_text_english;
        } else {
          text = option.ge_breadcrumb_french
            ? option.ge_breadcrumb_french
            : option.display_text_french;
        }

        return (
          <span key={i}>
            <span className={comma}>{i === 0 ? "" : ","}</span>
            <AnchorLink
              id={"jumpButton" + i}
              href="#"
              onClick={() => this.props.setSection(k)}
            >
              {text}
            </AnchorLink>
          </span>
        );
      }
    });
    return jsx_array;
  };

  render() {
    const {
      t,
      reduxState,
      prevSection,
      nextSection,
      subtitle,
      setSection,
      helperText,
      url
    } = this.props;

    const summaryUrl = mutateUrl(url, "/summary", { section: "" });
    const jumpButtons = this.jumpButtons(t, reduxState);
    const nonNullBreadcrumbs = jumpButtons.filter(x => x != null);

    return (
      <Container id="guidedExperience">
        <HeaderButton
          id="prevButton"
          useLink={prevSection === "index"}
          href={prevSection === "index" ? t("ge.home_link") : undefined}
          onClick={
            prevSection === "index" ? undefined : () => setSection(prevSection)
          }
          className={prevButton}
          arrow="back"
        >
          {t("back")}
        </HeaderButton>

        {this.props.stepNumber === 0 ? (
          <React.Fragment>
            <Header size="lg" headingLevel="h1">
              {t("ge.Find benefits and services")}
            </Header>
            <Body>
              <p>{t("ge.intro_text_p1")}</p>
              <p>{t("ge.intro_text_p2")}</p>
            </Body>
          </React.Fragment>
        ) : null}

        <Paper padding="md" className={box}>
          <Grid container spacing={24}>
            <Grid item xs={12} md={12}>
              <FilterText style={{ display: "inline-block" }}>
                {nonNullBreadcrumbs.length === 0
                  ? ""
                  : t("B3.Filter by eligibility")}
              </FilterText>
              {jumpButtons}
            </Grid>

            <Grid item xs={12} className={questions}>
              <Header size="md_lg" headingLevel="h2">
                {subtitle}
              </Header>
              {helperText ? <Body className={body}>{helperText}</Body> : null}
              {this.props.children}
            </Grid>

            <Grid item xs={12}>
              <Button
                id="nextButton"
                arrow={true}
                onClick={
                  nextSection === "summary"
                    ? () => Router.push(summaryUrl)
                    : () => setSection(nextSection)
                }
              >
                {t("next")}{" "}
              </Button>
              <HeaderButton
                id="skipButton"
                altStyle="grey"
                onClick={
                  nextSection === "summary"
                    ? () => Router.push(summaryUrl)
                    : () => setSection(nextSection)
                }
              >
                {t("ge.skip")}
              </HeaderButton>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    reduxState: reduxState
  };
};

GuidedExperience.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  nextSection: PropTypes.string.isRequired,
  prevSection: PropTypes.string,
  t: PropTypes.func.isRequired,
  setSection: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  stepNumber: PropTypes.number.isRequired,
  children: PropTypes.object.isRequired,
  reduxState: PropTypes.object.isRequired,
  store: PropTypes.object
};

export default connect(mapStateToProps)(GuidedExperience);
