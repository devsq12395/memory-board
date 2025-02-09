import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import MapPin from "./MapPin";
import { getUserMemories } from "../../services/mapService";

import { useUser } from "../contexts/UserContext";
import { useToolbox } from "../contexts/ToolboxContext";

interface MapComponentProps {
  onMapClick: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: "100vw",
  height: "88vh",
};

const center = {
  lat: 37.7749, // Default latitude (San Francisco)
  lng: -122.4194, // Default longitude
};

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string;

const MapComponent: React.FC<MapComponentProps> = ({ onMapClick }) => {
  const userContext = useUser();
  const toolboxContext = useToolbox();

  const [memories, setMemories] = useState<any[]>([]);

  {/* Fetch memories function */}
  const fetchMemories = async () => {
    if (userContext.uid) {
      try {
        const userMemories = await getUserMemories(userContext.uid);
        setMemories(userMemories || []);
      } catch (error) {
        console.error('Failed to fetch user memories:', error);
      }
    }
  };

  {/* Fetch user memories whenever userContext.uid changes */}
  useEffect(() => {
    fetchMemories();
  }, [userContext.uid]);

  {/* Fetch user memories whenever isRefreshPins is true */}
  useEffect(() => {
    if (toolboxContext.isRefreshPins) {
      toolboxContext.setIsRefreshPins(false);
      fetchMemories();
    }
  }, [toolboxContext.isRefreshPins]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);

    mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onMapClick(lat, lng);
      }
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen m-0 p-0">
      {/* Create the Google Map */}
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
            {/* Add map pins */}
            {memories.map((memory, index) => (
              <MapPin
                key={index}
                map={map}
                position={{ lat: memory.pos_lat, lng: memory.pos_lng }}
                mainImageUrl={memory.thumbnail_url}
                smallImageUrl={memory.bottom_img_url}
                pinSymbolUrl="https://res.cloudinary.com/dkloacrmg/image/upload/v1738857436/memory-board/ycqrh4wugzru3gywq2rp.png"
              />
            ))}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
