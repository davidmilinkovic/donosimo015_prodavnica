import React, { Component } from "react";
import Button from "reactstrap/lib/Button";
import ButtonGroup from "reactstrap/lib/ButtonGroup";

export default class StavkaKorpeDesktop extends Component {
  render() {
    var { stavka } = this.props;
    return (
      <div
        style={{
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          borderBottom: "2px solid #eeeeee",
          columnGap: 10,
        }}
      >
        {false && (
          <img
            style={{ width: "100%", padding: 5, borderRadius: 10 }}
            src={
              stavka.slika != ""
                ? process.env.REACT_APP_SERVER +
                  "/slike/artikli/" +
                  stavka.slika
                : require("./img/default.jpg")
            }
          />
        )}
        <div>
          <h5
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginBottom: 0,
              paddingTop: 0,
            }}
          >
            {stavka.kolicina} x {stavka.naziv}
          </h5>
          <p style={{ fontWeight: "normal", marginTop: 0, marginBottom: 0 }}>
            {stavka.opis.split("\n").map((val) =>
              val.length > 0 ? (
                <>
                  {val}
                  <br />
                </>
              ) : (
                ""
              )
            )}
          </p>
          {stavka.napomena && stavka.napomena.length > 0 && (
            <p style={{ fontWeight: "normal", marginTop: 0, marginBottom: 0 }}>
              <b>Napomena: </b>
              {stavka.napomena}
            </p>
          )}
          <p
            style={{ marginTop: 0, marginBottom: 0, fontWeight: "bold" }}
            className="text-primary"
          >
            {stavka.cena} din.
          </p>
        </div>

        <Button
          onClick={this.props.brisi}
          style={{
            height: "25px",
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 0,
          }}
          color="danger"
          size="sm"
        >
          <i className="fas fa-trash" />
        </Button>
      </div>
    );
  }
}
