import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "react-emotion";
import { connect } from "react-redux";
import { globalTheme } from "../theme";
import HeaderLink from "./header_link";
import Button from "./button";
import { logEvent } from "../utils/analytics";
var constants = require("../utils/hardcoded_strings");

const headerDesc = css`
  flex-grow: 1;
  color: ${globalTheme.colour.greyishBrown};
`;
/*
const ExpansionPanelSummaryCss = css`
  padding-left: ${globalTheme.cardPadding} !important;
  padding-right: ${globalTheme.cardPadding} !important;
  padding-top: 20px !important;
  padding-bottom: 20px !important;
  border-radius: 0px;
  border-top: 1px solid ${globalTheme.colour.paleGrey} !important;
  position: relative !important;
  min-height: 0px !important;
  div {
    margin: 0px !important;
  }
  div[role="button"] {
    padding: 0px 20px 0px 20px !important;
  }
  @media only screen and (max-width: ${globalTheme.max.xs}) {
    padding-left: ${globalTheme.cardPaddingMobile} !important;
    padding-right: ${globalTheme.cardPaddingMobile} !important;
  }
`;
const cardBottomTitle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
*/
const cardBottomFamilyTitle = css`
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
/*
const ExpansionPanelCss = css`
  margin: 0px !important;
`;
const ExpansionPanelOpen = css`
  background-color: ${globalTheme.colour.cardGrey} !important;
`;
const ExpansionPanelClosed = css`
  :hover {
    background-color: ${globalTheme.colour.cardGrey} !important;
  }
`;
const collapse = css`
  background-color: ${globalTheme.colour.cardGrey} !important;
  padding-left: ${globalTheme.cardPadding} !important;
  padding-right: ${globalTheme.cardPadding} !important;
  @media only screen and (max-width: ${globalTheme.max.xs}) {
    padding-left: ${globalTheme.cardPaddingMobile} !important;
    padding-right: ${globalTheme.cardPaddingMobile} !important;
  }
`;
*/
const children = css`
  width: 100%;
`;
const heading = css`
  margin-bottom: 10px;
  text-align: left;
