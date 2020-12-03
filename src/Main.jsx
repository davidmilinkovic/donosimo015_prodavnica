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

var hist = createBrowserHistory();

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
      <div style={{ height: "100%" }}>
        <Router history={hist}>
          <div
            style={{
              height: 55,
              backgroundColor: "#f38e2a",
              width: "100%",

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
                <img src={require("img/korpica.png")} style={{ height: 38 }} />
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
            ) : (
              <Verifikacija />
            )
          ) : (
            <Landing />
          )}
        </Router>
        <MediaQuery maxWidth={1224}>
          {this.state.porudzbine.map((por) => (
            <Card
              style={{ backgroundColor: "#f7f7f7" }}
              body
              className="dmCard"
              style={{
                position: "fixed",
                bottom: 10,
                right: 10,
                width: "100%",
                margin: 0,
                left: 10,
              }}
            >
              <h5 style={{ fontWeight: "normal" }}>
                Porudžbina iz <b>{por.partnerString}</b>
              </h5>
              <Button block color="primary">
                <i className="fas fa-exclamation-circle mr-2" />
                Prikaži status
              </Button>
            </Card>
          ))}
        </MediaQuery>
        <MediaQuery minWidth={1224}>
          {this.state.porudzbine.map((por) => (
            <Card
              style={{ backgroundColor: "#f7f7f7" }}
              body
              className="dmCard"
              style={{
                position: "fixed",
                bottom: 10,
                right: 10,
                margin: 0,
              }}
            >
              <h5 style={{ fontWeight: "normal" }}>
                Porudžbina iz <b>{por.partnerString}</b>
              </h5>
              <Button block color="primary">
                <i className="fas fa-exclamation-circle mr-2" />
                Prikaži status
              </Button>
            </Card>
          ))}
        </MediaQuery>
      </div>
    );
  }
}
