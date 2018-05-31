import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, Button, Grid } from "material-ui";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";
import ExpansionPanel from "material-ui/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "material-ui/ExpansionPanel/ExpansionPanelSummary";
import ExpansionPanelDetails from "material-ui/ExpansionPanel/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
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
  bullet: {
    paddingBottom: "1em"
  },
  description: {
    paddingTop: "1em"
  }
});

export class EmbeddedBenefitCard extends Component {
  state = {
    open: false
  };

  toggleState = () => {
    let newState = !this.state.open;
    this.setState({ open: newState });
  };

  render() {
    const { t, classes, benefit } = this.props;
    return (
      <ExpansionPanel
        className={
          this.state.open
            ? classes.ExpansionPanelOpen
            : classes.ExpansionPanelClosed
        }
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => this.toggleState()}
          className={classes.ExpansionPanelSummary}
        >
          <Typography className={classnames(classes.heading)}>
            {t("current-language-code") === "en"
              ? benefit.vacNameEn
              : benefit.vacNameFr}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography
                variant="title"
                className={classnames(classes.description)}
              >
                {t("Benefit Description")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title">{t("Available to")}:</Typography>

              <ul>
                <li className={classnames(classes.bullet)}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </li>
                <li className={classnames(classes.bullet)}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                target="_blank"
                variant="raised"
                href={
                  this.props.t("current-language-code") === "en"
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

EmbeddedBenefitCard.propTypes = {
  benefit: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.function
};

export default withStyles(styles)(EmbeddedBenefitCard);
