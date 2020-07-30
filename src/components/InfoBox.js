import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import "./Infobox.css";

export default function InfoBox({
  active,
  cases,
  isCases,
  isRecovered,
  isDeaths,
  title,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isCases && "infoBox--red"
      } ${isRecovered && "infoBox--green"} ${isDeaths && "infoBox--grey"}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`${isCases && "infoBox--red"} ${
            isRecovered && "infoBox--green"
          } ${isDeaths && "infoBox--grey"}`}
        >
          {cases}
        </h2>
        <Typography className="infototal" color="textSecondary">
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
}