`;

export class CardFooter extends Component {
  state = {
    open: false
  };
  logExit = url => {
    logEvent("Exit", url);
  };

  benefitTitle = benefit => {
    return this.props.t("current-language-code") === "en"
      ? benefit.vacNameEn
      : benefit.vacNameFr;
  };

  childBenefitNames = (benefit, childBenefits, open) => {
    if (open) {
      return "See Less";
    } else {
      return "See More";
    }
  };

  toggleOpenState = () => {
    this.setState(previousState => {
      return { ...previousState, open: !previousState.open };
    });
  };

  getMatchingBenefits = (benefits, ids) => {
    const matchingBenefits = benefits.filter(ab => ids.has(ab.id));
    return matchingBenefits;
  };

  getBenefitIds = (
    eligibilityPaths,
    servicePersonOptionIds,
    familyOptionIds
  ) => {
    let veteranBenefitIds = [];
    let familyBenefitIds = [];

    eligibilityPaths.forEach(ep => {
      servicePersonOptionIds.forEach(id => {
        if (ep.requirements && ep.requirements.indexOf(id) !== -1) {
          veteranBenefitIds = veteranBenefitIds.concat(ep.benefits);
        }
      });
      familyOptionIds.forEach(id => {
        if (ep.requirements && ep.requirements.indexOf(id) !== -1) {
          familyBenefitIds = familyBenefitIds.concat(ep.benefits);
        }
      });
    });
    return {
      veteran: new Set(veteranBenefitIds),
      family: new Set(familyBenefitIds)
    };
  };

  render() {
    const { t, benefit, benefits } = this.props;
    const language = t("current-language-code");
    const childBenefits = benefit.childBenefits
      ? benefits.filter(ab => benefit.childBenefits.indexOf(ab.id) > -1)
      : [];

    const servicePersonOptionIds = this.props.multipleChoiceOptions
      .filter(
        mco => constants.servicePersonOptions.indexOf(mco.variable_name) !== -1
      )
      .map(mco => mco.id);

    const familyOptionIds = this.props.multipleChoiceOptions
      .filter(mco => constants.familyOptions.indexOf(mco.variable_name) !== -1)
      .map(mco => mco.id);

    const benefitIds = this.getBenefitIds(
      this.props.eligibilityPaths,
      servicePersonOptionIds,
      familyOptionIds
    );
    const veteranBenefits = this.getMatchingBenefits(
      childBenefits,
      benefitIds.veteran
    );
    const familyBenefits = this.getMatchingBenefits(
      childBenefits,
      benefitIds.family
    );
    let otherBenefits = "";
    if (childBenefits.length > 0) {
      if (veteranBenefits.length > 0) {
        if (childBenefits.length == 1) {
          otherBenefits =
            this.benefitTitle(benefit) +
            " " +
            t("benefits_b.eligible_for_single", {
              x: this.benefitTitle(childBenefits[0])
            }) +
            ":";
        } else {
          otherBenefits =
            this.benefitTitle(benefit) +
            " " +
            t("benefits_b.eligible_for_multi", {
              x: childBenefits.length
            }) +
            ":";
        }
      }
      return (
        <div>
          {veteranBenefits.length > 0 ? (
            <div>
              <div className={cardBottomFamilyTitle}>
                <span className={headerDesc}>{otherBenefits}</span>
              </div>
              <div className={children}>
                <div>
                  <ul>
                    {veteranBenefits.map((cb, i) => (
                      <li key={cb.id}>
                        <HeaderLink
                          id={"embedded-" + cb.id + i}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={heading}
                          size="small"
                          href={
                            language === "en"
                              ? cb.benefitPageEn
                              : cb.benefitPageFr
                          }
                          onClick={() => {
                            this.logExit(
                              language === "en"
                                ? cb.benefitPageEn
                                : cb.benefitPageFr
                            );
                            return true;
                          }}
                        >
                          {language === "en" ? cb.vacNameEn : cb.vacNameFr}
                        </HeaderLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {familyBenefits.length > 0 ? (
            <div>
              <div className={cardBottomFamilyTitle}>
                <span className={headerDesc}>
                  {t("benefits_b.eligible_open_family")}
                </span>
              </div>
              <div className={children}>
                <ul>
                  {familyBenefits.map((cb, i) => (
                    <li key={cb.id}>
                      <HeaderLink
                        id={"embedded-" + cb.id + i}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={heading}
                        size="small"
                        href={
                          language === "en"
                            ? cb.benefitPageEn
                            : cb.benefitPageFr
                        }
                        onClick={() => {
                          this.logExit(
                            language === "en"
                              ? cb.benefitPageEn
                              : cb.benefitPageFr
                          );
                          return true;
                        }}
                      >
                        {language === "en" ? cb.vacNameEn : cb.vacNameFr}
                      </HeaderLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
          <Button
            arrow={true}
            onClick={() => {
              this.logExit(
                t("current-language-code") === "en"
                  ? benefit.benefitPageEn
                  : benefit.benefitPageFr
              );
              const url =
                t("current-language-code") === "en"
                  ? benefit.benefitPageEn
                  : benefit.benefitPageFr;
              const win = window.open(url, "_blank");
              win.focus();
            }}
          >
            {t("Find out more")}
          </Button>
        </div>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = reduxState => {
  return {
    benefits: reduxState.benefits,
    eligibilityPaths: reduxState.eligibilityPaths,
    multipleChoiceOptions: reduxState.multipleChoiceOptions
  };
};
CardFooter.propTypes = {
  benefits: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  multipleChoiceOptions: PropTypes.array.isRequired,
  benefit: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  store: PropTypes.object
};

export default connect(mapStateToProps)(CardFooter);
