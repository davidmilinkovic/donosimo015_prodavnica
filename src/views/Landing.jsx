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
            <img src={require("../img/ikonica.png")} />
            <h1 style={{marginTop: 60}} className='bold'>Donosimo015</h1>
            <h3>Brzo i jednostavno naručivanje</h3>
            <br />
            <Button
              className="btn-round mr-1"
              color="info"
              target="_blank"
              
              size="lg"
              onClick={() => {
                localStorage.setItem("landing", true);
                window.location.reload();
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
