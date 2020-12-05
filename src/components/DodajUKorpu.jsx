import React, { Component } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import ModalOdabirDodataka from "./ModalOdabirDodataka";

var initialState = {
  napomena: null,
  kolicina: 1,
  poljeZaOdabir: null,
  poljaVrednosti: {},
};

export default class DodajUKorpu extends Component {
  state = {
    ...initialState,
  };

  dajCenu = () => {
    var cena = this.props.artikal.cena;
    var { artikal } = this.props;
    artikal.polja.forEach((polje) => {
      if (polje.tip < 2) {
        if (this.state.poljaVrednosti[polje.id] != null) {
          this.state.poljaVrednosti[polje.id].forEach((vred) => {
            cena += vred.cena;
          });
        }
      }
    });
    return cena * this.state.kolicina;
  };

  dodaj = () => {
    var opis = "";
    var { artikal } = this.props;
    artikal.polja.forEach((polje) => {
      if (this.state.poljaVrednosti[polje.id] != null) {
        opis += polje.naziv + ": ";
        if (polje.tip == 0) {
          // jedan dodatak
          opis += this.state.poljaVrednosti[polje.id][0].naziv;
        } else if (polje.tip == 1) {
          opis += this.state.poljaVrednosti[polje.id].reduce(
            (prev, cur, i) => prev + (i != 0 ? ", " : "") + cur.naziv,
            ""
          );
        } else if (polje.tip == 2) {
          opis += this.state.poljaVrednosti[polje.id];
        } else {
          opis += this.state.poljaVrednosti[polje.id] ? "Da" : "Ne";
        }
        opis += "\n";
      }
    });
    if (this.state.napomena && this.state.napomena.length > 0)
      opis += "Napomena: " + this.state.napomena;
    var stavka = {
      opis,
      cena: this.dajCenu(),
      kolicina: this.state.kolicina,
      naziv: artikal.naziv,
      slika: artikal.slika,
    };
    var korpa = [...(JSON.parse(localStorage.getItem("korpa")) || []), stavka];
    localStorage.setItem("korpa", JSON.stringify(korpa));
    this.props.korpaIzmenjena();
    this.props.toggle();
    this.setState(initialState);
  };

