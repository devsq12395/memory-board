import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import supabase from '../../lib/supabase';
import { getUserDetailsViaID, getUserIdHasProfile } from '../../services/profile';

const GlobalScript: React.FC = ({ children }) => {
  const userContext = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const hasProfile = await getUserIdHasProfile(user.id);
        if (!hasProfile) {
          navigate('/signup-details');
        } else {
          userContext.setIsAuthenticated(true);
          userContext.setUid(user.id);
          
          const userData = await getUserDetailsViaID(user.id);
          if (userData && userData.user_name && userData.user_name.length > 0) {
            navigate(`/${userData.user_name}`);
          }
        }
      } else {
        userContext.setIsAuthenticated(false);
        userContext.setUid(null); // Reset UID when user logs out
      }
    };

    // Call immediately on component mount
    handleAuthChange();

    // Listen for auth state changes (login, logout, session refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      handleAuthChange();
    });

    return () => {
      authListener.subscription.unsubscribe(); // Cleanup listener on unmount
    };
  }, [navigate, userContext]);

  return <>{children}</>;
};

export default GlobalScript;
