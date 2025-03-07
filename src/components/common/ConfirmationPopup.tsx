import React, { useEffect, useState } from 'react';

interface ConfirmationPopupProps {
  isShow: boolean;
  title: string;
  onClose: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ isShow, title, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if(!isShow) return;
    
    console.log('ConfirmationPopup mounted'); // Debugging log
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - 0.5, 0));
    }, 10);

    const timeout = setTimeout(() => {
      onClose();
      setIsClosed(true);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
      console.log('ConfirmationPopup unmounted'); // Debugging log
    };
  }, [isShow]);

  if (!isShow) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-120">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
        <svg className="checkmark w-16 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
        </svg>
        <div className="h-1 bg-blue-500" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;

// Tailwind CSS classes for animations
<style>{`
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4caf50;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`}</style>
