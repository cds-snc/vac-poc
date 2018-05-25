// @flow

import React, { Component } from "react";
import { Grid } from "material-ui";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";
import red from "material-ui/colors/red";
import Typography from "material-ui/Typography";

import BenefitCard from "../components/benefit_cards";
import FilterSelector from "../components/filter_selector";
import NeedsSelector from "./needs_selector";

type Props = {
  id: string,
  t: mixed,
  benefits: mixed,
  eligibilityPaths: mixed,
  needs: mixed,
  selectedEligibility: mixed,
  selectedNeeds: mixed,
  toggleSelectedEligibility: mixed,
  setSelectedNeeds: mixed,
  classes: mixed
};

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

export class BB extends Component<Props> {
  props: Props;

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
    let benefitIDs = [];
    eligibilityPaths.forEach(ep => {
      if (this.eligibilityMatch(ep, selectedEligibility)) {
        benefitIDs = benefitIDs.concat(ep.benefits);
      }
    });

    if (Object.keys(selectedNeeds).length > 0) {
      let benefitIdsForSelectedNeeds = [];
      Object.keys(selectedNeeds).forEach(id => {
        const need = needs.filter(n => n.id === id)[0];
        benefitIdsForSelectedNeeds = benefitIdsForSelectedNeeds.concat(
          need.benefits
        );
      });
      benefitIDs = benefitIDs.filter(
        id => benefitIdsForSelectedNeeds.indexOf(id) > -1
      );
    }
    const benefitIDSet = new Set(benefitIDs);
    return benefits.filter(benefit => benefitIDSet.has(benefit.id));
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

    // check all boxes
    serviceTypes.forEach(x => {
      this.props.toggleSelectedEligibility("serviceType", x.id);
    });
    patronTypes.forEach(x => {
      this.props.toggleSelectedEligibility("patronType", x.id);
    });
    serviceStatuses.forEach(x => {
      this.props.toggleSelectedEligibility("serviceStatus", x.id);
    });
    servicePersonVitalStatuses.forEach(x => {
      this.props.toggleSelectedEligibility("servicePersonVitalStatus", x.id);
    });

    const { t, classes } = this.props; // eslint-disable-line no-unused-vars

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
                    <FilterSelector
                      id="patronTypeFilter"
                      t={t}
                      legend={"B3.PatronType"}
                      filters={patronTypes}
                      selectedFilters={
                        this.props.selectedEligibility.patronType
                      }
                      handleChange={id =>
                        this.props.toggleSelectedEligibility("patronType", id)
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FilterSelector
                      id="serviceTypeFilter"
                      t={t}
                      legend={"B3.ServiceType"}
                      filters={serviceTypes}
                      selectedFilters={
                        this.props.selectedEligibility.serviceType
                      }
                      handleChange={id =>
                        this.props.toggleSelectedEligibility("serviceType", id)
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FilterSelector
                      id="serviceStatusFilter"
                      t={t}
                      legend={"B3.serviceStatus"}
                      filters={serviceStatuses}
                      selectedFilters={
                        this.props.selectedEligibility.serviceStatus
                      }
                      handleChange={id =>
                        this.props.toggleSelectedEligibility(
                          "serviceStatus",
                          id
                        )
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FilterSelector
                      id="servicePersonVitalStatusFilter"
                      t={t}
                      legend={"B3.servicePersonVitalStatus"}
                      filters={servicePersonVitalStatuses}
                      selectedFilters={
                        this.props.selectedEligibility.servicePersonVitalStatus
                      }
                      handleChange={id =>
                        this.props.toggleSelectedEligibility(
                          "servicePersonVitalStatus",
                          id
                        )
                      }
                    />
                  </Grid>
                </Collapse>

                <Grid item xs={12}>
                  <p style={{ textAlign: "left", fontSize: "1em" }}>
                    <a
                      className="AllBenefits"
                      href={"all-benefits?lng=" + t("current-language-code")}
                      target="_blank"
                    >
                      {t("Show All Benefits")}
                    </a>
                  </p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={9} sm={7} xs={12}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <NeedsSelector
                    t={t}
                    needs={this.props.needs}
                    handleChange={this.props.setSelectedNeeds}
                  />
                </Grid>

                {filteredBenefits.map(
                  (benefit, i) =>
                    true || benefit.availableIndependently === "Independant" ? ( // eslint-disable-line no-constant-condition
                      <BenefitCard
                        id={"bc" + i}
                        className="BenefitCards"
                        benefit={benefit}
                        allBenefits={this.props.benefits}
                        t={this.props.t}
                        key={i}
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

export default withStyles(styles)(BB);
