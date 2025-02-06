import { useEffect } from "react";

interface PinProps {
  map: google.maps.Map | null;
  position: { lat: number; lng: number };
  content?: HTMLElement | string; // Optional custom content
}

const MapPin: React.FC<PinProps> = ({ map, position, content }) => {
  useEffect(() => {
    if (!map) return;

    let advancedMarker: any; // Temporarily using `any` for AdvancedMarkerElement

    const loadMarkerLibrary = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;

      advancedMarker = new AdvancedMarkerElement({
        position,
        map,
        content: typeof content === "string"
          ? (() => {
              const div = document.createElement("div");
              div.textContent = content;
              return div;
            })()
          : content,
      });
    };

    loadMarkerLibrary();

    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, [map, position, content]);

  return null;
};

export default MapPin;
