import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import MapPin from "./MapPin";
import { getUserMemories, getLatestMemories, deleteMemory } from "../../services/memoryService";

import { useUser } from "../contexts/UserContext";
import { useToolbox } from "../contexts/ToolboxContext";

interface MapComponentProps {
  onMapClick: (lat: number, lng: number) => void;
  setSelectedMemoryId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsMemoryDetailsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageUserID: string | null;
}

const containerStyle = {
  width: "100vw",
  height: "88vh",
};

const center = {
  lat: 33.8869, // Latitude for Tunisia
  lng: 9.5375, // Longitude for Tunisia
};

const mapZoom = 3;

const mapId = import.meta.env.VITE_GOOGLE_MAP_ID as string;

const MapComponent: React.FC<MapComponentProps> = ({ onMapClick, setSelectedMemoryId, setIsMemoryDetailsPopupOpen, pageUserID }) => {
  const userContext = useUser();
  const toolboxContext = useToolbox();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [memories, setMemories] = useState<any[]>([]);

  {/* Fetch memories function */}
  const fetchMemories = async () => {
    setLoading(true);
    setError(null);

    try {
      const userMemories = (pageUserID) ? await getUserMemories(pageUserID) : await getLatestMemories(50);
      const validMemories = [];
      for (const memory of userMemories) {
        // Check if memory has a non-empty title or description (desc field)
        if ((memory.title && memory.title.trim() !== '') || (memory.desc && memory.desc.trim() !== '')) {
          validMemories.push(memory);
        } else if (new Date().getTime() - new Date(memory.date_created).getTime() > 2 * 24 * 60 * 60 * 1000) {
          // Memory lacks a title and description, so mark it for deletion if it's older than 2 days
          await deleteMemory(memory.id);
        }
      }
      const sortedMemories = validMemories.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      setMemories(sortedMemories || []);
    } catch (err) {
      console.error("Failed to fetch user memories:", err);
      setError("Failed to load memories.");
    } finally {
      setLoading(false);
    }
  };

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
        zoom={mapZoom}
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
                setSelectedMemoryId={setSelectedMemoryId}
                setIsMemoryDetailsPopupOpen={setIsMemoryDetailsPopupOpen}
                memoryId={memory.id}
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
