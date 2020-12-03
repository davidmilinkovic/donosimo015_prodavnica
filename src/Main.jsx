import React, { Component } from "react";
import myFetch from "./myFetch";
import ProdavnicaWrapper from "views/ProdavnicaWrapper";
import Landing from "views/Landing";
import Button from "reactstrap/lib/Button";
import Verifikacija from "views/Verifikacija";
import firebase from "firebase/app";
import Pocetna from "views/Pocetna";
import { Link, Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import Prodavnica from "views/Prodavnica";
import Toast from "reactstrap/lib/Toast";
import ToastHeader from "reactstrap/lib/ToastHeader";
import ToastBody from "reactstrap/lib/ToastBody";
import Card from "reactstrap/lib/Card";
import MediaQuery from "react-responsive";

import RingLoader from "react-spinners/RingLoader";
import {
  ClimbingBoxLoader,
  ClockLoader,
  DotLoader,
  HashLoader,
  PacmanLoader,
  SquareLoader,
  SyncLoader,
} from "react-spinners";

var hist = createBrowserHistory();

var statusi = [
  "Čeka se potvrda", // 0
  "U pripremi", // 1
  "Čeka se preuzimanje", // 2
  "Dostavlja se", // 3
  "Dostavljena", // 4
  "Odbijena", // 5
  "Otkazana", // 6
  "Zakazana", // 7
];

var bojeStatusa = [
  "#ffab00",
  "#125688",
  "#ea4c89",
  "#4CD964",
  "#4CD964",
  "#d5000",
  "#d5000",
  "#262626",
];

export default class Main extends Component {
  state = {
    partneri: [],
    porudzbine: [],
  };

  dajPartnere = () => {
    myFetch("/partneri").then((res) => {
      this.setState({ partneri: res.result });
    });
  };

  dajPorudzbine = () => {
    myFetch("/aktivnePorudzbine").then((res) => {
      setTimeout(this.dajPorudzbine, 1000);
      this.setState({ porudzbine: res.result });
    });
  };

  componentDidMount() {
    this.dajPartnere();
    this.dajPorudzbine();
  }

  render() {
    return (
      <div>
        <Router history={hist}>
          <div            
            style={{
              height: 55,
              width: "100%",
              backgroundColor: "#212121",
              marginBottom: 10,
              position: "fixed",
              top: 0,
              zIndex: 45,
              boxShadow: "rgba(0, 0, 0, 0.157) 0px 6px 5px",
              display: "flex",
              flexFlow: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to="/">
              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={require("img/korpica.png")} style={{ height: 0 }} />
                <h4
                  style={{
                    display: "inline",
                    margin: 0,
                    marginLeft: 5,
                    fontSize: 23,
                    fontWeight: "normal",
                    color: "white",
                  }}
                >
                  Donosimo 015
                </h4>
              </div>
            </Link>
            <Button
              outline
              hidden
              color="secondary"
              className="btn-round"
              style={{ marginRight: 10 }}
              onClick={() => {
                firebase.auth().signOut();
                window.location.reload();
              }}
              size="sm"
            >
              <i className="fas fa-phone mr-2" />
              Odjava
            </Button>
          </div>
          {localStorage.getItem("landing") != null ? (
            firebase.auth().currentUser != null ? (
              <>
                {this.state.porudzbine.length > 0 && (
                  <MediaQuery maxWidth={1224}>
                    <div
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.157) 0px 6px 5px",
                        backgroundColor: "#e3e3e3",
                        position: "sticky",
                        top: 55,
                        zIndex: 40,
                      }}
                    >
                      {this.state.porudzbine.map((por) => (
                        <>
                          <div
                            style={{
                              display: "flex",
                              borderBottom: "1px solid #d5d5d5",
                              alignItems: "center",
                              padding: 10,
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {por.status == 0 && (
                                <RingLoader
                                  color={bojeStatusa[por.status]}
                                  size={30}
                                />
                              )}
                              {por.status == 1 && (
                                <HashLoader
                                  color={bojeStatusa[por.status]}
                                  size={30}
                                />
                              )}
                              {por.status == 2 && (
                                <SyncLoader
                                  color={bojeStatusa[por.status]}
                                  size={6}
                                />
                              )}
                              {por.status == 3 && (
                                <DotLoader
                                  color={bojeStatusa[por.status]}
                                  size={30}
                                />
                              )}
                              <div style={{ paddingLeft: 10 }}>
                                <h5
                                  style={{
                                    marginBottom: 0,
                                    fontSize: 15,
                                    fontWeight: "normal",
                                  }}
                                >
                                  Porudžbina iz <b>{por.partnerString}</b>
                                </h5>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    marginBottom: 0,
                                    color: bojeStatusa[por.status],
                                  }}
                                >
                                  {statusi[por.status]}
                                </p>
                              </div>
                            </div>
                            <Button
                              style={{
                                marginBottom: 0,
                                fontSize: 12,
                                padding: 3,
                              }}
                              color="primary"
                              size="sm"
                            >
                              <i className="fas fa-list mr-1" />
                              Prikaži
                            </Button>
                          </div>
                        </>
                      ))}
                    </div>
                  </MediaQuery>
                )}
                <div>
                  <Switch>
                    <Route path="/" exact>
                      <Pocetna partneri={this.state.partneri} />
                    </Route>
                    {this.state.partneri.map((p) => (
                      <Route path={"/" + p.naziv}>
                        <ProdavnicaWrapper partner={p} />
                      </Route>
                    ))}
                  </Switch>
                </div>
              </>
            ) : (
              <Verifikacija />
            )
          ) : (
            <Landing />
          )}
        </Router>

        <MediaQuery minWidth={1224}>
          {this.state.porudzbine.length > 0 && (
            <div
              style={{
                position: "fixed",
                display: "flex",
                alignItems: "flex-end",
                zIndex: 5600,
                bottom: 20,
                right: 20,
                margin: 0,
              }}
            >
              {this.state.porudzbine.map((por) => (
                <Card
                  style={{ backgroundColor: "#f7f7f7" }}
                  body
                  className="dmCard"
                  style={{
                    margin: 0,
                    marginLeft: 10,
                    marginRight: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",                    
                  }}
                >
                  <img
                    hidden
                    style={{ height: 100, width: 100 }}
                    src={
                      por.Partner.slika
                        ? process.env.REACT_APP_SERVER +
                          "/slike/partneri/" +
                          por.Partner.slika
                        : require("img/default.jpg")
                    }
                  />
                  {por.status == 0 && (
                    <RingLoader color={bojeStatusa[por.status]} size={100} />
                  )}
                  {por.status == 1 && (
                    <HashLoader color={bojeStatusa[por.status]} size={100} />
                  )}
                  {por.status == 2 && (
                    <SyncLoader color={bojeStatusa[por.status]} size={20} />
                  )}
                  {por.status == 3 && (
                    <DotLoader color={bojeStatusa[por.status]} size={100} />
                  )}
                  <h5 style={{ fontWeight: "normal", marginBottom: 0, marginTop: 15 }}>
                    Porudžbina iz <b>{por.partnerString}</b>
                  </h5>
                  <h6
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      marginBottom: 15,
                      color: bojeStatusa[por.status],
                    }}
                  >
                    {statusi[por.status]}{" "}
                  </h6>
                  <Button block className="btn-round" color="primary">
                    <i className="fas fa-list mr-2" />
                    Prikaži porudžbinu
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </MediaQuery>
      </div>
    );
  }
}