  render() {
    var { artikal, mobilni } = this.props;
    if (!artikal) return "";
    return (
      <>
        <ModalOdabirDodataka
          mobilni={mobilni}
          dodaci={this.props.dodaci}
          otvoren={this.state.poljeZaOdabir != null}
          polje={this.state.poljeZaOdabir}
          zatvori={() => this.setState({ poljeZaOdabir: null })}
          potvrdi={(val, idPolja) => {
            var obj = { ...this.state.poljaVrednosti };
            obj[idPolja] = val;
            this.setState({ poljaVrednosti: obj });
          }}
        />
        <Modal
          fade={true}
          scrollable
          className="dmModal"
          isOpen={this.props.otvoren}
        >
          <ModalHeader>Dodaj u korpu</ModalHeader>
          <ModalBody>
            <Card
              body
              className="dmCard"
              style={{
                padding: 10,
                boxShadow: "none",
                border: "1px solid #dddddd",
              }}
            >
              <div>
                {mobilni && (
                  <img
                    style={{
                      borderRadius: 5,
                      width: "55%",
                      marginBottom: 10,
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "block",
                    }}
                    src={
                      artikal.slika != ""
                        ? process.env.REACT_APP_SERVER +
                          "/slike/artikli/" +
                          artikal.slika
                        : require("../img/default.jpg")
                    }
                  />
                )}
                <p
                  style={{
                    marginTop: 4,
                    marginBottom: 2,
                    fontWeight: "bold",
                    fontSize: 17,
                    display: "inline",
                  }}
                >
                  {artikal.naziv}
                </p>
                <Badge
                  color="warning"
                  style={{
                    display: "inline",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                  className="align-middle ml-2"
                >
                  {artikal.cena} din.
                </Badge>
              </div>
              <FormGroup
                style={{
                  marginBottom: 0,
                  paddingBottom: 0,
                  marginTop: 6,
                }}
              >
                <Label>
                  <b>Količina: </b>
                </Label>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <Button
                      onClick={() => {
                        this.setState({
                          kolicina: Math.max(this.state.kolicina - 1, 1),
                        });
                      }}
                      size="sm"
                      color="info"
                      style={{ height: 32 }}
                    >
                      -
                    </Button>
                  </InputGroupAddon>
                  <Input size="sm" value={this.state.kolicina} readOnly />
                  <InputGroupAddon addonType="append">
                    <Button
                      onClick={() => {
                        this.setState({ kolicina: this.state.kolicina + 1 });
                      }}
                      size="sm"
                      color="info"
                      style={{ height: 32 }}
                    >
                      +
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Card>
            <Card
              body
              className="dmCard"
              style={{
                padding: 10,
                boxShadow: "none",
                border: "1px solid #dddddd",
                marginBottom: 15,
              }}
            >
              <Form>
                {artikal.polja.map((polje) => {
                  return (
                    <>
                      <FormGroup
                        style={{ marginBottom: polje.tip != 3 ? 0 : 12 }}
                      >
                        <Label hidden={polje.tip == 3}>
                          <b>{polje.naziv}</b>
                          {polje.obavezno ? " (obavezno)" : ""}
                        </Label>
                        {polje.tip == 0 ? (
                          <Button
                            color="info"
                            className="btn-round"
                            block
                            size="sm"
                            onClick={() =>
                              this.setState({ poljeZaOdabir: polje })
                            }
                          >
                            {this.state.poljaVrednosti[polje.id] == null ||
                            this.state.poljaVrednosti[polje.id].length == 0 ? (
                              <>
                                <i className="fas fa-list mr-2" />
                                Izaberite...
                              </>
                            ) : (
                              this.state.poljaVrednosti[polje.id][0].naziv +
                              (this.state.poljaVrednosti[polje.id][0].cena != 0
                                ? ` (+ ${
                                    this.state.poljaVrednosti[polje.id][0].cena
                                  } din.)`
                                : "")
                            )}
                          </Button>
                        ) : (
                          ""
                        )}
                        {polje.tip == 1 ? (
                          <Button
                            color="info"
                            className="btn-round"
                            block
                            size="sm"
                            onClick={() =>
                              this.setState({ poljeZaOdabir: polje })
                            }
                          >
                            {this.state.poljaVrednosti[polje.id] == null ||
                            this.state.poljaVrednosti[polje.id].length == 0 ? (
                              <>
                                <i className="fas fa-list mr-2" />
                                Izaberite
                                {polje.maksDodataka ? (
                                  <span>(max. {polje.maksDodataka})</span>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              this.state.poljaVrednosti[polje.id].map(
                                (dod, index) =>
                                  dod.naziv +
                                  (dod.cena != 0
                                    ? ` (+ ${dod.cena}din.)`
                                    : "") +
                                  (this.state.poljaVrednosti[polje.id].length !=
                                  index + 1
                                    ? ", "
                                    : "")
                              )
                            )}
                          </Button>
                        ) : (
                          ""
                        )}
                        {polje.tip == 2 ? (
                          <Input
                            size="sm"
                            value={this.state.poljaVrednosti[polje.id]}
                            onChange={(e) => {
                              e.persist();
                              var obj = { ...this.state.poljaVrednosti };
                              obj[polje.id] = e.target.value;
                              this.setState({ poljaVrednosti: obj });
                            }}
                          />
                        ) : (
                          ""
                        )}
                        {polje.tip == 3 ? (
                          <>
                            <FormGroup check style={{ display: "inline" }}>
                              <Label style={mobilni ? { top: 5 } : {}} check>
                                <Input
                                  checked={
                                    this.state.poljaVrednosti[polje.id] != null
                                  }
                                  type="checkbox"
                                  style={{ position: "inherit" }}
                                  onClick={() => {
                                    var poljaVrednosti = {
                                      ...this.state.poljaVrednosti,
                                    };
                                    if (poljaVrednosti[polje.id])
                                      delete poljaVrednosti[polje.id];
                                    else poljaVrednosti[polje.id] = true;
                                    this.setState({ poljaVrednosti });
                                  }}
                                />{" "}
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </Label>
                            </FormGroup>
                            <span
                              className="align-middle"
                              style={{ fontWeight: "bold" }}
                            >
                              {polje.naziv}
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                      <hr
                        style={{
                          marginLeft: -10,
                          marginRight: -10,
                          marginTop: 6,
                          marginBottom: 6,
                        }}
                      />
                    </>
                  );
                })}
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>
                    <b>Napomena</b>
                  </Label>

                  <Input
                    size="sm"
                    text={this.state.napomena}
                    placeholder="Unesite napomene u vezi sa artiklom..."
                    onChange={(e) => {
                      e.persist();
                      this.setState({ napomena: e.target.value });
                    }}
                  />
                </FormGroup>
              </Form>
            </Card>
          </ModalBody>
          <ModalFooter>
            {mobilni ? (
              <div style={{ width: "100%" }}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginBottom: 10,
                    color: "black",
                    marginRight: 10,
                  }}
                >
                  Ukupna cena: <b>{this.dajCenu()} din.</b>
                </p>

                <div style={{ width: "100%", display: "flex" }}>
                  <Button
                    className="btn-round"
                    color="info"
                    style={{ marginBottom: 0, marginRight: 5, flexGrow: 1 }}
                    onClick={() => {
                      this.setState({ ...initialState });
                      this.props.toggle();
                    }}
                  >
                    Zatvori
                  </Button>
                  <Button
                    className="btn-round"
                    style={{ marginBottom: 0, marginLeft: 5, flexGrow: 1 }}
                    color="primary"
                    onClick={this.dodaj}
                  >
                    <i className="fas fa-cart-plus mr-2" />
                    Dodaj
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginBottom: 0,
                    color: "black",
                    marginRight: 10,
                  }}
                >
                  Ukupna cena: <b>{this.dajCenu()} din.</b>
                </p>
                <Button
                  className="btn-round"
                  color="info"
                  style={{ marginBottom: 0 }}
                  onClick={() => {
                    this.setState({ ...initialState });
                    this.props.toggle();
                  }}
                >
                  Zatvori
                </Button>
                <Button
                  className="btn-round"
                  style={{ marginBottom: 0 }}
                  color="primary"
                  onClick={this.dodaj}
                >
                  <i className="fas fa-cart-plus mr-2" />
                  Dodaj
                </Button>
              </>
            )}
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
