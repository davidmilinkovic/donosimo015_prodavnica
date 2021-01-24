import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

import CardFooter from "reactstrap/lib/CardFooter";
import Button from "reactstrap/lib/Button";
import Alert from "reactstrap/lib/Alert";
import myFetch from "myFetch";
import MediaQuery from "react-responsive";
import { useMediaQuery } from "react-responsive";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import DodajUKorpu from "components/DodajUKorpu";
import StavkaKorpeDesktop from "components/StavkaKorpeDesktop";
import ArtikalDesktop from "components/ArtikalDesktop";
import ArtikalMobilni from "components/ArtikalMobilni";
import ModalNaruci from "components/ModalNaruci";
import jwt_decode from "jwt-decode";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalBody from "reactstrap/lib/ModalBody";
import Modal from "reactstrap/lib/Modal";
import Loader from "components/Loader";

const refCol1 = React.createRef();
const refCol3 = React.createRef();
var refs = {};

export default class Prodavnica extends Component {
  state = {
    trenutnaKategorija: "Odabir kategorije...",
    modalKorpa: false,
    pretraga: "",
    artikalKorpa: null,
    korpa: [],
    korpaOtvorena: false,
    artikli: [],
    kategorije: [],
    dodaci: [],
    mesta: [],
    modalNaruci: false,
    telefon: null,
    firebaseUID: null,
    modalKategorije: false,
    progress: true,
  };

  componentDidMount() {
    this.setState({
      korpa:
        JSON.parse(localStorage.getItem("korpa_" + this.props.partner.id)) ||
        [],
    });
    this.ucitaj();
    if (localStorage.getItem("token") != null) {
      var decoded = jwt_decode(localStorage.getItem("token"));
      this.setState({
        telefon: decoded.phone_number,
        firebaseUID: decoded.user_id,
      });
    }
  }

  ucitaj = () => {
    myFetch("/data/" + this.props.partner.id).then((res) => {
      this.setState({
        artikli: res.artikli,
        kategorije: res.kategorije,
        dodaci: res.dodaci,
        mesta: res.mesta,
        progress: false,
      });
    });
  };

  toggleModalKorpa = () => {
    var obj = { modalKorpa: !this.state.modalKorpa };
    if (this.state.modalKorpa) obj.artikalKorpa = null;
    this.setState(obj);
  };

  toggleModalNaruci = () => {
    this.setState({ modalNaruci: !this.state.modalNaruci });
  };

  handleItemClick = (kat) => {
    window.scrollTo(0, document.getElementById("kat" + kat.id).offsetTop);
    this.setState({
      trenutnaKategorija: kat.naziv,
    });
  };

  korpaIzmenjena = () => {
    this.setState({
      korpa: JSON.parse(localStorage.getItem("korpa_" + this.props.partner.id)),
    });
  };

  brisiStavkuIzKorpe = (index) => {
    var { korpa } = this.state;
    if (index >= 0 || index <= korpa.length) {
      korpa.splice(index, 1);
      if (korpa.length == 0) this.setState({ korpaOtvorena: false });
      localStorage.setItem(
        "korpa_" + this.props.partner.id,
        JSON.stringify(korpa)
      );
      this.setState({ korpa });
    }
  };

  naruci = () => {
    if(this.state.firebaseUID)
      this.setState({ korpaOtvorena: false, modalNaruci: true });
    else
      window.location = "/obavestenje"
  };

  isprazniKorpu = () => {
    localStorage.setItem("korpa_" + this.props.partner.id, "[]");
    this.setState({ korpa: [] });
  };

