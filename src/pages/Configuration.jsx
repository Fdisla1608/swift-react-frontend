import React, { useState } from "react";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { Column } from "primereact/column";

const Configuration = () => {
  const [page, setPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const moduleTemplate = (module) => {
    return <Card title={module.name} subTitle={module.moduleId} className="md:w-25rem "></Card>;
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (newValue.trim().length > 0) rowData[field] = newValue;
    else event.preventDefault();
  };

  const onPageChange = (e) => {
    setPage(e.page);
    setCurrentIndex(e.page);
  };
  return (
    <div className="modules-sensors">
      <Carousel
        value={module}
        numScroll={1}
        numVisible={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={moduleTemplate}
        page={page}
        onPageChange={onPageChange}
      />
      <DataTable value={module[0].sensors} tableStyle={{ minWidth: "50rem" }}>
        <Column field="category" header="Categoria"></Column>
        <Column
          field="description"
          header="Descripcion"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column field="code" header="ID"></Column>
        <Column field="coord" header="Coordenadas"></Column>
      </DataTable>
    </div>
  );
};

export default Configuration;
