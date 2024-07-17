import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Chart } from "primereact/chart";
import { Carousel } from "primereact/carousel";
import { Card } from 'primereact/card';


import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/dashboard.css";

function getDayStatus(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffInDays = (inputDate - today) / (1000 * 60 * 60 * 24);
  if (diffInDays === 0) {
    return "Hoy";
  } else if (diffInDays === -1) {
    return "Ayer";
  } else if (diffInDays === 1) {
    return "Mañana";
  } else {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return daysOfWeek[inputDate.getDay()];
  }
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [humidityData, setHumidityData] = useState([]);

  const [rainData, setRainData] = useState([]);
  const [sunData, setSunData] = useState([]);
  const [modules, setModules] = useState([
    { moduleId: "206730913373132", name: "Sensor Module 1" },
    { moduleId: "esp_001", name: "ESP32" },
  ]);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://maptest.ddns.net:3003/api/sensors/206730913373132")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok: " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setHumidityData(data.humidity);
          setRainData(data.rain);
          setSunData(data.sun);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 1000);

    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=f3e9d9ebbc0c4719aed20645241407&q=19.4649572929804,-70.70426520453394&days=7`
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      animation: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
    setChartOptions(options);

    fetchWeatherData();
    return () => clearInterval(intervalId);
  }, []);

  const moduleTemplate = (module) => {
    return (
      <Card title={module.name} subTitle={module.moduleId} className="md:w-25rem ">
      </Card>
    );
  };

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

  return (
    <section>
      <div className="internet-info-panel">
        <div className="weather-panel"></div>
        <div className="forecast-panel">
          <DataTable value={weatherData} loading={loading} dataKey="id" emptyMessage="No Weather data found">
            <Column field="date" header="Date" style={{ minWidth: "12rem" }} />
            <Column field="condition" header="Condition" style={{ minWidth: "12rem" }} body={conditionBodyTemplate} />
            <Column field="min_temp" header="Min Temp (°C)" style={{ minWidth: "12rem" }} />
            <Column field="temp" header="Avg Temp (°C)" style={{ minWidth: "12rem" }} body={temperatureBodyTemplate} />
            <Column field="max_temp" header="Max Temp (°C)" style={{ minWidth: "12rem" }} />
          </DataTable>
        </div>
      </div>
      <div className="modules-sensors">
        <Carousel
          value={modules}
          numScroll={1}
          numVisible={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={moduleTemplate}
        />
      </div>
      <div className="modules-sensor-chart">
        <TabView>
          <TabPanel header="Humidity">
            <Chart type="line" data={humidityData} options={chartOptions} />
          </TabPanel>
          <TabPanel header="Rain">
            <Chart type="line" data={rainData} options={chartOptions} />
          </TabPanel>
          <TabPanel header="Sun">
            <Chart type="line" data={sunData} options={chartOptions} />
          </TabPanel>
        </TabView>
      </div>
    </section>
  );
};

export default Dashboard;
