import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { useNavigate } from "react-router-dom";

const LogOutNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const items = [
    {
      label: "Login",
      command: () => {
        navigate("/login");
      },
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <TabMenu
        model={items}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
    </div>
  );
};

export default LogOutNavbar;
