import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withI18next } from "../lib/withI18next";
import Typography from "@material-ui/core/Typography";
import Layout from "../components/layout";
import { connect } from "react-redux";
import AreaOfficeMap from "../components/area_office_map";
import AreaOfficeTable from "../components/area_office_table";
import { Grid, Button } from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Paper from "@material-ui/core/Paper/index";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  mapTitle: {
    fontSize: "36px"
  },
  backLink: {
    fontSize: "20px",
    fontWeight: "100",
    marginBottom: "15px",
    paddingLeft: "0px",
    textDecoration: "none",
    textTransform: "none"
  },
  topMatter: {
    marginBottom: "25px",
    marginTop: "30px"
  }
});
const google_maps_key = process.env.GOOGLE_MAPS_KEY;
export class Map extends Component {
  constructor() {
    super();
    this.state = {
      lat: undefined,
      lng: undefined,
      zoom: undefined
    };
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 10
        });
      });
    } else {
      //browser doesn't support geolocation
      this.setState({
        lat: undefined,
        lng: undefined,
        zoom: undefined
      });
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { i18n, t, classes } = this.props;
    return (
      <Layout
        title={"Map"}
        i18n={i18n}
        t={t}
        hideNoscript={true}
        showRefreshCache={false}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: "16px",
            paddingRight: "16px"
          }}
        >
          <Grid
            container
            spacing={24}
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            <Grid item xs={12} md={8} className={classes.topMatter}>
              <Button
                variant="flat"
                size="large"
                className={classes.backLink}
                id="backButton"
                href="javascript:history.back()"
              >
                <ArrowBack />
                &nbsp; &nbsp;
                {t("favourites.back_link")}
              </Button>
              <Typography className={"MapTitle " + classes.mapTitle}>
                {t("map.vacOffices")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} className={classes.topMatter}>
              <Typography>
                <a href={"tel:" + t("contact.phone")}>{t("contact.phone")}</a>
              </Typography>
              <Typography>{t("favourites.call_time")}</Typography>
            </Grid>
          </Grid>

          <Paper className={classes.root}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <AreaOfficeMap
                  id="AreaOfficeMap"
                  googleMapURL={
                    "https://maps.googleapis.com/maps/api/js?key=" +
                    google_maps_key +
                    "&language=" +
                    t("current-language-code") +
                    "&v=3.exp&libraries=geometry,drawing,places"
                  }
                  loadingElement={<div style={{ height: "100%" }} />}
                  containerElement={<div style={{ height: "400px" }} />}
                  mapElement={<div style={{ height: "100%" }} />}
                  lat={this.state.lat}
                  lng={this.state.lng}
                  zoom={this.state.zoom}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <AreaOfficeTable
                  id="AreaOfficeTable"
                  lat={this.state.lat}
                  lng={this.state.lng}
                  store={this.props.store}
                  t={t}
                />
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    areaOffices: state.areaOffices
  };
};

Map.propTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  areaOffices: PropTypes.array.isRequired,
  store: PropTypes.object
};

export default withStyles(styles)(connect(mapStateToProps)(withI18next()(Map)));
