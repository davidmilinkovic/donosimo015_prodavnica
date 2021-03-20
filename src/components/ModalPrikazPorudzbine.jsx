import myFetch from "myFetch";
import React, { Component } from "react";
import Moment from "react-moment";
import { ClockLoader, DotLoader, HashLoader, RingLoader, SyncLoader } from "react-spinners";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

export default class ModalPrikazPorudzbine extends Component {
  state = {
    otvoren: false,
  };

  otvori = () => {
    this.setState({ otvoren: true });
  };
  zatvori = () => {
    this.setState({ otvoren: false });
  };

  izbrisiOtkazanu = () => {
    this.setState({ otvoren: false });
    myFetch("/izbrisi/", "POST", { id: this.props.porudzbina.id }).then(() =>
      this.props.dajPorudzbine(false)
    );
  };

  render() {
    var { porudzbina: por, statusi, bojeStatusa } = this.props;
    if (por == null) return "";
    return (
      <>
        <Modal
          size="lg"
          scrollable
          isOpen={this.state.otvoren}
          className="dmModal"
        >
          <ModalHeader>
            Porudžbina iz <b>{por.partnerString}</b>
          </ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {por.odbijena && (
              <>
                <h5 style={{ fontWeight: "normal", fontSize: 20 }}>
                  Vaša porudžbina je{" "}
                  <b style={{ color: "#d50000" }}>odbijena</b>
                </h5>
                <h5 style={{ fontWeight: "normal", fontSize: 18 }}>
                  Razlog odbijanja: <b>{por.razlogOtkazivanja}</b>
                </h5>
                <Button
                  className="btn-round"
                  block
                  color="info"
                  onClick={this.izbrisiOtkazanu}
                >
                  <i className="fas fa-trash mr-1 text-primary"></i>
                  Izbriši
                </Button>
              </>
            )}
            {!por.odbijena && (
              <>
                {por.status == 7 ? (
                  <>
                    <h5 style={{ fontWeight: "normal", fontSize: 20 }}>
                      Porudžbina je zakazana
                    </h5>
                    {
                      <h5
                        align="center"
                        style={{ fontWeight: "normal", fontSize: 15 }}
                      >
                        <span>
                          Datum i vreme zakazivanja:{" "}
                          <b>
                            <Moment format="DD.MM.YYYY. HH:mm">
                              {por.zakazanaZa}
                            </Moment>
                          </b>
                        </span>
                      </h5>
                    }
                    <Card
                      body
                      style={{
                        backgroundColor: "#e3e3e3",
                        width: "100%",
                        marginBottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ClockLoader
                        css={{ margin: 20 }}
                        color={bojeStatusa[7]}
                        size={100}
                      />
                    </Card>
                  </>
                ) : (
                  <>
                    {!por.potvrdjena && (
                      <>
                        <h5 style={{ fontWeight: "normal", fontSize: 20 }}>
                          Porudžbina se obrađuje...
                        </h5>
                        {
                          <h5
                            align="center"
                            style={{ fontWeight: "normal", fontSize: 15 }}
                          >
                            {por.odgovor != null ? (
                              <span>
                                <b>{por.partnerString}</b> je prihvatio Vašu
                                porudžbinu. Pronalazimo dostavljača za Vas...
                              </span>
                            ) : (
                              <span>
                                Čeka se potvrda od <b>{por.partnerString}</b>...
                              </span>
                            )}
                          </h5>
                        }
                        <Card
                          body
                          style={{
                            backgroundColor: "#e3e3e3",
                            width: "100%",
                            marginBottom: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <RingLoader
                            css={{ margin: 20 }}
                            color={bojeStatusa[0]}
                            size={100}
                          />
                        </Card>
                      </>
                    )}
                    {por.potvrdjena && (
                      <>
                        {por.status != 4 && (
                          <>
                            <h5
                              align="center"
                              style={{ fontWeight: "normal", fontSize: 20 }}
                            >
                              Narudžbina je potvrđena:{" "}
                              <b>
                                {(Math.max(por.vremeDoPartnera, por.odgovor) +
                                  por.vremeDostave) /
                                  60}{" "}
                                minuta
                              </b>
                            </h5>
                            <h5
                              align="center"
                              style={{ fontWeight: "normal", fontSize: 15 }}
                            >
                              Vreme potvrde:{" "}
                              <b>
                                <Moment format="HH:mm">
                                  {por.vremePotvrdjena}
                                </Moment>
                              </b>
                            </h5>
                          </>
                        )}
                        <Card
                          body
                          style={{
                            backgroundColor: "#e3e3e3",
                            width: "100%",
                            marginBottom: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {por.status == 1 && (
                            <HashLoader
                              color={bojeStatusa[por.status]}
                              size={100}
                              css={{ marginTop: 15, marginBottom: 15 }}
                            />
                          )}
                          {por.status == 2 && (
                            <SyncLoader
                              color={bojeStatusa[por.status]}
                              size={20}
                              css={{ marginTop: 10, marginBottom: 10 }}
                            />
                          )}
                          {por.status == 3 && (
                            <DotLoader
                              color={bojeStatusa[por.status]}
                              size={100}
                              css={{ marginTop: 10, marginBottom: 10 }}
                            />
                          )}

                          <h6 style={{ fontSize: 16 }}>Status porudžbine:</h6>
                          <h6
                            style={{
                              color: bojeStatusa[por.status],
                              fontSize: 16,
                            }}
                          >
                            {statusi[por.status]}
                          </h6>
                        </Card>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <Card
              style={{
                backgroundColor: "#e3e3e3",
                width: "100%",
                marginTop: 20,
              }}
            >
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
                  Pregled narudžbine
                </h3>
              </CardHeader>
              <CardBody>
                {por.stavke.map((stavka, index) => (
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
                      </div>
                    </div>
                    {index != por.stavke.length - 1 && <hr />}
                  </>
                ))}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round mb-0"
              color="info"
              onClick={this.zatvori}
            >
              Zatvori
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
