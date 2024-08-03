import React, { useState, useEffect } from "react";

import { TabView, TabPanel } from "primereact/tabview";
import { Chart } from "primereact/chart";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/dashboard.css";

import GaugeChart from "../components/GaugeChart";
import GaugeSun from "../components/GaugeSun";

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
  const [chartOptions, setChartOptions] = useState({});
  const [humidityData, setHumidityData] = useState([]);
  const [sunData, setsunData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("sh01");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(0);

  const [module, setModules] = useState([
    {
      moduleId: "246642630964476",
      name: "Modulo Edge",
      sensors: [
        {
          label: "Humedad",
          code: "HUM",
          items: [{ label: "Sensor Humedad Suelo", value: "sh01" }],
        },
        {
          label: "Luminosidad",
          code: "LUX",
          items: [{ label: "Sensor Luminosidad", value: "lm01" }],
        },
      ],
    },
    {
      moduleId: "206730913373132",
      name: "Sensor Module 1",
      sensors: [
        {
          label: "Humedad",
          code: "HUM",
          items: [
            { label: "Sensor Humedad Ambiental", value: "sh01" },
            { label: "Sensor Humedad Suelo", value: "sh02" },
          ],
        },
        {
          label: "Temperatura",
          code: "TEMP",
          items: [{ label: "Sensor Temperatura Ambiental", value: "tp01" }],
        },
        {
          label: "Luminosidad",
          code: "LUX",
          items: [{ label: "Principal", value: "LM01" }],
        },
      ],
    },
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
      fetch(`http://maptest.ddns.net:3003/api/sensors/${module[currentIndex].moduleId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok: " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setHumidityData(data.humidity);
          setsunData(data.sun);
        })
        .catch((error) => {
          //console.error("Error: 404", );
        });
    }, 1000);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      maxHeight: "500px",
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
    return () => clearInterval(intervalId);
  }, [selectedSensor, currentIndex]);

  const moduleTemplate = (module) => {
    return <Card title={module.name} subTitle={module.moduleId} className="md:w-25rem "></Card>;
  };

  const onPageChange = (e) => {
    setPage(e.page);
    setCurrentIndex(e.page);
  };

  const groupTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <section>
      <div className="humity-panel">
        <div className="humity-sensors">
          <Carousel
            value={module}
            numScroll={1}
            numVisible={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={moduleTemplate}
            page={page}
            onPageChange={onPageChange}
          />
          <ListBox
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.value)}
            options={module[currentIndex].sensors}
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            optionGroupTemplate={groupTemplate}
            className="w-full center h-full md:w-14rem"
            listStyle={{ maxHeight: "500px" }}
          />
        </div>
        <TabView className="humity-charts">
          <TabPanel header="Gauge">
            {selectedSensor === "sh01" ? (
              <GaugeChart
                data={humidityData?.datasets?.[0]?.data?.[11] !== undefined ? humidityData.datasets[0].data[11] : 0}
              />
            ) : selectedSensor === "lm01" ? (
              <GaugeSun data={sunData?.datasets?.[0]?.data?.[11] !== undefined ? sunData.datasets[0].data[11] : 0} />
            ) : (
              <div>Default component or fallback UI</div>
            )}
          </TabPanel>
          <TabPanel header="Registro">
            {selectedSensor === "sh01" ? (
              <Chart type="line" data={humidityData} options={chartOptions} />
            ) : selectedSensor === "lm01" ? (
              <Chart type="line" data={sunData} options={chartOptions} />
            ) : (
              <div>Default component or fallback UI</div>
            )}
          </TabPanel>
        </TabView>
      </div>
    </section>
  );
};

export default Dashboard;
