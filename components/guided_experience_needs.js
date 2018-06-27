import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@material-ui/core/";
import { withStyles } from "@material-ui/core/styles/index";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    padding: "15px 15px 30px 15px"
  },
  need: {
    margin: theme.spacing.unit,
    backgroundColor: "#F5F5F5",
    textTransform: "none",
    textAlign: "left"
  },
  needSelected: {
    margin: theme.spacing.unit,
    backgroundColor: "#364150",
    color: "white",
    textTransform: "none",
    textAlign: "left"
  }
});

export class GuidedExperienceNeeds extends Component {
  handleClick = id => {
    let newSelectedNeeds = this.props.selectedNeeds;
    if (newSelectedNeeds.hasOwnProperty(id)) {
      delete newSelectedNeeds[id];
    } else {
      newSelectedNeeds[id] = id;
    }
    this.props.setSelectedNeeds(Object.keys(newSelectedNeeds));
  };

  render() {
    const { t, classes } = this.props; // eslint-disable-line no-unused-vars

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {this.props.needs.map(need => (
            <Button
              disableRipple={true}
              key={need.id}
              variant="raised"
              onClick={() => this.handleClick(need.id)}
              value={need.id}
              isdownstatus={
                this.props.selectedNeeds.hasOwnProperty(need.id) ? "down" : "up"
              }
              className={
                this.props.selectedNeeds.hasOwnProperty(need.id)
                  ? classes.needSelected
                  : classes.need
              }
            >
              {t("current-language-code") === "en" ? need.nameEn : need.nameFr}
            </Button>
          ))}
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    needs: state.eligibilityPaths
  };
};

GuidedExperienceNeeds.propTypes = {
  classes: PropTypes.object.isRequired,
  needs: PropTypes.array.isRequired,
  selectedNeeds: PropTypes.object.isRequired,
  setSelectedNeeds: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(
  withStyles(styles)(GuidedExperienceNeeds)
);
