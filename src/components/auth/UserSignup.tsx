import React, { useState } from 'react';
import { signup } from '../../services/authService';
import { useUser } from '../contexts/UserContext';

interface UserSignupProps {
  disabled: boolean;
}

const UserSignup: React.FC<UserSignupProps> = ({ disabled }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { setIsAuthenticated } = useUser();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data, error } = await signup(email, password);
    
    if (data) {
      setIsAuthenticated(true);
      setSuccessMessage('Signup almost done! Please check your email for to verify your account.');
    }
    if (error) {
      setErrorMessage('Signup failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col space-y-4">
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
      <button type="submit" disabled={disabled} className="p-3 rounded w-full bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
        Sign Up
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </form>
  );
};

export default UserSignup;
