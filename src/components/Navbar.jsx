import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const items = [
    {
      label: "Clima",
      icon: "pi pi-sun",
      command: () => {
        setActiveIndex(0);
        navigate("/weather");
      },
    },
    {
      label: "Sensores",
      icon: "pi pi-chart-line",
      command: () => {
        setActiveIndex(1);
        navigate("/dashboard");
      },
    },
    {
      label: "Mapa",
      icon: "pi pi-map",
      command: () => {
        setActiveIndex(2);
        navigate("/terrain");
      },
    },
    {
      label: "Configuracion",
      icon: "pi pi-map",
      command: () => {
        setActiveIndex(3);
        navigate("/configuration");
      },
    },
  ];

  return (
    <div>
      <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    </div>
  );
};

export default Navbar;
