import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PopupProps {
  children: React.ReactNode;
  isShow: boolean;
  titleText?: string;
  onClose?: () => void;
}

const Popup: React.FC<PopupProps> = ({children, isShow, titleText, onClose}) => {

  if (!isShow) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50`}>
      <div className="p-4 bg-white shadow-md rounded-md w-1/2 h-[60%] min-w-[500px] min-h-[500px]">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          {/* Title Part */}
          {titleText && (
            <h2 className="text-center text-3xl font-bold mb-4">{titleText}</h2>
          )}
          {/* Close Button */}
          <button onClick={onClose} className="bg-gray-300 rounded-full p-1">
            <XMarkIcon className="w-8 h-8 text-gray-800 cursor-pointer" />
          </button>
        </div>
        <hr className="my-4 border-t border-gray-200" />

        {/* Sections: Divided by rows in desktop and columns in mobile */}
        <div className="flex flex-col md:flex-row md:divide-x divide-y divide-gray-300">
          {React.Children.map(children, (child) => (
            <div className="flex-1 p-4">
              {child}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Popup;