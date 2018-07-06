import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, Button, Grid } from "@material-ui/core";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FavouriteButton from "./favourite_button";

import { logEvent } from "../utils/analytics";
import { connect } from "react-redux";

const styles = theme => ({
  needsTag: {
    marginLeft: 2 * theme.spacing.unit,
    backgroundColor: "#364150",
    color: "white",
    borderRadius: 0,
    display: "inline-flex",
    padding: "2px 4px"
  },
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 500
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
    },
    userSelect: "inherit"
  },
  bullet: {
    paddingBottom: "1em"
  },
  description: {
    paddingTop: "1em"
  },
  cardDescriptionText: {
    fontSize: "20px",
    fontWeight: 400,
    padding: "15px 0px"
  }
});

export class EmbeddedBenefitCard extends Component {
  state = {
    open: false
  };

  logExit = url => {
    logEvent("Exit", url);
  };

  toggleOpenState = () => {
    this.setState(previousState => {
      return { ...previousState, open: !previousState.open };
    });
  };

  componentDidMount() {
    this.props.onRef(this);
    const needsMet = this.getNeedsMet();
    if (needsMet.length > 0) {
      this.setState({ open: true });
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  getNeedsMet() {
    return this.props.benefit.needs
      ? this.props.needs.filter(
          need =>
            this.props.benefit.needs.indexOf(need.id) > -1 &&
            this.props.selectedNeeds[need.id]
        )
      : [];
  }

  render() {
    const { t, classes, benefit } = this.props;
    const language = t("current-language-code");
    const needsMet = this.getNeedsMet();

    return (
      <ExpansionPanel
        className={
          this.state.open
            ? classes.ExpansionPanelOpen
            : classes.ExpansionPanelClosed
        }
        expanded={this.state.open}
      >
        <ExpansionPanelSummary
          expandIcon={this.state.open ? <RemoveIcon /> : <AddIcon />}
          onClick={() => this.toggleOpenState()}
          className={classes.ExpansionPanelSummary}
        >
          <div className={classes.heading}>
            {this.props.showFavourite ? (
              <FavouriteButton
                benefit={benefit}
                toggleOpenState={this.toggleOpenState}
                store={this.props.store}
              />
            ) : (
              ""
            )}
            {language === "en" ? benefit.vacNameEn : benefit.vacNameFr}
            <div style={{ display: "inline-flex" }}>
              {needsMet.map(need => (
                <div key={benefit.id + need.id} className={classes.needsTag}>
                  {this.props.t("current-language-code") === "en"
                    ? need.nameEn
                    : need.nameFr}
                </div>
              ))}
            </div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography
                variant="title"
                className={classnames(classes.cardDescriptionText)}
              >
                {language === "en"
                  ? benefit.oneLineDescriptionEn
                  : benefit.oneLineDescriptionFr}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                target="_blank"
                variant="raised"
                onClick={() =>
                  this.logExit(
                    language === "en"
                      ? benefit.benefitPageEn
                      : benefit.benefitPageFr
                  )
                }
                href={
                  language === "en"
                    ? benefit.benefitPageEn
                    : benefit.benefitPageFr
                }
              >
                {t("Find out more")}
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    needs: reduxState.needs,
    selectedNeeds: reduxState.selectedNeeds
  };
};

EmbeddedBenefitCard.propTypes = {
  benefit: PropTypes.object.isRequired,
  needs: PropTypes.array.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  showFavourite: PropTypes.bool.isRequired,
  store: PropTypes.object
};

export default connect(mapStateToProps)(
  withStyles(styles)(EmbeddedBenefitCard)
);
