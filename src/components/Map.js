import React from "react";
import { Circle, Map as LeafletMap, Popup, TileLayer } from "react-leaflet";
import numeral from "numeral";

import "./Map.css";

const casesTypeColors = {
  cases: {
    hex: "rgb(219, 0, 0)",
    multiplier: 800,
  },
  recovered: {
    hex: "rgb(11, 179, 11)",
    multiplier: 1200,
  },
  deaths: {
    hex: "rgb(90, 90, 90)",
    multiplier: 2000,
  },
};

export default function Map({ casesType, center, countries, zoom }) {
  const showDataOnMap = (data, casesType = "cases") =>
    countries.map((country) => (
      <Circle
        key={country.country}
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="popup-container">
            <div
              className="popup-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className="popup-name">{country.country}</div>
            <div className="popup-cases">
              <span>Cases:</span> {numeral(country.cases).format("0,0")}
            </div>
            <div className="popup-recovered">
            <span>Recovered:</span> {numeral(country.recovered).format("0,0")}
            </div>
            <div className="popup-deaths">
            <span>Deaths:</span> {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    ));

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}