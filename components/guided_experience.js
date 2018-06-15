import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "material-ui";
import { withStyles } from "material-ui/styles/index";
import MobileStepper from "material-ui/MobileStepper";
import Button from "material-ui/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import GuidedExperienceProfile from "../components/guided_experience_profile";
import GuidedExperienceNeeds from "../components/guided_experience_needs";

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

export class GuidedExperience extends Component {
  render() {
    const { t, classes } = this.props;

    return (
      <div>
        {this.props.children}
        <Grid
          container
          justify="center"
          spacing={24}
          style={{ marginTop: "1em" }}
        >
          <Grid item sm={4} xs={12}>
            <p style={{ textAlign: "center", fontSize: "1em" }}>
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

        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={this.props.stepNumber}
          className={classes.root}
          nextButton={
            <Button
              size="small"
              onClick={() => this.props.setSection(this.props.nextSection)}
            >
              {t("next")}
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={() => this.props.setSection(this.props.prevSection)}
              disabled={this.props.stepNumber === 0}
            >
              <KeyboardArrowLeft />
              {t("back")}
            </Button>
          }
        />
      </div>
    );
  }
}

GuidedExperience.propTypes = {
  id: PropTypes.string,
  classes: PropTypes.object,
  nextSection: PropTypes.string,
  prevSection: PropTypes.string,
  t: PropTypes.func,
  setSection: PropTypes.func,
  stepNumber: PropTypes.number,
  children: PropTypes.object
};

export default withStyles(styles)(GuidedExperience);
