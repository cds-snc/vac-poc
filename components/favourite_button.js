import React, { Component } from "react";
import PropTypes from "prop-types";
import SaveChecked from "./icons/SaveChecked";
import SaveUnchecked from "./icons/SaveUnchecked";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { cx, css } from "emotion";
import HeaderButton from "./header_button";
import { areCookiesDisabled } from "../utils/common";
import Tooltip from "./tooltip";

const saveButton = css`
  margin-left: 0px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0.526315em;
  padding-bottom: 0.526315em;
`;

export class FavouriteButton extends Component {
  constructor() {
    super();
    this.cookies = new Cookies();
  }

  toggleFavourite = id => {
    let favouriteBenefits = this.cookies.get("favouriteBenefits")
      ? this.cookies.get("favouriteBenefits")
      : [];
    if (favouriteBenefits.indexOf(id) > -1) {
      favouriteBenefits.splice(favouriteBenefits.indexOf(id), 1);
    } else {
      favouriteBenefits.push(id);
    }
    this.cookies.set("favouriteBenefits", favouriteBenefits, { path: "/" });
    this.props.saveFavourites(favouriteBenefits);
    this.props.toggleOpenState();
  };

  render() {
    const { t, benefit } = this.props;
    const isSaved =
      this.props.favouriteBenefits.indexOf(this.props.benefit.id) > -1;
    const longButtonText = t(
      isSaved ? "B3.favouritesButtonTextRemove" : "B3.favouritesButtonBText"
    );
    const benefitName =
      t("current-language-code") === "en"
        ? benefit.vacNameEn
        : benefit.vacNameFr;

    return (
      <Tooltip
        disabled={!this.props.cookiesDisabled}
        tooltipText={t("favourites.disabled_cookies_tooltip")}
      >
        <HeaderButton
          disabled={this.props.cookiesDisabled}
          ariaLabel={longButtonText + " " + benefitName}
          id={"favourite-" + benefit.id}
          className={saveButton}
          aria-label={t("B3.favouritesButtonText")}
          onClick={() => this.toggleFavourite(benefit.id)}
          onMouseOver={() => {
            this.props.setCookiesDisabled(areCookiesDisabled());
          }}
          size="small"
        >
          {isSaved ? (
            <SaveChecked className={cx("saved")} />
          ) : (
            <SaveUnchecked className={cx("notSaved")} />
          )}
          <span>{longButtonText}</span>
        </HeaderButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveFavourites: favouriteBenefits => {
      dispatch({
        type: "LOAD_DATA",
        data: { favouriteBenefits: favouriteBenefits }
      });
    },
    setCookiesDisabled: areDisabled => {
      dispatch({ type: "SET_COOKIES_DISABLED", data: areDisabled });
    }
  };
};

const mapStateToProps = reduxState => {
  return {
    favouriteBenefits: reduxState.favouriteBenefits,
    cookiesDisabled: reduxState.cookiesDisabled
  };
};

FavouriteButton.propTypes = {
  favouriteBenefits: PropTypes.array.isRequired,
  cookiesDisabled: PropTypes.bool.isRequired,
  setCookiesDisabled: PropTypes.func.isRequired,
  saveFavourites: PropTypes.func.isRequired,
  benefit: PropTypes.object.isRequired,
  toggleOpenState: PropTypes.func.isRequired,
  store: PropTypes.object,
  t: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavouriteButton);
