import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { withI18next } from "../lib/withI18next";
import { redux2i18n } from "../utils/redux2i18n";

export class Print extends Component {
  componentWillMount() {
    redux2i18n(this.props.i18n, this.props.text);
  }

  componentDidMount() {
    window.print();
  }

  countString = (filteredBenefits, benefits, t) => {
    switch (true) {
      case filteredBenefits.length === benefits.length:
        return t("B3.All benefits to consider");
      case filteredBenefits.length == 0:
        return t("B3.No benefits");
      case filteredBenefits.length == 1:
        return t("B3.One benefit");
      default:
        return t("B3.x benefits to consider", { x: filteredBenefits.length });
    }
  };

  render() {
    const { i18n, t, benefits, needs } = this.props; // eslint-disable-line no-unused-vars

    const query = this.props.url.query;
    const filteredBenefitsIDs =
      Object.keys(query).indexOf("benefits") > -1
        ? query.benefits.split(",")
        : [];
    const filteredBenefits = benefits.filter(
      x => filteredBenefitsIDs.indexOf(x.id) > -1
    );

    const selectedNeedsIDs =
      Object.keys(query).indexOf("needs") > -1 ? query.needs.split(",") : [];
    const selectedNeeds = needs.filter(
      x => selectedNeedsIDs.indexOf(x.id) > -1
    );
    return (
      <div style={{ padding: 12 }} className="allBenefitsList">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="title">
              {t("B3.Filter by eligibility")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div>
              <div className="eligibilityListItem">
                {t("B3.Benefits for")}: <b>{t(query["patronType"])}</b>
              </div>
              <div>
                {t("B3.ServiceType")}: <b>{t(query["serviceType"])}</b>
              </div>
              <div>
                {t("B3.serviceStatus")}: <b>{t(query["statusAndVitals"])}</b>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="title">{t("Filter by need")}</Typography>
          </Grid>

          <Grid item xs={12}>
            <div className="needsList">
              {selectedNeeds.map((n, i) => (
                <div key={i} className="needsListItem">
                  -<b>
                    {t("current-language-code") == "en" ? n.nameEn : n.nameFr}
                  </b>
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="title">
              {this.countString(filteredBenefits, benefits, t)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {filteredBenefits.map((b, i) => {
              return (
                <div
                  key={i}
                  style={{ marginBottom: "15px" }}
                  className="benefitsListItem"
                >
                  <div>
                    <b>
                      {t("current-language-code") == "en"
                        ? b.vacNameEn
                        : b.vacNameFr}
                    </b>
                  </div>
                  <div>
                    {t("current-language-code") == "en"
                      ? b.oneLineDescriptionEn
                      : b.oneLineDescriptionFr}
                  </div>
                </div>
              );
            })}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    benefits: state.benefits,
    examples: state.examples,
    sortByValue: state.sortByValue,
    eligibilityPaths: state.eligibilityPaths,
    needs: state.needs,
    text: state.text
  };
};

Print.propTypes = {
  benefits: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  needs: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  sortByValue: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  text: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(withI18next()(Print));
