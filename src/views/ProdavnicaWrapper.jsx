import React from "react";
import { useMediaQuery } from "react-responsive";
import Prodavnica from "./Prodavnica";

export default function ProdavnicaWrapper(props) {
  const velikiDesktop = useMediaQuery({ minWidth: 1550 });
  const maliDesktop = useMediaQuery({ minWidth: 1224, maxWidth: 1550 });
  const desktop = useMediaQuery({ minWidth: 1224 });
  const velikiMobilni = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
  const maliMobilni = useMediaQuery({ maxWidth: 768 });
  const mobilni = useMediaQuery({ maxWidth: 1224 });
  const portrait = useMediaQuery({ orientation: "portrait" });

  

  return (
    <Prodavnica
      {...props}
      velikiDesktop={velikiDesktop}
      maliDesktop={maliDesktop}
      desktop={desktop}
      velikiMobilni={velikiMobilni}
      maliMobilni={maliMobilni}
      mobilni={mobilni}
      portrait={portrait}
    />
  );
}
