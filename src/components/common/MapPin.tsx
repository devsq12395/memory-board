import { useEffect, useState } from "react";

import { DEFAULT_PIN_IMAGE } from "../../constants/constants";

interface PinProps {
  map: google.maps.Map | null;
  position: { lat: number; lng: number };
  mainImageUrl: string;
  smallImageUrl: string;
  memoryId: string;
  setSelectedMemoryId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsMemoryDetailsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageUsername: string;
}

const MapPin: React.FC<PinProps> = ({ map, position, mainImageUrl, smallImageUrl, memoryId, setSelectedMemoryId, setIsMemoryDetailsPopupOpen, pageUsername }) => {
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
    let mainImageContainer: HTMLDivElement | null = null;

    const createPinContent = (mainImageUrl: string, DEFAULT_PIN_IMAGE: string) => {
      const div = document.createElement('div');
      div.className = `relative ${zoomLevel > 12 ? 'w-16 h-16' : 'w-12 h-12'} mt-10 cursor-pointer`;
      
      mainImageContainer = createImageAndContainer(div, mainImageUrl);

      const pinSymbol = document.createElement('img');
      pinSymbol.src = DEFAULT_PIN_IMAGE;
      pinSymbol.className = 'w-[50px] h-[50px] absolute';
      div.appendChild(pinSymbol);

      return div;
    };

    const createImageAndContainer = (parentDiv: HTMLDivElement, imageUrl: string) => {
      const mainImage = document.createElement('img');
      mainImage.src = imageUrl;
      mainImage.style.objectFit = 'cover';
      mainImage.style.width = '100%';
      mainImage.style.height = '100%';

      const mainImageContainer = document.createElement('div');

      // Set default container size to prevent huge initial rendering
      mainImageContainer.style.width = '100px';
      mainImageContainer.style.height = '100px';

      // Adjust container dimensions based on image orientation once loaded and enforce maximum sizes
      mainImage.onload = () => {
        const imgWidth = mainImage.naturalWidth;
        const imgHeight = mainImage.naturalHeight;
        let containerAspectRatio: number;
        let containerWidth: number;
        let containerHeight: number;
        
        // Define maximum size for any side
        const maxSize = 100;

        if (imgWidth > imgHeight) {
          // Landscape: force 16:9 ratio, width capped at 100
          containerAspectRatio = 4 / 3;
          containerWidth = maxSize;
          containerHeight = maxSize * (3 / 4); // e.g., 100 * 9/16

          mainImageContainer.className = 'border-2 border-white bg-white p-1 shadow-md flex justify-center items-center absolute bottom-[30px] right-[-30px]';
        } else if (imgWidth < imgHeight) {
          // Portrait: force 9:16 ratio, height capped at 100
          containerAspectRatio = 3 / 4;
          containerHeight = maxSize;
          containerWidth = maxSize * (3 / 4); // e.g., 100 * 9/16

          mainImageContainer.className = 'border-2 border-white bg-white p-1 shadow-md flex justify-center items-center absolute bottom-[30px] right-[-15px]';
        } else {
          // Square
          containerAspectRatio = 1;
          containerWidth = maxSize;
          containerHeight = maxSize;

          mainImageContainer.className = 'border-2 border-white bg-white p-1 shadow-md flex justify-center items-center absolute bottom-[30px] right-[-30px]';
        }

        mainImageContainer.style.width = `${containerWidth}px`;
        mainImageContainer.style.height = `${containerHeight}px`;
      };

      mainImageContainer.appendChild(mainImage);
      parentDiv.appendChild(mainImageContainer);
      return mainImageContainer;
    }

    const loadMarkerLibrary = async () => {
      if (advancedMarker) return; // Check if marker already exists

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;

      advancedMarker = new AdvancedMarkerElement({
        position,
        map,
        content: createPinContent(mainImageUrl, DEFAULT_PIN_IMAGE),
      });

      advancedMarker.addListener('click', () => {
        setSelectedMemoryId(memoryId);
        setIsMemoryDetailsPopupOpen(true);
      });
    };

    loadMarkerLibrary();

    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
      if (mainImageContainer && mainImageContainer.parentNode) {
        mainImageContainer.parentNode.removeChild(mainImageContainer);
      }
    };
  }, [map, position]);

  return null;
};

export default MapPin;
