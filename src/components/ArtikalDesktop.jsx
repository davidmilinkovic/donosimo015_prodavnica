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

export default class ArtikalDesktop extends Component {
  state = {};

  render() {
    var { data } = this.props;

    return (
      <>
        <Card className="dmCard cardArtikal">
          <CardImg
            top
            src={
              data.slika != ""
                ? process.env.REACT_APP_SERVER + "/slike/artikli/" + data.slika
                : require("img/default.jpg")
            }
          />

          <CardBody>
            <CardTitle>{data.naziv}</CardTitle>

            <CardText>
              <div className="card-cena">Cena: <span className="text-primary">{data.cena} din.</span></div>
              {data.opis && data.opis.length > 0 ? (
                <p style={{ marginBottom: 0 }}>{data.opis}</p>
              ) : (
                ""
              )}
            </CardText>
          </CardBody>
          <CardFooter>
            <Button block color="info" className="btn-round" onClick={this.props.dodajUKorpu}>
              <i className="fas text-primary fa-shopping-cart mr-2" />
              Dodaj u korpu
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }
}
