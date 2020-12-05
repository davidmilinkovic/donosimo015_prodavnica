import React, { Component } from "react";
import { Spinner } from "reactstrap";

export default class Loader extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "black",
          width: "100%",
          height: "100%",
          position: "absolute",
          borderRadius: "inherit",
          display: this.props.loading ? "flex" : "none",
          zIndex: 100,
          opacity: 0.8,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>
          <Spinner color="primary" style={{ width: "50px", height: "50px" }} />
          <p style={{ color: "white" }}>Učitavanje...</p>
        </p>
      </div>
    );
  }
}
