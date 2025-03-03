import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase';
import { getUserDetailsViaID, getUserIdHasProfile } from '../../services/profile';

import { useUser } from '../contexts/UserContext';
import { useSystem } from '../contexts/SystemContext';
import { useProfilePage } from '../contexts/ProfilePageContext';

const GlobalScript: React.FC = ({ children }) => {
  const userContext = useUser();
  const systemContext = useSystem();
  const profilePageContext = useProfilePage();
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
        }
      } else {
        userContext.setIsAuthenticated(false);
        userContext.setUid(null); // Reset UID when user logs out
      }
    };

    const updateMode = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let mode = 'desktop';

      if (width <= 768) {
        mode = height > width ? 'mobile-portrait' : 'mobile-landscape';
      }

      systemContext.setMode(mode);
    };

    // Call immediately on component mount
    handleAuthChange();
    updateMode();

    // Listen for auth state changes (login, logout, session refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      handleAuthChange();
    });

    window.addEventListener('resize', updateMode);

    return () => {
      authListener.subscription.unsubscribe(); // Cleanup listener on unmount
      window.removeEventListener('resize', updateMode);
    };
  }, [navigate, userContext, systemContext]);

  return <>{children}</>;
};

export default GlobalScript;
