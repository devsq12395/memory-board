import React from 'react';

interface PopupProps {
  children: React.ReactNode;
  isShow: boolean;
  titleText?: string;
}

const Popup: React.FC<PopupProps> = ({children, isShow, titleText}) => {

  if (!isShow) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className="p-4 bg-white shadow-md rounded-md w-1/2 h-[60%] min-w-[500px] min-h-[500px]">
        {/* Title Part */}
        {titleText && (
          <h2 className="text-center text-xl font-bold mb-4">{titleText}</h2>
        )}
        <hr className="my-4 border-t border-gray-200" />

        {/* Sections: Divided by rows in desktop and columns in mobile */}
        <div className="flex flex-col md:flex-row md:divide-x divide-y divide-gray-300">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Popup;