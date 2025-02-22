import React, { useState } from 'react';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
  const [currentTab, setCurrentTab] = useState<'Login' | 'Signup'>('Login');
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300">
          {['Login', 'Signup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab as 'Login' | 'Signup')}
              className={`flex-1 px-6 py-2 text-center text-sm font-medium cursor-pointer ${
                currentTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="p-6">
          {currentTab === 'Login' ? 
          <UserLogin 
            disabled={!isTermsChecked} 
            onClose={onClose}
          /> : 
          <UserSignup 
            disabled={!isTermsChecked} 
          />}
        </div>

        {/* Terms Checkbox */}
        <div className="p-6 pt-0 flex justify-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={isTermsChecked} onChange={() => setIsTermsChecked(!isTermsChecked)} />
            <span className="text-sm">
              To login/signup, you must agree to our{' '}
              <a href="https://goagenda.net/about" className="text-blue-500 underline">
                Terms, Conditions, and Policies
              </a>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
