import myFetch from "myFetch";
import React, { Component } from "react";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
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
    invalid: false,
    napomena: "",
    modalPartnerNeaktivan: false
  };

  naruci = () => {
    var invalid = this.state.mesto == null || this.state.adresa.length == 0;
    this.setState({ invalid });
    if (invalid) return;
    var body = {};
    body.ime = this.state.ime;
    body.adresa = this.state.adresa;
    body.telefon = this.props.telefon;
    body.firebaseUID = this.props.firebaseUID;
    body.napomena = this.state.napomena;
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
      if (res.partnerNeaktivan) {
        this.setState({ modalPartnerNeaktivan: true });
      } else {
        this.props.isprazniKorpu();
        this.props.dajPorudzbine(false);
        this.props.prikaziPorudzbinu(res.porudzbina);
      }
      this.props.toggle();
    });
  };

  render() {
    var { mobilni } = this.props;
    return (
      <>
        <Modal isOpen={this.state.invalid} className="dmModal">
          <ModalHeader>Greška</ModalHeader>
          <ModalBody style={{ fontSize: 15, fontWeight: "normal" }}>
            Morate popuniti sva polja označena sa (*).
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round mb-0"
              color="info"
              onClick={() => this.setState({ invalid: false })}
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalPartnerNeaktivan} className="dmModal">
          <ModalHeader>Greška</ModalHeader>
          <ModalBody style={{ fontSize: 15, fontWeight: "normal" }}>
            Žao nam je, partner je prestao sa radom.
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round mb-0"
              color="info"
              onClick={() => this.setState({ modalPartnerNeaktivan: false })}
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
        
        <Modal
          fade
          scrollable
          className="dmModal"
          isOpen={this.state.dialogMesto}
        >
          <ModalHeader>Izaberite mesto dostave</ModalHeader>
          <ModalBody>
            {this.props.mesta.map((mesto) => (
              <Button
                color="secondary"
                className="btn-round"
                block
                onClick={() => this.setState({ dialogMesto: false, mesto })}
              >
                {mesto.naziv} ({mesto.Zona.cena} din.)
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round"
              onClick={() => this.setState({ dialogMesto: false })}
              color="info"
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          fade
          size="lg"
          scrollable
          className="dmModal"
          isOpen={this.props.otvoren}
        >
          <ModalHeader>Naručivanje</ModalHeader>
          <ModalBody>
            <p
              align="center"
              style={{
                marginTop: 0,
                marginBottom: 15,
                fontWeight: "normal",
                fontSize: 18,
              }}
            >
              Unesite podatke za dostavu
            </p>
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
                      color="info"
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
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="Napomena">Napomena</Label>
                    <Input
                      type="textarea"
                      name="Napomena"
                      rows="5"
                      id="Napomena"
                      placeholder="Unesite napomene u vezi sa porudžbinom..."
                      onChange={(e) =>
                        this.setState({ napomena: e.target.value })
                      }
                      value={this.state.napomena}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>

            <Card style={{ backgroundColor: "#e3e3e3" }}>
              <CardHeader>
                <h3
                  align="center"
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  <i className="fas fa-list mr-2 text-primary" />
                  Pregled porudžbine
                </h3>
              </CardHeader>
              <CardBody>
                {this.props.korpa.map((stavka, index) => (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      {stavka.slika && stavka.slika != "" && (
                        <img
                          style={{
                            width: 100,
                            marginRight: 10,
                            borderRadius: 10,
                          }}
                          src={
                            process.env.REACT_APP_SERVER +
                            "/slike/artikli/" +
                            stavka.slika
                          }
                        />
                      )}
                      <div style={{ flexGrow: 1 }}>
                        <h4
                          style={{
                            fontWeight: "bold",
                            marginTop: 0,
                            fontSize: 16,
                          }}
                        >
                          {stavka.kolicina} x {stavka.naziv}{" "}
                          <span className="text-primary">
                            {stavka.cena} din.
                          </span>
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
                    {index != this.props.korpa.length - 1 && <hr />}
                  </>
                ))}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter
            style={{
              display: mobilni ? "block" : "flex",
              alignItems: "flex-end",
            }}
          >
            <div style={{ paddingLeft: 10, flexGrow: 1, width: "100%" }}>
              <p style={{ fontSize: 18, fontWeight: "normal" }}>
                Cena porudžbine:{" "}
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
                style={{
                  marginRight: 5,
                  marginBottom: 0,
                  flexGrow: mobilni ? 1 : 0,
                }}
                color="info"
                className="btn-round"
                onClick={this.props.toggle}
              >
                Zatvori
              </Button>
              <Button
                style={{
                  marginLeft: 5,
                  marginBottom: 0,
                  flexGrow: mobilni ? 1 : 0,
                }}
                color="primary"
                className="btn-round"
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
