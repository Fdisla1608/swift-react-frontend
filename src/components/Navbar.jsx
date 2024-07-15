import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const items = [
    { label: 'Dashboard', icon: 'pi pi-chart-line', command: () => { setActiveIndex(0); navigate('/dashboard'); } },
    { label: 'Controls', icon: 'pi pi-sliders-v', command: () => { setActiveIndex(1); navigate('/controls'); } },
    { label: 'Terrain', icon: 'pi pi-map', command: () => { setActiveIndex(2); navigate('/terrain'); } }
  ];

  return (
    <div>
      <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    </div>
  );
};

export default Navbar;
