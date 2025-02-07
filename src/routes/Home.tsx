import React from 'react';
import MapComponent from "../components/common/MapComponent";
import OwnersToolbox from "../components/toolbox/OwnersToolbox";
import PlacePin from "../components/toolbox/PlacePin";
import Footer from "../components/footer/Footer";

const Home = () => {
  return (
    <div>
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
