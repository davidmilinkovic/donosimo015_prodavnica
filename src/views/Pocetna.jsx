import myFetch from "myFetch";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardColumns from "reactstrap/lib/CardColumns";
import CardImg from "reactstrap/lib/CardImg";
import CardSubtitle from "reactstrap/lib/CardSubtitle";
import CardText from "reactstrap/lib/CardText";
import CardTitle from "reactstrap/lib/CardTitle";
import Container from "reactstrap/lib/Container";
import Jumbotron from "reactstrap/lib/Jumbotron";
import Row from "reactstrap/lib/Row";

export default class Pocetna extends Component {
  render() {
    return (
      <div style={{ paddingTop: 70}}>
        <Container>
          <Card style={{backgroundColor: "#e3e3e3"}}>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexFlow: "column",
                }}
              >
                <img
                  src={require("img/ikonica.png")}
                  style={{ width: 150, borderRadius: 10 }}
                />
                <div>
                  <h1 className="display-5" align="center">
                    Dobrodošli!
                  </h1>
                  <p className="lead" align="center">
                    Izaberite koju uslugu želite da zatražite, zatim kreirajte
                    porudžbinu i mi ćemo je u najkraćem roku izvršiti!
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="naslovKategorije">
            <h4 align="center" style={{ fontWeight: "normal", fontSize: 26 }}>
              Naši partneri
            </h4>
          </div>{" "}
          <CardColumns style={{ paddingTop: 25 }}>
            {this.props.partneri.map((partner) => (
              <Card style={{backgroundColor: "#e3e3e3"}}>
                <CardBody>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      columnGap: "10px",
                    }}
                  >
                    {partner.slika && partner.slika != "" && (
                      <img
                        src={
                          process.env.REACT_APP_SERVER +
                          "/slike/partneri/" +
                          partner.slika
                        }
                        style={{ width: 100, borderRadius: 10 }}
                      />
                    )}
                    <div>
                      <CardTitle
                        tag="h2"
                        style={{ fontWeight: "normal", fontSize: 28 }}
                      >
                        {partner.naziv}
                      </CardTitle>
                      <CardSubtitle
                        tag="h6"
                        className={
                          "mb-2 text-muted " +
                          (partner.aktivan ? "text-success" : "text-danger")
                        }
                      >
                        {partner.aktivan ? "Otvoren " : "Zatvoren "} za
                        narudžbine
                      </CardSubtitle>
                      <CardText>{partner.opis}</CardText>
                    </div>
                  </div>
                  <Link to={"/" + partner.naziv}>
                    <Button
                      disabled={!partner.aktivan}
                      block
                      className="mt-3 btn-round"
                      color="info"
                    >
                      <i className="fas fa-shopping-cart text-primary mr-2" /> Naruči
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </CardColumns>
        </Container>
      </div>
    );
  }
}
