import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit';
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  styleType?: 'primary' | 'secondary' | 'file';
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick, disabled, className, styleType = 'primary' }) => {
  let styleClasses;
  switch (styleType) {
    case 'primary':
      styleClasses = 'bg-indigo-600 hover:bg-indigo-700 text-white';
      break;
    case 'secondary':
      styleClasses = 'bg-gray-600 hover:bg-gray-700 text-white';
      break;
    case 'file':
      styleClasses = 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100';
      break;
    default:
      styleClasses = 'bg-indigo-600 hover:bg-indigo-700 text-white';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${styleClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {text}
    </button>
  );
};

export default Button;