import React from "react";
import numeral from "numeral";

import "./Table.css";

export default function Table({ countries, casesType }) {
  return (
    <div className="table">
      {countries.map((country) => (
        <tr key={country.country}>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country[casesType]).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}
