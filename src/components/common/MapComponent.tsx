import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import MapPin from "./MapPin";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 37.7749, // Default latitude (San Francisco)
  lng: -122.4194, // Default longitude
};

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string;

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen m-0 p-0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={3}
        onLoad={onLoad}
        options={{
          mapId: mapId, // Pass mapId through options
        }}
      >
        {map && (
          <>
            <MapPin
              map={map}
              position={{ lat: 37.7749, lng: -122.4194 }}
            />
            <MapPin
              map={map}
              position={{ lat: 34.0522, lng: -118.2437 }}
              content={"Los Angeles Pin"}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
