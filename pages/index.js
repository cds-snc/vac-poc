import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../components/button";
import Bookmark from "@material-ui/icons/Bookmark";
import SearchComponent from "../components/search";
import { withI18next } from "../lib/withI18next";
import Layout from "../components/layout";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { getFavouritesUrl } from "../selectors/urls";
import { globalTheme } from "../theme";
import { css } from "react-emotion";
import Container from "../components/container";
import Body from "../components/body";
import Header1 from "../components/header1";

const root = css`
  background-color: white;
  margin: 58px 15px 58px 15px;
  padding: 69px 96px 100px 96px;
  @media only screen and (max-width: ${globalTheme.max.xs}) {
    padding: 35px 48px 50px 48px;
  }
`;
const bookmarkCSS = css`
  font-size: 24px;
  margin-left: -10px;
  margin-right: 10px;
`;
const line = css`
  background: #dfdfdf;
  border: none;
  height: 1px;
  margin: 30px 0;
`;

const columnLeft = css`
  @media only screen and (min-width: ${globalTheme.min.sm}) {
    padding-right: 50px !important;
  }
`;

const columnRight = css`
  @media only screen and (min-width: ${globalTheme.min.sm}) {
    padding-left: 50px !important;
  }
`;

const image = css`
  margin: 40px 40px 0 40px;
  width: 100%;
  @media only screen and (max-width: ${globalTheme.max.sm}) {
    display: none;
  }
`;

const title = css`
  margin-bottom: 46px;
`;

export class App extends Component {
  constructor() {
    super();
  }

  render() {
    const { i18n, t } = this.props;
    let urlGE =
      "guided?section=patronTypeQuestion&lng=" + t("current-language-code");
    let urlBD = "benefits-directory?lng=" + t("current-language-code");
    return (
      <Layout
        i18n={i18n}
        t={t}
        hideNoscript={false}
        showRefreshCache={false}
        title={t("titles.index")}
      >
        <Container>
          <Paper className={root}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Header1 id="heroTitle" className={title}>
                  {t("index.title")}
                </Header1>
              </Grid>
              <Grid item xs={12} md={6} className={columnLeft}>
                <Body>{t("index.ge_prompt")}</Body>
                <Button
                  id="heroGuidedLink"
                  big={true}
                  href={urlGE}
                  arrow={true}
                >
                  {t("index.guided experience")}
                  &nbsp;&nbsp;
                </Button>
                <hr className={line} />
                <Body>{t("index.benefits_prompt")}</Body>
                <Button
                  id="heroBenefitsLink"
                  big={true}
                  secondary={true}
                  href={urlBD}
                >
                  {t("index.all benefits")}
                </Button>
                <hr className={line} />
                <Body>{t("index.favourites_prompt")}</Body>
                <Button
                  id="FavouritesPage"
                  big={true}
                  secondary={true}
                  href={this.props.favouritesUrl}
                >
                  <Bookmark className={bookmarkCSS} />
                  {t("index.your_saved_benefits") +
                    " (" +
                    this.props.favouriteBenefits.length +
                    ")"}
                </Button>
              </Grid>
              <Grid item xs={12} md={6} className={columnRight}>
                <Body>{t("index.search_prompt")}</Body>
                <SearchComponent
                  id="searchComponent"
                  i18n={this.props.i18n}
                  store={this.props.store}
                  t={this.props.t}
                />
                <img
                  src="../static/icon-hand-scrolling-list.svg"
                  alt={t("index.alt_text_1")}
                  className={image}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = (reduxState, props) => {
  return {
    favouriteBenefits: reduxState.favouriteBenefits,
    favouritesUrl: getFavouritesUrl(reduxState, props),
    selectedEligibility: {
      patronType: reduxState.patronType,
      serviceType: reduxState.serviceType,
      statusAndVitals: reduxState.statusAndVitals,
      serviceHealthIssue: reduxState.serviceHealthIssue
    },
    selectedNeeds: reduxState.selectedNeeds
  };
};

App.propTypes = {
  favouriteBenefits: PropTypes.array.isRequired,
  favouritesUrl: PropTypes.string,
  i18n: PropTypes.object.isRequired,
  selectedEligibility: PropTypes.object.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  store: PropTypes.object,
  t: PropTypes.func.isRequired
};

export default withI18next()(connect(mapStateToProps)(App));
