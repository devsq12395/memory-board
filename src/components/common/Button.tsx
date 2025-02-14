import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit';
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  styleType?: 'primary' | 'secondary' | 'file' | 'drawer-content';
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick, disabled, className, styleType = 'primary', icon = '' }) => {
  let styleClasses, styleText = '';
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
    case 'drawer-content':
      styleClasses = 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-b border-gray-200';
      styleText = 'text-left';
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
      {icon && <span className="mr-2">{icon}</span>}
      <p className={styleText}>{text}</p>
    </button>
  );
};

export default Button;