  render() {
    var trenutnaKategorija = this.state.trenutnaKategorija;
    var { kategorije, artikli } = this.state;
    var { korpa } = this.state;
    var {
      portrait,
      velikiDesktop,
      maliDesktop,
      desktop,
      velikiMobilni,
      maliMobilni,
      mobilni,
    } = this.props;
    return (
      <>
        <Loader loading={this.state.progress} />
        <DodajUKorpu
          partner={this.props.partner}
          otvoren={this.state.modalKorpa}
          artikal={this.state.artikalKorpa}
          toggle={this.toggleModalKorpa}
          dodaci={this.state.dodaci}
          korpaIzmenjena={this.korpaIzmenjena}
          mobilni={mobilni}
        />

        <ModalNaruci
          prikaziPorudzbinu={this.props.prikaziPorudzbinu}
          dajPorudzbine={this.props.dajPorudzbine}
          korpa={this.state.korpa}
          telefon={this.state.telefon}
          firebaseUID={this.state.firebaseUID}
          otvoren={this.state.modalNaruci}
          toggle={this.toggleModalNaruci}
          mesta={this.state.mesta}
          mobilni={mobilni}
          partner={this.props.partner}
          isprazniKorpu={this.isprazniKorpu}
        />

        <Modal
          fade
          scrollable
          className="dmModal"
          isOpen={this.state.modalKategorije}
        >
          <ModalHeader>Kategorije</ModalHeader>
          <ModalBody>
            <ListGroup>
              {kategorije.map((kat) => (
                <Link
                  activeClass="bold white"
                  to={kat.naziv}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-42}
                  onSetActive={() =>
                    this.setState({ trenutnaKategorija: kat.naziv })
                  }
                >
                  <ListGroupItem
                    active={trenutnaKategorija == kat.naziv}
                    className={
                      "" + trenutnaKategorija == kat.naziv ? "bg-info" : ""
                    }
                    onClick={() => this.setState({ modalKategorije: false })}
                    style={{
                      cursor: "pointer",
                      marginTop: 2,
                      marginBottom: 2,
                      border:
                        trenutnaKategorija == kat.naziv
                          ? "0px"
                          : "1px solid #dddddd",
                    }}
                  >
                    <span
                      style={{
                        width: "100%",
                        ...(trenutnaKategorija == kat.naziv
                          ? { color: "white", fontWeight: "bold" }
                          : { color: "black", fontWeight: "normal" }),
                      }}
                    >
                      {kat.naziv}
                    </span>
                    <Badge color="primary" className="pull-right">
                      {kat.brArtikala}
                    </Badge>
                  </ListGroupItem>
                </Link>
              ))}
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              style={{ marginBottom: 0 }}
              color="info"
              onClick={() => this.setState({ modalKategorije: false })}
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>

        {mobilni && korpa.length > 0 && (
          <SwipeableBottomSheet
            open={this.state.korpaOtvorena}
            onChange={(x) => this.setState({ korpaOtvorena: x })}
            overflowHeight={55}
            fullScreen
            style={{
              zIndex: 55,
              display: "grid",
              gridTemplateRows: "auto 1fr",
            }}
          >
            <div
              onClick={() =>
                this.setState({ korpaOtvorena: !this.state.korpaOtvorena })
              }
              style={{
                height: 55,
                display: "flex",
                backgroundColor: "#212121",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                position: "sticky",
                top: -1,
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: "normal",
                  color: "white",
                  margin: 0,
                  padding: 0,
                }}
              >
                <i className="fas fa-shopping-cart mr-2" />
                Iznos korpe:{" "}
                <b>{korpa.reduce((prev, cur) => prev + cur.cena, 0)} din</b>
              </p>

              <Button
                size="sm"
                color="primary"
                className="pull-right btn-round"
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  margin: 0,
                }}
              >
                <i
                  className={
                    this.state.korpaOtvorena
                      ? "fas fa-cancel mr-1"
                      : "fas fa-check mr-1"
                  }
                />
                {this.state.korpaOtvorena ? "Zatvori" : "Naruči"}
              </Button>
            </div>
            <div>
              {korpa.map((stavka, index) => (
                <StavkaKorpeDesktop
                  brisi={() => {
                    this.brisiStavkuIzKorpe(index);
                  }}
                  stavka={stavka}
                />
              ))}
              <Button
                block
                color="info"
                size="lg"
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  position: "fixed",
                  bottom: -65,
                }}
                onClick={this.naruci}
              >
                <i className="fas fa-check mr-2 text-primary" />
                Naruči
              </Button>
            </div>
          </SwipeableBottomSheet>
        )}

        {/*
        <Row form style={{ margin: 0 }}>
          <Col>
            <Alert
              style={{
                borderRadius: 10,
                border: "1px solid gray",
                fontWeight: "normal",
              }}
              color="info"
            >
              <i className="fas fa-home mr-2" />
              <span>Adresa za dostavu: </span>
              <b>Petra Kraljevica 13, stan 16, sprat 2</b>
              <Button
                className="ml-2"
                style={{ padding: 3, fontSize: 12, verticalAlign: "middle" }}
              >
                <i className="fas fa-pen mr-1" />
                Izmena
              </Button>
            </Alert>
          </Col>
            </Row>*/}
        <Row form style={{ margin: 0, padding: 15 }}>
          <Col hidden={!velikiDesktop}>
            <div style={{ position: "sticky", top: 65 }}>
              <Input
                hidden
                block
                style={{
                  marginBottom: 5,
                  marginTop: 0,
                }}
                onChange={(e) => {
                  this.setState({ pretraga: e.target.value });
                }}
                value={this.state.pretraga}
                placeholder="Pretraga artikala..."
              >
                <i className="fas fa-search" />
              </Input>

              <Card className="dmCard">
                <CardHeader>
                  <i className="fas fa-list mr-2 text-primary" />
                  Kategorije
                </CardHeader>
                <CardBody>
                  <ListGroup>
                    {kategorije.map((kat) => (
                      <Link
                        activeClass="bold white"
                        to={kat.naziv}
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-56}
                        onSetActive={() =>
                          this.setState({ trenutnaKategorija: kat.naziv })
                        }
                      >
                        <ListGroupItem
                          active={trenutnaKategorija == kat.naziv}
                          className={
                            "" + trenutnaKategorija == kat.naziv
                              ? "bg-info"
                              : ""
                          }
                          style={{
                            cursor: "pointer",
                            marginTop: 2,
                            marginBottom: 2,
                            border:
                              trenutnaKategorija == kat.naziv
                                ? "0px"
                                : "1px solid #dddddd",
                          }}
                        >
                          <span
                            style={{
                              width: "100%",
                              ...(trenutnaKategorija == kat.naziv
                                ? { color: "white", fontWeight: "bold" }
                                : { color: "black", fontWeight: "normal" }),
                            }}
                          >
                            {kat.naziv}
                          </span>
                          <Badge color="primary" className="pull-right">
                            {kat.brArtikala}
                          </Badge>
                        </ListGroupItem>
                      </Link>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </div>
          </Col>

          <Col
            xs={mobilni ? 12 : velikiDesktop ? 8 : 9}
            style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 55 }}
          >
            {!velikiDesktop && (
              <div style={{ position: "sticky", top: 65, zIndex: 50 }}>
                <Input
                  hidden
                  block
                  style={{
                    marginBottom: 5,
                    marginTop: 0,
                  }}
                  onChange={(e) => {
                    this.setState({ pretraga: e.target.value });
                  }}
                  value={this.state.pretraga}
                  placeholder="Pretraga artikala..."
                >
                  <i className="fas fa-search" />
                </Input>
                <Button
                  block
                  size="sm"
                  color="info"
                  onClick={() => this.setState({ modalKategorije: true })}
                  className="btn-round"
                  style={{ marginBottom: 0 }}
                >
                  {trenutnaKategorija}
                </Button>
              </div>
            )}
            {kategorije.map((kat) => {
              return (
                <Element name={kat.naziv} className="element">
                  {mobilni && <br />}
                  <div className="naslovKategorije">
                    <h4>{kat.naziv}</h4>
                    <p
                      style={{ fontWeight: "normal" }}
                      hidden={!kat.opis || kat.opis.length == 0}
                    >
                      {kat.opis}
                    </p>
                  </div>
                  {mobilni && <br />}

                  <div id="artikliFlex">
                    {artikli.map((art) => {
                      if (art.KategorijaArtikalaId == kat.id)
                        return desktop ? (
                          <ArtikalDesktop
                            dodajUKorpu={() =>
                              this.setState({
                                modalKorpa: true,
                                artikalKorpa: art,
                              })
                            }
                            data={art}
                          />
                        ) : (
                          <ArtikalMobilni
                            dodajUKorpu={() =>
                              this.setState({
                                modalKorpa: true,
                                artikalKorpa: art,
                              })
                            }
                            data={art}
                          />
                        );
                      return "";
                    })}
                    {desktop && (
                      <>
                        <div className="artikliFlexHidden" />
                        <div className="artikliFlexHidden" />
                        <div className="artikliFlexHidden" />
                        <div className="artikliFlexHidden" />
                        <div className="artikliFlexHidden" />
                        <div className="artikliFlexHidden" />
                      </>
                    )}
                  </div>
                </Element>
              );
            })}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Col>
          {desktop && (
            <Col xs={velikiDesktop ? 2 : 3}>
              <Card
                style={{ position: "sticky", maxHeight: "90vh", top: 65 }}
                className="dmCard"
              >
                <CardHeader>
                  <i className="fas fa-shopping-cart mr-2 text-primary" />
                  Korpa
                </CardHeader>
                <CardBody style={{ padding: 0, overflowY: "auto" }}>
                  {korpa.length == 0 ? (
                    <p
                      align="center"
                      style={{ padding: 15, fontWeight: "normal" }}
                    >
                      Korpa je prazna
                    </p>
                  ) : (
                    <>
                      {korpa.map((stavka, index) => (
                        <StavkaKorpeDesktop
                          brisi={() => {
                            this.brisiStavkuIzKorpe(index);
                          }}
                          stavka={stavka}
                        />
                      ))}
                    </>
                  )}
                </CardBody>
                <CardFooter style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
                  {korpa.length != 0 && (
                    <>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          margin: 5,
                          padding: 0,
                        }}
                      >
                        Ukupno:{" "}
                        <span className="text-primary">
                          {korpa.reduce((prev, cur) => prev + cur.cena, 0)} din.
                        </span>
                      </p>
                    </>
                  )}
                  <Button
                    hidden={korpa.length == 0}
                    block
                    color="info"
                    id="btnNaruci"
                    onClick={this.naruci}
                  >
                    <i className="fas fa-check mr-2 text-primary" />
                    Naruči
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          )}
        </Row>
      </>
    );
  }
}
