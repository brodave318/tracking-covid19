import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import numeral from "numeral";

import InfoBox from "../src/components/InfoBox";
import Map from "../src/components/Map";
import Table from "../src/components/Table";
import LineGraph from "../src/components/LineGraph";

import "./App.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // Onload display data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  });
  // Get countries for dropdown list from data
  useEffect(() => {
    const countriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) =>
        response.json().then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            key: country.countryInfo.lat + country.countryInfo.long,
          }));
          const sortedData = data.sort((a, b) => b[casesType] - a[casesType]);

          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        })
      );
    };
    countriesData();
  }, [casesType]);

  // Get selected country data to be displayed
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  const addPlusSign = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Tracking COVID-19</h1>
          <div className="app__headerImage"></div>
          <FormControl className="app__dropdown">
            <Select value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.key} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isCases
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            cases={addPlusSign(countryInfo.todayCases)}
            total={addPlusSign(countryInfo.cases)}
          />
          <InfoBox
            isRecovered
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={addPlusSign(countryInfo.todayRecovered)}
            total={addPlusSign(countryInfo.recovered)}
          />
          <InfoBox
            isDeaths
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={addPlusSign(countryInfo.todayDeaths)}
            total={addPlusSign(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Total {casesType} by Country</h3>
          <Table countries={tableData} casesType={casesType} />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}
