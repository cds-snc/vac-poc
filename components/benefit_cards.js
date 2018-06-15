import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, Button } from "material-ui";
import { withStyles } from "material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import EmbeddedBenefitCard from "./embedded_benefit_card";
import ExpansionPanel from "material-ui/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "material-ui/ExpansionPanel/ExpansionPanelSummary";
import ExpansionPanelDetails from "material-ui/ExpansionPanel/ExpansionPanelDetails";

import { logEvent } from "../utils/analytics";

const styles = () => ({
  button: {
    marginTop: "30px"
  },
  cardDescriptionText: {
    fontSize: "20px",
    fontWeight: 400,
    padding: "15px 0px"
  },
  collapse: {
    paddingTop: "25px"
  },
  root: {
    width: "100%"
  },
  ExpansionPanelClosed: {
    borderLeft: "5px solid"
  },
  ExpansionPanelOpen: {
    borderLeft: "5px solid #808080"
  },
  ExpansionPanelSummary: {
    "&[aria-expanded*=true]": {
      backgroundColor: "#f8f8f8"
    }
  },
  ChildBenefitDesc: {
    paddingBottom: "30px"
  },
  children: {
    width: "100%"
  },
  ExampleDesc: {
    paddingBottom: "10px"
  },
  examples: {
    width: "100%",
    marginLeft: "20px"
  }
});

export class BenefitCard extends Component {
  state = {
    open: false
  };
  children = [];
  logExit = url => {
    logEvent("Exit", url);
  };

  toggleBookmark = id => {
    this.setState((previousState, _) => {
      return { ...previousState, open: !previousState.open };
    });
    this.props.toggleBookmark(id);
  };

  toggleOpenState = () => {
    this.setState((previousState, _) => {
      return { ...previousState, open: !previousState.open };
    });
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const benefit = this.props.benefit;
    const { t, classes } = this.props;

    const childBenefits = benefit.childBenefits
      ? this.props.allBenefits.filter(
          ab => benefit.childBenefits.indexOf(ab.id) > -1
        )
      : [];

    const veteranBenefits = childBenefits.filter(
      ab => this.props.veteranBenefitIds.indexOf(ab.id) > -1
    );
    const familyBenefits = childBenefits.filter(
      ab => this.props.familyBenefitIds.indexOf(ab.id) > -1
    );

    const examples =
      typeof benefit.examples !== "undefined" &&
      typeof this.props.examples !== "undefined"
        ? this.props.examples.filter(ex => benefit.examples.indexOf(ex.id) > -1)
        : [];

    return (
      <Grid item xs={12}>
        <div className={classes.root}>
          <ExpansionPanel
            className={
              this.state.open
                ? classes.ExpansionPanelOpen
                : classes.ExpansionPanelClosed
            }
            expanded={this.state.open}
          >
            <ExpansionPanelSummary
              className={classes.ExpansionPanelSummary}
              expandIcon={this.state.open ? <RemoveIcon /> : <AddIcon />}
              onClick={() => this.toggleOpenState()}
            >
              <div>
                <Typography component="p" className="benefitName">
                  {this.props.t("current-language-code") === "en"
                    ? benefit.vacNameEn
                    : benefit.vacNameFr}
                </Typography>

                <Button
                  variant="raised"
                  size="small"
                  onClick={() => this.toggleBookmark(benefit.id)}
                >
                  {this.props.bookmarkedBenefits.indexOf(benefit.id) > -1
                    ? "Remove bookmark"
                    : "Bookmark"}
                </Button>

                <Typography
                  className={"cardDescription " + classes.cardDescriptionText}
                >
                  {this.props.t("current-language-code") === "en"
                    ? benefit.oneLineDescriptionEn
                    : benefit.oneLineDescriptionFr}
                </Typography>
              </div>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails timeout="auto" className={classes.collapse}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  {examples.length > 0 ? (
                    <Typography className={classes.ExampleDesc}>
                      {t("examples") + ":"}
                    </Typography>
                  ) : (
                    ""
                  )}
                  <Typography className={classes.examples}>
                    {examples.map(ex => {
                      return (
                        <li key={ex.id}>
                          {this.props.t("current-language-code") === "en"
                            ? ex.nameEn
                            : ex.nameFr}{" "}
                        </li>
                      );
                    })}
                  </Typography>

                  <Button
                    className={classes.button}
                    target="_blank"
                    variant="raised"
                    onClick={() =>
                      this.logExit(
                        this.props.t("current-language-code") === "en"
                          ? benefit.benefitPageEn
                          : benefit.benefitPageFr
                      )
                    }
                    href={
                      this.props.t("current-language-code") === "en"
                        ? benefit.benefitPageEn
                        : benefit.benefitPageFr
                    }
                  >
                    {this.props.t("Find out more")}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {veteranBenefits.length > 0 ? (
                    <div className={classes.children}>
                      <Typography className={classes.ChildBenefitDesc}>
                        {t("Veteran child benefits")}:
                      </Typography>
                      <div>
                        {veteranBenefits.map((cb, i) => (
                          <EmbeddedBenefitCard
                            id={"cb" + i}
                            benefit={cb}
                            t={this.props.t}
                            key={cb.id}
                            onRef={ref => this.children.push(ref)}
                          />
                        ))}
                        <br />
                        <br />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {familyBenefits.length > 0 ? (
                    <div className={classes.children}>
                      <Typography className={classes.ChildBenefitDesc}>
                        {t("Family child benefits")}:
                      </Typography>
                      <div>
                        {familyBenefits.map((cb, i) => (
                          <EmbeddedBenefitCard
                            id={"cb" + i}
                            className="BenefitCards"
                            benefit={cb}
                            t={this.props.t}
                            key={cb.id}
                            onRef={ref => this.children.push(ref)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Grid>
    );
  }
}

BenefitCard.propTypes = {
  allBenefits: PropTypes.array,
  veteranBenefitIds: PropTypes.array,
  familyBenefitIds: PropTypes.array,
  benefit: PropTypes.object,
  classes: PropTypes.object,
  examples: PropTypes.array,
  t: PropTypes.func,
  onRef: PropTypes.func,
  bookmarkedBenefits: PropTypes.array,
  toggleBookmark: PropTypes.func
};

export default withStyles(styles)(BenefitCard);
