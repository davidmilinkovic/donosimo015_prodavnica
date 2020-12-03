import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

var initState = {
  ok: true,
  otkaceni: {},
};

export default class ModalOdabirDodataka extends Component {
  state = {
    ...initState,
  };

  klik = (id) => {
    var  otkaceni  = {...this.state.otkaceni};
    if (!otkaceni[id]) {
      if (this.props.polje.tip == 0) otkaceni = {};
      else {
        if (Object.keys(otkaceni).length == this.props.polje.maksDodataka) {
          delete otkaceni[Object.keys(otkaceni)[0]];
        }
      }
      otkaceni[id] = true;
    } else delete otkaceni[id];
    this.setState({ otkaceni });
  };

  proveri = (polje, dodatak) => {
    for (var i = 0; i < polje.kategorije.length; i++)
      for (var j = 0; j < dodatak.kategorije.length; j++)
        if (polje.kategorije[i].id == dodatak.kategorije[j].id) return true;
    return false;
  };

  render() {
    var { polje, dodaci, zatvori, mobilni } = this.props;
    if (polje == null) return "";
    return (
      <>
        <Modal scrollable className="dmModal" isOpen={polje != null}>
          <ModalHeader>
            <b>{polje.naziv}</b>
            {polje.tip == 0 ? (
              <p style={{ marginBottom: 0 }}>Izaberite dodatak</p>
            ) : (
              <p style={{ marginBottom: 0 }}>
                Izaberite dodatke <span hidden={polje.maksDodataka == 0}>(maksimalno {polje.maksDodataka})</span>
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            <ListGroup>
              {dodaci.map((dod) => {
                return this.proveri(polje, dod) ? (
                  <ListGroupItem
                    style={{ cursor: "pointer" }}
                    onClick={() => this.klik(dod.id)}
                    active={this.state.otkaceni[dod.id] != null}
                  >
                    <FormGroup check style={{ display: "inline" }}>
                      <Label style={mobilni ? { top: 5 } : {}} check>
                        <Input
                          checked={this.state.otkaceni[dod.id] != null}
                          type="checkbox"
                          style={{ position: "inherit" }}
                          onClick={() => this.klik(dod.id)}
                        />
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </Label>
                    </FormGroup>
                    <b style={{marginBottom: 5, marginTop: 0}}>{dod.naziv}</b> - {dod.cena} din.
                  </ListGroupItem>
                ) : (
                  ""
                );
              })}
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              onClick={() => {
                this.setState(initState);
                zatvori();
              }}
            >
              Zatvori
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.setState({...initState});
                var niz = this.props.dodaci.filter(
                  (dod) => this.state.otkaceni[dod.id] != null
                );
                this.props.potvrdi(niz, this.props.polje.id);
                zatvori();
              }}
            >
              <i className="fas fa-check mr-2" />
              Potvrdi
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
