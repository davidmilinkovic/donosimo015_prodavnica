import myFetch from "myFetch";
import React, { Component } from "react";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Form from "reactstrap/lib/Form";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import StavkaKorpeDesktop from "./StavkaKorpeDesktop";

export default class ModalNaruci extends Component {
  state = {
    dialogMesto: false,
    ime: "",
    mesto: null,
    adresa: "",
  };

  naruci = () => {
    var body = {};
    body.ime = this.state.ime;
    body.adresa = this.state.adresa;
    body.telefon = this.props.telefon;
    body.firebaseUID = this.props.firebaseUID;
    body.napomena = "";
    body.status = 0;
    body.PartnerId = this.props.partner.id;
    body.stavke = this.props.korpa;
    body.partnerString = this.props.partner.naziv;
    body.MestoId = this.state.mesto.id;
    body.cenaDostave = this.state.mesto.Zona.cena;
    body.cenaPorudzbine = this.props.korpa.reduce(
      (prev, cur) => prev + cur.cena,
      0
    );
    myFetch("/novaPorudzbina", "POST", body).then((res) => {
      alert("ok");
    });
  }

  render() {
    var {mobilni} = this.props;
    return (
      <>
        <Modal className="dmModal" isOpen={this.state.dialogMesto}>
          <ModalHeader>Izaberite mesto dostave</ModalHeader>
          <ModalBody>
            {this.props.mesta.map((mesto) => (
              <Button
                color="secondary"
                block
                onClick={() => this.setState({ dialogMesto: false, mesto })}
              >
                {mesto.naziv} ({mesto.Zona.cena} din.)
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => this.setState({ dialogMesto: false })}
              color="danger"
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          size="lg"
          scrollable
          className="dmModal"
          isOpen={this.props.otvoren}
        >
          <ModalHeader>Naručivanje</ModalHeader>
          <ModalBody>
            <p style={{ marginTop: 0, fontWeight: "normal" }}>
              <i className="fas fa-info-circle mr-2 text-primary" />
              Unesite podatke za dostavu:{" "}
            </p>
            <Card body style={{ backgroundColor: "#f7f7f7" }}>
              <Form autocomplete="off">
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ime">Ime i prezime</Label>
                      <Input
                        type="text"
                        name="ime"
                        id="ime"
                        placeholder="Ime i prezime"
                        value={this.state.ime}
                        onChange={(e) => this.setState({ ime: e.target.value })}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Mesto">Mesto (*)</Label>
                      <Button
                        block
                        outline
                        className="text-secondary"
                        color="secondary"
                        onClick={() => this.setState({ dialogMesto: true })}
                      >
                        {this.state.mesto == null
                          ? "Izaberite mesto"
                          : this.state.mesto.naziv +
                            ` (${this.state.mesto.Zona.cena} din.)`}
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Adresa">Adresa (*)</Label>
                      <Input
                        type="text"
                        name="Adresa"
                        id="Adresa"
                        placeholder="Adresa za dostavu"
                        value={this.state.adresa}
                        onChange={(e) =>
                          this.setState({ adresa: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Telefon">Telefon (*)</Label>
                      <Input
                        type="text"
                        name="Telefon"
                        id="Telefon"
                        readOnly={true}
                        value={this.props.telefon}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Card>
            <hr />
            <h3
              align="center"
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              <i className="fas fa-list mr-2 text-primary" />
              Pregled narudžbine
            </h3>
            <hr />
            {this.props.korpa.map((stavka, index) => (
              <>
                <div style={{ display: "flex" }}>
                  {stavka.slika && stavka.slika != "" && (
                    <img
                      style={{ width: 100, marginRight: 10, borderRadius: 10 }}
                      src={
                        process.env.REACT_APP_SERVER +
                        "/slike/artikli/" +
                        stavka.slika
                      }
                    />
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <h4
                      style={{ fontWeight: "bold", marginTop: 0, fontSize: 16 }}
                    >
                      {stavka.kolicina} x {stavka.naziv}{" "}
                      <span className="text-primary">{stavka.cena} din.</span>
                    </h4>

                    {stavka.opis.split("\n").map((op) => (
                      <p
                        style={{
                          fontWeight: "normal",
                          marginTop: 3,
                          marginBottom: 0,
                        }}
                      >
                        {op}
                      </p>
                    ))}

                    {stavka.napomena && stavka.napomena.length > 0 && (
                      <p
                        style={{
                          fontWeight: "normal",
                          marginTop: 3,
                          marginBottom: 3,
                        }}
                      >
                        Napomena: {stavka.napomena}
                      </p>
                    )}
                  </div>
                </div>
                <hr />
              </>
            ))}
          </ModalBody>
          <ModalFooter style={{ display: mobilni ? "block" : "flex", alignItems: "flex-end" }}>
            <div style={{ paddingLeft: 10, flexGrow: 1, width: "100%" }}>
              <p style={{ fontSize: 18, fontWeight: "normal" }}>
                Cena narudžbine:{" "}
                <span className="bold text-primary">
                  {this.props.korpa.reduce((prev, cur) => prev + cur.cena, 0)}{" "}
                  din.
                </span>
              </p>
              {this.state.mesto != null && (
                <>
                  <p style={{ fontSize: 18, fontWeight: "normal" }}>
                    Cena dostave:{" "}
                    <span className="bold text-primary">
                      {this.state.mesto.Zona.cena} din.
                    </span>
                  </p>
                  <p style={{ fontSize: 18, fontWeight: "bold" }}>
                    Ukupno:{" "}
                    <span className="bold text-primary">
                      {this.props.korpa.reduce(
                        (prev, cur) => prev + cur.cena,
                        0
                      ) + this.state.mesto.Zona.cena}{" "}
                      din.
                    </span>
                  </p>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button
                style={{ marginRight: 5,  marginBottom: 0, flexGrow: mobilni ? 1 : 0 }}
                color="secondary"
                onClick={this.props.toggle}
              >
                Zatvori
              </Button>
              <Button
                style={{ marginLeft: 5, marginBottom: 0, flexGrow: mobilni ? 1 : 0 }}
                color="success"
                onClick={this.naruci}
              >
                <i className="fas fa-check mr-2" />
                Naruči
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
