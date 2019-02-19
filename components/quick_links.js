import React, { Component } from "react";
import PropTypes from "prop-types";
import HeaderButton from "./header_button";
import { css } from "emotion";
import { Grid } from "@material-ui/core";
import { globalTheme } from "../theme";

const greyBox = css`
  background-color: ${globalTheme.colour.paleGreyTwo};
  padding: 30px;
`;
const leftDiv = css`
  @media only screen and (max-width: ${globalTheme.max.xs}) { {
    padding-bottom: 30px;
  }
`;
const rightDiv = css`
  border-left: 4px solid ${globalTheme.colour.duckEggBlue};
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30px;
  @media only screen and (max-width: ${globalTheme.max.xs}) { {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const text = css`
  flex: 1;
`;
const link = css`
  padding-top: 10px;
`;

class QuickLinks extends Component {
  scrollToId(id) {
    window.location = id;
    window.scrollBy(0, -90); // not ideal
  }

  render() {
    const { t, onFavourites } = this.props;
    return (
      <div className={greyBox}>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <div className={leftDiv}>
              <span>Quick Links</span>
              <div className={link}>
                {onFavourites ? (
                  <HeaderButton
                    id="saved-list-button"
                    onClick={() => this.scrollToId("#saved-list")}
                  >
                    {"Saved list"}
                  </HeaderButton>
                ) : (
                  <HeaderButton
                    id="benefits-and-services-button"
                    onClick={() => this.scrollToId("#benefits-and-services")}
                  >
                    {"Benefits and services"}
                  </HeaderButton>
                )}
              </div>
              <div className={link}>
                <HeaderButton
                  id="next-steps-button"
                  onClick={() => this.scrollToId("#next-steps")}
                >
                  {t("nextSteps.whats_next")}
                </HeaderButton>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            <div className={rightDiv}>
              <div className={text}>{t("B3.check eligibility")}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

QuickLinks.defaultProps = {
  onFavourites: false
};

QuickLinks.propTypes = {
  t: PropTypes.func.isRequired,
  onFavourites: PropTypes.bool,
  className: PropTypes.string
};

export default QuickLinks;
