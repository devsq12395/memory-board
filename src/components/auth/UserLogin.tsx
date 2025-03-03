import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID } from '../../services/profile';

interface UserLoginProps {
  disabled: boolean;
  onClose?: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ disabled, onClose }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setIsAuthenticated, setUid } = useUser();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data, error } = await login(email, password);
    
    if (data) {
      setIsAuthenticated(true);
      setUid(data.user?.id ?? null);

      const userData = await getUserDetailsViaID(data.user?.id ?? '');
      if (userData && userData.user_name && userData.user_name.length > 0) {
        navigate(`/${userData.user_name}`);
        window.location.reload();
      }
    }
    if (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className={`p-3 rounded w-full ${
          disabled ? 'bg-gray-300 cursor-not-allowed text-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer'
        }`}
      >
        Login
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default UserLogin;
