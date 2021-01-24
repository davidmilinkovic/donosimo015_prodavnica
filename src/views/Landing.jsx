import React from "react";
import { Button, Container } from "reactstrap";

function Landing() {
  let pageHeader = React.createRef();

  return (
    <>
      <div
        className="page-header bg-info"
        style={{
          position: "fixed",
          top: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <Container>
          <div className="motto text-center">
            <h3 style={{ fontSize: "17px" }}>
              Da bi ste koristili usluge Donosimo 015, potrebno je da potvrdite
              Vaš broj telefona. Vaš broj će biti korišćen isključivo u slučaju
              kada je potrebno da Vas kontaktiramo zbog detalja oko porudžbine,
              i garantujemo da ga nećemo zloupotrebiti ni na koji način. Potvrdu
              je potrebno izvršiti samo jednom.
            </h3>
            <br />
            <Button
              className="btn-round mr-1"
              color="info"
              target="_blank"
              size="lg"
              onClick={() => {
                window.location = "/verifikacija";
              }}
            >
              <i className="fa fa-play mr-1 text-primary" />
              Nastavi
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Landing;
