import { useEffect, useState } from "react";

interface PinProps {
  map: google.maps.Map | null;
  position: { lat: number; lng: number };
  mainImageUrl: string;
  smallImageUrl: string;
  pinSymbolUrl: string;
}

const MapPin: React.FC<PinProps> = ({ map, position, mainImageUrl, smallImageUrl, pinSymbolUrl }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(map?.getZoom() || 10);

  useEffect(() => {
    if (!map) return;

    const handleZoomChange = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        setZoomLevel(zoom);
      }
    };

    const listener = map.addListener('zoom_changed', handleZoomChange);

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    let advancedMarker: any; // Temporarily using `any` for AdvancedMarkerElement

    const createPinContent = (mainImageUrl: string, smallImageUrl: string, pinSymbolUrl: string) => {
      const div = document.createElement('div');
      div.className = `relative ${zoomLevel > 12 ? 'w-16 h-16' : 'w-12 h-12'} mt-10`;

      const mainImage = document.createElement('img');
      mainImage.src = mainImageUrl;
      mainImage.className = 'w-[75px] h-[75px]';

      const mainImageContainer = document.createElement('div');
      mainImageContainer.className = 'w-[85px] h-[95px] border-2 border-white bg-white p-1 shadow-md flex justify-center items-center';
      mainImageContainer.appendChild(mainImage);
      div.appendChild(mainImageContainer);

      const smallImage = document.createElement('img');
      smallImage.src = smallImageUrl;
      smallImage.className = 'w-[70px] h-[70px] absolute bottom-[-100px] left-[5px]';
      div.appendChild(smallImage);

      const pinSymbol = document.createElement('img');
      pinSymbol.src = pinSymbolUrl;
      pinSymbol.className = 'w-[50px] h-[50px] absolute bottom-[30px] left-[10px]';
      div.appendChild(pinSymbol);

      return div;
    };

    const loadMarkerLibrary = async () => {
      if (advancedMarker) return; // Check if marker already exists

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;

      advancedMarker = new AdvancedMarkerElement({
        position,
        map,
        content: createPinContent(mainImageUrl, smallImageUrl, pinSymbolUrl),
      });
    };

    loadMarkerLibrary();

    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, [map, position]);

  return null;
};

export default MapPin;
