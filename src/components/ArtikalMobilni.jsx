import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";

export default class ArtikalMobilni extends Component {
  state = {};

  render() {
    var { data } = this.props;

    return (
      <>
        <Card className="dmCard cardArtikalMobilni">
          <CardBody>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: 10,
              }}
            >
              {data.slika != "" && (
                <img
                  className="card-img"
                  src={
                    process.env.REACT_APP_SERVER +
                    "/slike/artikli/" +
                    data.slika
                  }
                />
              )}
              <div>
                <CardTitle>{data.naziv}</CardTitle>

                <CardText>
                  <div className="card-cena text-primary">Cena: {data.cena} din.</div>
                  {data.opis && data.opis.length > 0 ? (
                    <p style={{ marginBottom: 0 }}>{data.opis}</p>
                  ) : (
                    ""
                  )}
                </CardText>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              block
              color="info"
              className="btn-round"
              size="sm"
              style={{ margin: 0 }}
              onClick={this.props.dodajUKorpu}
            >
              <i className="fas fa-shopping-cart mr-2 text-primary" />
              Dodaj u korpu
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }
}
