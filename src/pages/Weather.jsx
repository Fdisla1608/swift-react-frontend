import React, { useState, useEffect } from "react";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";

import "../styles/weather.css";

import sample from "../styles/images/P1330737.mp4";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);

  const conditionBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.condition}</span>
      </div>
    );
  };

  const temperatureBodyTemplate = (rowData) => {
    return <ProgressBar value={rowData.temp} showValue={true} style={{ height: "6px" }} />;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=f3e9d9ebbc0c4719aed20645241407&q=19.4649572929804,-70.70426520453394&days=7&lang=es`
        );
        const data = response.data;
        const formattedData = data.forecast.forecastday.map((day, index) => ({
          id: index,
          date: day.date,
          condition: day.day.condition.text,
          temp: day.day.avgtemp_c,
          max_temp: day.day.maxtemp_c,
          min_temp: day.day.mintemp_c,
        }));
        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeatherData();
  }, []);

  return (
    <div className="forecast-panel">
      <video autoPlay muted loop className="background-video">
        <source src={sample} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay">
        <DataTable
          value={weatherData}
          dataKey="id"
          emptyMessage="No Weather data found"
          className="forecast-data-table"
        >
          <Column field="date" header="Date" style={{ minWidth: "12rem" }} />
          <Column field="condition" header="Condition" style={{ minWidth: "12rem" }} body={conditionBodyTemplate} />
          <Column field="min_temp" header="Min Temp (°C)" style={{ minWidth: "12rem" }} />
          <Column field="temp" header="Avg Temp (°C)" style={{ minWidth: "12rem" }} body={temperatureBodyTemplate} />
          <Column field="max_temp" header="Max Temp (°C)" style={{ minWidth: "12rem" }} />
        </DataTable>
      </div>
    </div>
  );
};

export default Weather;
