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
import ModalPrikazPorudzbine from "components/ModalPrikazPorudzbine";

var hist = createBrowserHistory();

var statusi = [
  "Obrađuje se", // 0
  "U pripremi", // 1
  "Čeka se preuzimanje", // 2
  "Dostavlja se", // 3
  "Dostavljena", // 4
  "",
  "Odbijena", // 6 - ovo je zapravo otkazana, ali korisniku je lepše prikazati ovako
  "Zakazana", // 7
];

var bojeStatusa = [
  "#ffab00",
  "#125688",
  "#ea4c89",
  "#4CD964",
  "#4CD964",
  "#d50000",
  "#d50000",
  "#4CD964",
];

var refModalPrikaz = React.createRef();

export default class Main extends Component {
  state = {
    partneri: [],
    porudzbine: [],
    porudzbinaZaPrikaz: null,
  };

  dajPartnere = () => {
    myFetch("/partneri").then((res) => {
      var partneri = res.result;

      this.setState({ partneri });
    });
  };

  dajPorudzbine = (timeout = true) => {
    if (timeout) setTimeout(this.dajPorudzbine, 5000);

    myFetch("/aktivnePorudzbine").then((res) => {
      var porudzbine = res.result;

      for (var i = 0; i < porudzbine.length; i++) {
        porudzbine[i].odbijena = porudzbine[i].status == 6; // loodilo
        porudzbine[i].potvrdjena =
          porudzbine[i].VozacId != null && porudzbine[i].status != 0;
        if (this.state.porudzbinaZaPrikaz != null) {
          if (porudzbine[i].id == this.state.porudzbinaZaPrikaz.id) {
            this.setState({ porudzbinaZaPrikaz: porudzbine[i] });
          }
        }
      }
      this.setState({ porudzbine });
    });
  };

  componentDidMount() {
    this.dajPartnere();
    this.dajPorudzbine();
  }

  prikaziPorudzbinu = (por) => {
    this.setState({ porudzbinaZaPrikaz: por }, () =>
      refModalPrikaz.current.otvori()
    );
  };

  render() {
    return (
      <div>
        <ModalPrikazPorudzbine
          dajPorudzbine={this.dajPorudzbine}
          statusi={statusi}
          bojeStatusa={bojeStatusa}
          ref={refModalPrikaz}
          porudzbina={this.state.porudzbinaZaPrikaz}
        />
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
            <Link to="/" onClick={() => hist.replace("/")}>
              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={require("img/donosimo_mala.png")}
                  style={{ height: 40 }}
                />
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
                        zIndex: 55,
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
                              {por.status == 7 ? (
                                <ClockLoader color={bojeStatusa[7]} size={30} />
                              ) : (
                                <>
                                  {!por.potvrdjena && !por.odbijena && (
                                    <RingLoader
                                      color={bojeStatusa[0]}
                                      size={30}
                                    />
                                  )}
                                  {por.potvrdjena && !por.odbijena && (
                                    <>
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
                                    </>
                                  )}
                                </>
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
                                    color:
                                      bojeStatusa[
                                        por.potvrdjena ||
                                        por.odbijena ||
                                        por.status == 7
                                          ? por.status
                                          : 0
                                      ],
                                  }}
                                >
                                  {
                                    statusi[
                                      por.potvrdjena ||
                                      por.odbijena ||
                                      por.status == 7
                                        ? por.status
                                        : 0
                                    ]
                                  }
                                </p>
                              </div>
                            </div>
                            <Button
                              style={{
                                marginBottom: 0,
                                fontSize: 12,
                              }}
                              color="info"
                              size="sm"
                              className="btn-round"
                              onClick={() => this.prikaziPorudzbinu(por)}
                            >
                              <i className="fas fa-list mr-1  text-primary" />
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
                      <Pocetna hist={hist} partneri={this.state.partneri} />
                    </Route>
                    {this.state.partneri.map((p) => (
                      <Route path={"/" + p.naziv}>
                        <ProdavnicaWrapper
                          dajPorudzbine={this.dajPorudzbine}
                          prikaziPorudzbinu={(por) => {
                            this.setState({ porudzbinaZaPrikaz: por }, () =>
                              refModalPrikaz.current.otvori()
                            );
                          }}
                          partner={p}
                        />
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
                zIndex: 50,
                bottom: 20,
                right: 20,
                margin: 0,
              }}
            >
              {this.state.porudzbine.map((por) => (
                <Card
                  body
                  className="dmCard"
                  style={{
                    margin: 0,
                    marginLeft: 10,
                    backgroundColor: "#e3e3e3",
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
                  {por.status == 7 ? (
                    <ClockLoader color={bojeStatusa[7]} size={100} />
                  ) : (
                    <>
                      {!por.potvrdjena && !por.odbijena && (
                        <RingLoader color={bojeStatusa[0]} size={100} />
                      )}
                      {por.potvrdjena && !por.odbijena && (
                        <>
                          {por.status == 1 && (
                            <HashLoader
                              color={bojeStatusa[por.status]}
                              size={100}
                            />
                          )}
                          {por.status == 2 && (
                            <SyncLoader
                              color={bojeStatusa[por.status]}
                              size={20}
                            />
                          )}
                          {por.status == 3 && (
                            <DotLoader
                              color={bojeStatusa[por.status]}
                              size={100}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                  <h5
                    style={{
                      fontWeight: "normal",
                      marginBottom: 0,
                      marginTop: 15,
                    }}
                  >
                    Porudžbina iz <b>{por.partnerString}</b>
                  </h5>
                  <h6
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      marginBottom: 15,
                      color:
                        bojeStatusa[
                          por.potvrdjena || por.odbijena || por.status == 7
                            ? por.status
                            : 0
                        ],
                    }}
                  >
                    {
                      statusi[
                        por.potvrdjena || por.odbijena || por.status == 7
                          ? por.status
                          : 0
                      ]
                    }{" "}
                  </h6>
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    onClick={() => this.prikaziPorudzbinu(por)}
                  >
                    <i className="fas fa-list mr-2 text-primary" />
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
