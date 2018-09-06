import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import "babel-polyfill/dist/polyfill";
import BenefitList from "../components/benefit_list";
import { connect } from "react-redux";
import { getPrintUrl } from "../selectors/urls";
import Bookmark from "@material-ui/icons/BookmarkBorder";
import Link from "next/link";
import { css } from "react-emotion";
import Container from "../components/container";
import Header1 from "../components/header1";
import Header2 from "../components/header2";
import HeaderAnchorLink from "../components/header_anchor_link";
import Body from "../components/body";

const backLink = css`
  margin-bottom: 15px;
`;
const bookmarkCSS = css`
  font-size: 70px;
`;
const contactUsTitle = css`
  margin: 20px 0;
`;
const emptyList = css`
  margin-top: 20px;
  text-align: center;
`;
const outerGrid = css`
  padding-left: 16px;
  padding-right: 16px;
`;
const topMatter = css`
  margin-bottom: 25px !important;
  margin-top: 30px !important;
`;

export class Favourites extends Component {
  state = {
    enIdx: null,
    frIdx: null
  };

  filterBenefits = (benefits, favouriteBenefits) => {
    if (benefits.length === 0) {
      return benefits;
    }
    return benefits.filter(b => favouriteBenefits.indexOf(b.id) > -1);
  };

  get_link = page => {
    return (
      page +
      "?" +
      Object.entries(this.props.url.query)
        .filter(x => x[0] !== "" && x[1] !== "")
        .map(x => {
          return x[0] + "=" + x[1];
        })
        .join("&")
    );
  };

  render() {
    const { t } = this.props; // eslint-disable-line no-unused-vars

    const filteredBenefits = this.filterBenefits(
      this.props.benefits,
      this.props.favouriteBenefits
    );

    return (
      <Container id="favourites">
        <Grid className={outerGrid} container spacing={24}>
          <Grid item xs={12} className={topMatter}>
            <HeaderAnchorLink
              id="backButton"
              className={backLink}
              href={this.get_link("benefits-directory")}
              icon="arrowBack"
            >
              {t("favourites.back_link")}
            </HeaderAnchorLink>

            <Header1 className={"BenefitsCounter"}>
              {t("favourites.saved_benefits", { x: filteredBenefits.length })}
            </Header1>
          </Grid>
          <Grid item md={8} xs={12}>
            <Grid container spacing={24}>
              <BenefitList
                t={t}
                filteredBenefits={filteredBenefits}
                sortByValue={this.props.sortBy}
                showFavourites={true}
                searchString=""
                store={this.props.store}
                favouriteBenefits={this.props.favouriteBenefits}
              />
            </Grid>
            {filteredBenefits.length == 0 ? (
              <Body className={emptyList}>
                <Bookmark className={bookmarkCSS} />
                <br />
                {t("favourites.help")}
              </Body>
            ) : (
              ""
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <HeaderAnchorLink
              href={this.props.printUrl}
              target="print_page"
              id="printButton"
              icon="print"
            >
              &nbsp; {t("Print")}
            </HeaderAnchorLink>

            <Header2 className={contactUsTitle}>
              {t("favourites.contact_us")}
            </Header2>
            <p>
              <Link href={this.get_link("map")}>
                <a>{t("favourites.visit_prompt")}</a>
              </Link>
            </p>

            <Body>{t("favourites.print_instructions")}</Body>

            <hr />

            <p>
              <a href={"tel:" + t("contact.phone")}>{t("contact.phone")}</a>
            </p>

            <Body>{t("favourites.call_time")}</Body>

            <hr />

            <p>
              <a href={"mailto:" + t("contact.email")}>{t("contact.email")}</a>
            </p>

            <Body>{t("favourites.email_disclaimer")}</Body>

            <hr />

            <Header2 className={contactUsTitle}>
              {t("favourites.apply_prompt")}
            </Header2>

            <Body>
              <a
                href={t("contact.my_vac_link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("favourites.login_link")}
              </a>
              &nbsp;
              {t("favourites.login_prompt")}
            </Body>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (reduxState, props) => {
  return {
    benefits: reduxState.benefits,
    eligibilityPaths: reduxState.eligibilityPaths,
    needs: reduxState.needs,
    examples: reduxState.examples,
    printUrl: getPrintUrl(reduxState, props, { fromFavourites: true }),
    selectedEligibility: {
      patronType: reduxState.patronType,
      serviceType: reduxState.serviceType,
      statusAndVitals: reduxState.statusAndVitals
    },
    selectedNeeds: reduxState.selectedNeeds,
    selectedAreaOffice: reduxState.selectedAreaOffice,
    sortBy: reduxState.sortBy,
    closestAreaOffice: reduxState.closestAreaOffice
  };
};

Favourites.propTypes = {
  benefits: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  needs: PropTypes.array.isRequired,
  printUrl: PropTypes.string,
  t: PropTypes.func.isRequired,
  favouriteBenefits: PropTypes.array.isRequired,
  selectedEligibility: PropTypes.object.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  sortBy: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  store: PropTypes.object,
  selectedAreaOffice: PropTypes.object.isRequired,
  closestAreaOffice: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Favourites);
