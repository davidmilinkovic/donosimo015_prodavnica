import React, { Component } from "react";
import Button from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import Input from "reactstrap/lib/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import firebase from "firebase/app";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Modal from "reactstrap/lib/Modal";
export default class Verifikacija extends Component {
  state = {
    telefon: "381",
    modalKod: false,
    kod: "",
    modalUspesno: false,
    alertGreska: false,
  };

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }

  potvrdi = () => {
    var phoneNumber = "+" + this.state.telefon;

    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        this.setState({ modalKod: true });
      })
      .catch(function (error) {
        // Error; SMS not sent
        // ...
        alert(error);
      });
  };

  verifikuj = () => {
    var code = this.state.kod;
    var credential = firebase.auth.PhoneAuthProvider.credential(
      window.confirmationResult.verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        this.setState({ alertGreska: true });
      });
  };

  render() {
    return (
      <>
        <Modal  fade isOpen={this.state.modalKod} className="dmModal">
          <ModalHeader>Unesite verifikacioni kod</ModalHeader>
          <ModalBody>
            <p style={{ fontWeight: "normal" }}>
              SMS porukom smo Vam poslali verifikacioni kod. Unesite ga ovde.
            </p>
            <Input
              size="lg"
              placeholder="Unesite ovde kod..."
              block
              value={this.state.kod}
              onChange={(e) => this.setState({ kod: e.target.value })}
              style={{ textAlign: "center" }}
            />
          </ModalBody>
          <ModalFooter>
            <Button block color="info" onClick={this.verifikuj} className="btn-round">
              <i className="fas fa-check text-primary mr-2" />
              Potvrdi
            </Button>
          </ModalFooter>
        </Modal>
        <Modal  fade isOpen={this.state.alertGreska} className="dmModal">
          <ModalHeader>Greška</ModalHeader>
          <ModalBody>
            <p style={{ fontWeight: "normal" }}>
              Uneti verifikacioni kod nije validan.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                this.setState({ alertGreska: false });
              }}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>
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
            <h5 align="center" style={{ color: "white" }}>
              Da bi ste koristili servis Donosimo 015, potrebno je da unesete
              Vaš broj telefona.
            </h5>

            <PhoneInput
              containerStyle={{
                width: "100%",

                marginTop: 25,
                marginBottom: 25,
                height: 40,
              }}
              inputStyle={{
                width: "100%",
              }}
              country="rs"
              placeholder="Unesite broj telefona..."
              value={this.state.telefon}
              countryCodeEditable={false}
              onChange={(telefon) => this.setState({ telefon })}
            />

            <div
              style={{
                marginTop: 0,
                marginBottom: 10,
                display: "flex",
                justifyContent: "center",
              }}
              id="recaptcha-container"
            ></div>

            <h5 align="center" style={{ color: "white" }}>
              Kada potvrdite broj telefona, stići će Vam SMS poruka sa
              verifikacionim kodom koji treba da unesete u sledećem koraku.
            </h5>
            <Button
              color="info"
              className="mt-4 mb-4 btn-round"
              block
              size="lg"
              onClick={this.potvrdi}
            >
              <i className="fas fa-check mr-2 text-primary" />
              Potvrdi
            </Button>
          </Container>
        </div>
      </>
    );
  }
}
