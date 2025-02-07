import React, { useState } from 'react';
import MapComponent from "../components/common/MapComponent";
import OwnersToolbox from "../components/toolbox/OwnersToolbox";
import PlacePin from "../components/toolbox/PlacePin";
import Footer from "../components/footer/Footer";
import Drawer from '../components/drawer/Drawer';
import DrawerButton from '../components/drawer/DrawerButton';

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <DrawerButton toggleDrawer={toggleDrawer} />
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      {/* Main Components */}
      <OwnersToolbox />
      <MapComponent />

      {/* Toolbox Components */}
      <PlacePin />

      {/* Footer Components */}
      <Footer />
    </div>
  );
};

export default Home;
