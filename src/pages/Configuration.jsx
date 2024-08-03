import React, { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";

const Configuration = () => {
  const [page, setPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sensorType, setSensorTypes] = useState({ label: "Humedad", code: "HUM" });
  const [selectedSensors, setSelectedSensor] = useState({});
  const [zone, setZones] = useState({});
  const [terrains, setTerrains] = useState({});

  const [modules] = useState([
    {
      moduleId: "246642630964476",
      name: "Modulo Edge",
      sensors: [
        {
          label: "Humedad",
          code: "HUM",
          items: [{ label: "Sensor Humedad Suelo", code: "sh01" }],
        },
        {
          label: "Luminosidad",
          code: "LUM",
          items: [{ label: "Sensor Luminosidad", code: "lm01" }],
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
            { label: "Sensor Humedad Ambiental", code: "sh01" },
            { label: "Sensor Humedad Suelo", code: "sh02" },
          ],
        },
        {
          label: "Temperatura",
          code: "TMP",
          items: [{ label: "Sensor Temperatura Ambiental", code: "tp01" }],
        },
        {
          label: "Luminosidad",
          code: "LUM",
          items: [{ label: "Principal", code: "LM01" }],
        },
      ],
    },
  ]);

  const sensorTypes = [
    { label: "Humedad", code: "HUM" },
    { label: "Luminosidad", code: "LUM" },
    { label: "Temperatura", code: "TMP" },
  ];

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

  const moduleTemplate = (module) => {
    return <Card title={module.name} subTitle={module.moduleId} className="md:w-25rem "></Card>;
  };

  const zoneBodyTemplate = (rowData) => {
    return (
      <Dropdown
        value={zone[rowData.terrainId] || null}
        onChange={(e) => setZones({ ...zone, [rowData.terrainId]: e.value })}
        options={terrains}
        optionLabel="terrainName"
        placeholder="Select a Type"
        className="w-full md:w-14rem"
      />
    );
  };

  const getItemsByModuleIdAndCode = (moduleId, code) => {
    const module = modules.find((mod) => mod.moduleId === moduleId);
    if (!module) return []; // Retorna vacío si no se encuentra el módulo

    const sensor = module.sensors.find((sensor) => sensor.code === code);
    return sensor ? sensor.items : []; // Retorna los items si se encuentra el sensor, si no, vacío
  };

  const fetchTerrains = async () => {
    try {
      const response = await fetch("http://maptest.ddns.net:3003/api/terrains");

      if (!response.ok) {
        throw new Error("Error al obtener los terrenos");
      }
      const data = await response.json();
      setTerrains(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setSelectedSensor(getItemsByModuleIdAndCode(modules[currentIndex].moduleId, sensorType.code));
    fetchTerrains();
  }, [sensorType, currentIndex]);

  const onPageChange = (e) => {
    setPage(e.page);
    setCurrentIndex(e.page);
  };

  return (
    <div className="modules-sensors">
      <Carousel
        value={modules}
        numScroll={1}
        numVisible={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={moduleTemplate}
        page={page}
        onPageChange={onPageChange}
      />
      <SelectButton value={sensorType} onChange={(e) => setSensorTypes(e.value)} options={sensorTypes} />
      <DataTable value={selectedSensors}>
        <Column field="code" header="Codigo"></Column>
        <Column field="label" header="Etiqueta"></Column>
        <Column field="zone" header="Zonas" body={zoneBodyTemplate}></Column>
      </DataTable>
    </div>
  );
};

export default Configuration;
