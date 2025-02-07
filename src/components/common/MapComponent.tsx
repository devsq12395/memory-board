import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import MapPin from "./MapPin";

const containerStyle = {
  width: "100vw",
  height: "88vh",
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
    <div className="w-screen m-0 p-0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        options={{
          mapId: mapId,
          fullscreenControl: false,
          streetViewControl: false, // Disable street view control
          mapTypeControl: false, // Disable map type (satellite view) control
        }}
      >
        {map && (
          <>
            <MapPin
              map={map}
              position={{ lat: 37.7749, lng: -122.4194 }}
              mainImageUrl="https://res.cloudinary.com/dpzxu1ykr/image/upload/v1716463671/samples/upscale-face-1.jpg"
              smallImageUrl="https://res.cloudinary.com/dkloacrmg/image/upload/v1738856080/memory-board/wazt3tcuhtttelstzxvn.png"
              pinSymbolUrl="https://res.cloudinary.com/dkloacrmg/image/upload/v1738857436/memory-board/ycqrh4wugzru3gywq2rp.png"
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
