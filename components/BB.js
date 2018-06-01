import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "material-ui";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";
import red from "material-ui/colors/red";
import Typography from "material-ui/Typography";
import "babel-polyfill/dist/polyfill";

import BenefitCard from "../components/benefit_cards";
import DropDownSelector from "../components/dropdown_selector";
import NeedsSelector from "./needs_selector";
import i18next from "i18next";

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

export class BB extends Component {
  state = {
    expanded: true
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  eligibilityMatch = (path, selected) => {
    let matches = true;
    [
      "serviceType",
      "patronType",
      "serviceStatus",
      "servicePersonVitalStatus"
    ].forEach(criteria => {
      if (
        Object.keys(selected[criteria]).length &&
        path[criteria] !== "na" &&
        !selected[criteria].hasOwnProperty(path[criteria])
      ) {
        matches = false;
      }
    });
    return matches;
  };

  filteredBenefits = (
    benefits,
    eligibilityPaths,
    selectedEligibility,
    needs,
    selectedNeeds
  ) => {
    if (benefits.length === 0) {
      return benefits;
    }

    // find benefits that match
    let benefitIdsForProfile = [];
    eligibilityPaths.forEach(ep => {
      if (this.eligibilityMatch(ep, selectedEligibility)) {
        benefitIdsForProfile = benefitIdsForProfile.concat(ep.benefits);
      }
    });
    let benefitIdsForSelectedNeeds = [];
    if (Object.keys(selectedNeeds).length > 0) {
      Object.keys(selectedNeeds).forEach(id => {
        const need = needs.filter(n => n.id === id)[0];
        benefitIdsForSelectedNeeds = benefitIdsForSelectedNeeds.concat(
          need.benefits
        );
      });
    } else {
      benefitIdsForSelectedNeeds = benefits.map(b => b.id);
    }
    let matchingBenefitIds = benefitIdsForProfile.filter(
      id => benefitIdsForSelectedNeeds.indexOf(id) > -1
    );

    // find benefits with matching children
    const benefitIdsWithMatchingChildren = benefits
      .filter(
        b =>
          b.childBenefits &&
          b.childBenefits.filter(cbID => matchingBenefitIds.indexOf(cbID) > -1)
            .length > 0
      )
      .map(b => b.id);

    const benefitIDsToShow = matchingBenefitIds.concat(
      benefitIdsWithMatchingChildren
    );
    let benefitsToShow = benefits.filter(
      b => benefitIDsToShow.indexOf(b.id) > -1
    );

    // if a benefit is already shown as a child, only show it (as a parent card) if it's available independently
    let childrenIDsShown = [];
    benefitsToShow.forEach(b => {
      childrenIDsShown = childrenIDsShown.concat(b.childBenefits);
    });
    benefitsToShow = benefitsToShow.filter(
      b =>
        b.availableIndependently === "Independent" ||
        childrenIDsShown.indexOf(b.id) < 0
    );

    return benefitsToShow;
  };

  sortBenefits = (filteredBenefits, language) => {
    filteredBenefits.forEach(b => {
      if (b.sortingPriority === undefined) {
        b.sortingPriority = "low";
      }
      b.sortingNumber = { high: 1, medium: 2, low: 3 }[b.sortingPriority];
    });

    let sorting_fn = (a, b) => {
      if (a.sortingNumber === b.sortingNumber) {
        // sort alphabetically
        let vacName = language === "en" ? "vacNameEn" : "vacNameFr";
        let nameA = a[vacName].toUpperCase();
        let nameB = b[vacName].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      // ascending numeric sort
      return a.sortingNumber - b.sortingNumber;
    };
    return filteredBenefits.sort(sorting_fn);
  };

  render() {
    let serviceTypes = Array.from(
      new Set(this.props.eligibilityPaths.map(ep => ep.serviceType))
    )
      .filter(st => st !== "na")
      .map(st => {
        return { id: st, name_en: st, name_fr: "FF " + st };
      });

    const patronTypes = Array.from(
      new Set(this.props.eligibilityPaths.map(ep => ep.patronType))
    )
      .filter(st => st !== "na")
      .map(st => {
        return { id: st, name_en: st, name_fr: "FF " + st };
      });

    let serviceStatuses = Array.from(
      new Set(this.props.eligibilityPaths.map(ep => ep.serviceStatus))
    )
      .filter(st => st !== "na")
      .concat(["still serving"])
      .map(st => {
        return { id: st, name_en: st, name_fr: "FF " + st };
      });

    let servicePersonVitalStatuses = Array.from(
      new Set(
        this.props.eligibilityPaths.map(ep => ep.servicePersonVitalStatus)
      )
    )
      .filter(st => st !== "na")
      .map(st => {
        return { id: st, name_en: st, name_fr: "FF " + st };
      });

    const { t, classes } = this.props; // eslint-disable-line no-unused-vars
    this.sortBenefits(
      this.props.benefits,
      this.props.t("current-language-code")
    );
    const filteredBenefits = this.filteredBenefits(
      this.props.benefits,
      this.props.eligibilityPaths,
      this.props.selectedEligibility,
      this.props.needs,
      this.props.selectedNeeds
    );

    return (
      <div id={this.props.id}>
        <div style={{ padding: 12 }}>
          <Grid container spacing={24}>
            <Grid item md={3} sm={5} xs={12}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Typography variant="title">
                    {t("B3.Filter Benefits")}
                    <IconButton
                      id="expandButton"
                      className={classnames(classes.expand, {
                        [classes.expandOpen]: this.state.expanded
                      })}
                      onClick={this.handleExpandClick}
                      aria-expanded={this.state.expanded}
                      aria-label="Show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Typography>
                </Grid>

                <Collapse
                  id="collapseBlock"
                  in={this.state.expanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid item xs={12}>
                    <DropDownSelector
                      id="patronTypeFilter"
                      t={t}
                      legend={"B3.PatronType"}
                      filters={patronTypes}
                      selectedFilters={
                        this.props.selectedEligibility.patronType
                      }
                      setUserProfile={id =>
                        this.props.setUserProfile("patronType", id)
                      }
                      isDisabled={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DropDownSelector
                      id="serviceTypeFilter"
                      t={t}
                      legend={"B3.ServiceType"}
                      filters={serviceTypes}
                      selectedFilters={
                        this.props.selectedEligibility.serviceType
                      }
                      setUserProfile={id =>
                        this.props.setUserProfile("serviceType", id)
                      }
                      isDisabled={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DropDownSelector
                      id="serviceStatusFilter"
                      t={t}
                      legend={"B3.serviceStatus"}
                      filters={serviceStatuses}
                      selectedFilters={
                        this.props.selectedEligibility.serviceStatus
                      }
                      setUserProfile={id =>
                        this.props.setUserProfile("serviceStatus", id)
                      }
                      isDisabled={
                        !this.props.selectedEligibility.serviceType.hasOwnProperty(
                          "CAF"
                        )
                      }
                      disabledString={t("disabled-serviceStatusFilter")}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DropDownSelector
                      id="servicePersonVitalStatusFilter"
                      t={t}
                      legend={"B3.servicePersonVitalStatus"}
                      filters={servicePersonVitalStatuses}
                      selectedFilters={
                        this.props.selectedEligibility.servicePersonVitalStatus
                      }
                      setUserProfile={id =>
                        this.props.setUserProfile(
                          "servicePersonVitalStatus",
                          id
                        )
                      }
                      isDisabled={
                        !this.props.selectedEligibility.patronType.hasOwnProperty(
                          "family"
                        )
                      }
                      disabledString={t(
                        "disabled-servicePersonVitalStatusFilter"
                      )}
                    />
                  </Grid>
                  <br />
                </Collapse>
                <Grid item xs={12}>
                  <Button
                    id="ClearFilters"
                    variant="raised"
                    onClick={() => {
                      this.props.clearFilters();
                    }}
                  >
                    {t("Show All Benefits")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={9} sm={7} xs={12}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <NeedsSelector
                    t={t}
                    needs={this.props.needs}
                    selectedNeeds={this.props.selectedNeeds}
                    handleChange={this.props.setSelectedNeeds}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className="BenefitsCounter">
                    {i18next.t("Showing x of y benefits", {
                      x: filteredBenefits.length,
                      y: this.props.benefits.length
                    })}
                  </Typography>
                </Grid>
                {filteredBenefits.map(
                  (benefit, i) =>
                    true || benefit.availableIndependently === "Independant" ? ( // eslint-disable-line no-constant-condition
                      <BenefitCard
                        id={"bc" + i}
                        className="BenefitCards"
                        benefit={benefit}
                        examples={this.props.examples}
                        allBenefits={this.props.benefits}
                        t={this.props.t}
                        key={benefit.id}
                      />
                    ) : (
                      ""
                    )
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

BB.propTypes = {
  benefits: PropTypes.array,
  classes: PropTypes.object,
  clearFilters: PropTypes.func,
  eligibilityPaths: PropTypes.array,
  examples: PropTypes.array,
  id: PropTypes.string,
  needs: PropTypes.array,
  selectedEligibility: PropTypes.object,
  selectedNeeds: PropTypes.object,
  setSelectedNeeds: PropTypes.func,
  setUserProfile: PropTypes.func,
  t: PropTypes.func,
  toggleSelectedEligibility: PropTypes.func
};

export default withStyles(styles)(BB);
