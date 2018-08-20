import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ReactMoment from "react-moment";
import { withI18next } from "../lib/withI18next";
import Layout from "../components/layout";
import { connect } from "react-redux";
import { css } from "react-emotion";
import { globalTheme } from "../theme";

const root = css`
  max-width: ${globalTheme.maxWidth};
  overflow-x: auto;
  margin-bottom: 25px !important;
  margin-top: 25px !important;
  margin: 0 auto;
`;

export class DataValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidUrls: [],
      urlState: undefined
    };
  }

  createData = (name, value, status) => {
    return { name, value, status };
  };

  checkBenefitsFields(b, i) {
    if (
      !(b.vacNameEn && b.vacNameEn != "") ||
      !(b.vacNameFr && b.vacNameFr != "") ||
      !(b.oneLineDescriptionEn && b.oneLineDescriptionEn != "") ||
      !(b.oneLineDescriptionFr && b.oneLineDescriptionFr != "") ||
      !(b.benefitPageEn && b.benefitPageEn != "") ||
      !(b.benefitPageFr && b.benefitPageFr != "")
    ) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  checkAreaOfficesFields(a, i) {
    if (
      !(a.address_en && a.address_en != "") ||
      !(a.address_fr && a.address_fr != "") ||
      !(a.lat && a.lat != "") ||
      !(a.lng && a.lng != "") ||
      !(a.name_en && a.name_en != "") ||
      !(a.name_fr && a.name_fr != "")
    ) {
      return " " + a.id + " (" + (i + 1) + "),";
    }
  }

  checkTranslationsFields(t, i) {
    if (
      !(t.key && t.key != "") ||
      !(t.English && t.English != "") ||
      !(t.French && t.French != "")
    ) {
      return " " + t.id + " (" + (i + 1) + "),";
    }
  }

  checkMissingNeeds(b, i) {
    if (!(b.needs && b.needs != "")) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  checkEligibiltyPaths(b, i) {
    if (!(b.eligibilityPaths && b.eligibilityPaths != "")) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  checkBenefitUrls = async () => {
    this.setState({
      invalidUrls: []
    });

    let checkUrls = async b => {
      await fetch("/checkURL", {
        body: JSON.stringify({ id: b.id }),
        cache: "no-cache",
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
        .then(resp => resp.json())
        .then(resp => {
          let invalidUrls = this.state.invalidUrls;
          if (!resp.passEn) {
            invalidUrls.push(b.benefitPageEn);
          }
          if (!resp.passFr) {
            invalidUrls.push(b.benefitPageFr);
          }
          this.setState({
            invalidUrls: invalidUrls
          });
          if (invalidUrls.length > 0) {
            this.setState({
              urlState: false
            });
          }
          return resp;
        })
        .catch(error => error);
    };
    this.props.benefits.map(await checkUrls);
    this.setState({
      urlState: true
    });
  };

  render() {
    const {
      i18n,
      t,
      benefits,
      eligibilityPaths,
      needs,
      examples,
      translations,
      areaOffices
    } = this.props; // eslint-disable-line no-unused-vars

    const data = [
      this.createData(
        "Size of Benefits Table",
        benefits.length,
        benefits.length > 0 ? true : false
      ),
      this.createData(
        "Size of Eligibility Paths Table",
        eligibilityPaths.length,
        eligibilityPaths.length > 0 ? true : false
      ),
      this.createData(
        "Size of Needs Table",
        needs.length,
        needs.length > 0 ? true : false
      ),
      this.createData(
        "Size of Examples Table",
        examples.length,
        examples.length > 0 ? true : false
      ),
      this.createData(
        "nameTranslationTableSize",
        translations.length,
        translations.length > 0 ? true : false
      ),
      this.createData(
        "nameAreaOfficesSize",
        areaOffices.length,
        areaOffices.length > 0 ? true : false
      ),
      this.createData(
        "Benefits with Empty Fields",
        benefits.map(this.checkBenefitsFields),
        benefits.filter(this.checkBenefitsFields).length == 0 ? true : false
      ),
      this.createData(
        "Benefits Without Needs",
        benefits.map(this.checkMissingNeeds),
        benefits.filter(this.checkMissingNeeds).length == 0 ? true : false
      ),
      this.createData(
        "Benefits not in an Eligibility Path",
        benefits.map(this.checkEligibiltyPaths),
        benefits.filter(this.checkEligibiltyPaths).length == 0 ? true : false
      ),
      this.createData(
        "emptyAreaOffices",
        areaOffices.map(this.checkAreaOfficesFields),
        areaOffices.filter(this.checkAreaOfficesFields).length == 0
          ? true
          : false
      ),
      this.createData(
        "emptyTranslations",
        translations.map(this.checkTranslationsFields),
        translations.filter(this.checkTranslationsFields).length == 0
          ? true
          : false
      ),
      this.createData(
        "validateURLs",
        this.state.invalidUrls.map((url, i) => {
          return (
            <div key={i}>
              <a target="_blank" rel="noopener noreferrer" href={url}>
                {url}
              </a>
            </div>
          );
        }),
        this.state.urlState
      )
    ];

    return (
      <Layout
        title={t("dv.pageTitle")}
        i18n={i18n}
        t={t}
        hideNoscript={true}
        showRefreshCache={true}
      >
        <Paper className={root}>
          <p style={{ padding: "10px" }}>
            {t("dv.last_cache_update")}
            :&nbsp;
            <ReactMoment format="llll">{this.props.timestamp}</ReactMoment>
          </p>
        </Paper>
        <Paper className={root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("dv.status")}</TableCell>
                <TableCell>{t("dv.name")}</TableCell>
                <TableCell>{t("dv.value")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((n, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell
                      style={{
                        color: n.status ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {n.status !== undefined ? (
                        t("dv." + (n.status ? "Pass" : "Fail"))
                      ) : (
                        <Button
                          color="primary"
                          variant="raised"
                          onClick={() => this.checkBenefitUrls()}
                        >
                          {t("dv.validate")}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{t("dv." + n.name)}</TableCell>
                    <TableCell>{n.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    areaOffices: state.areaOffices,
    benefits: state.benefits,
    eligibilityPaths: state.eligibilityPaths,
    examples: state.examples,
    needs: state.needs,
    timestamp: state.timestamp,
    translations: state.translations
  };
};

DataValidation.propTypes = {
  benefits: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  needs: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  timestamp: PropTypes.number.isRequired,
  translations: PropTypes.array.isRequired,
  areaOffices: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(withI18next()(DataValidation));
