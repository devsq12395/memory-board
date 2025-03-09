import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../../lib/supabase';
import { getUserIdHasProfile } from '../../services/profile';

import { useUser } from '../contexts/UserContext';
import { useSystem } from '../contexts/SystemContext';

const GlobalScript: React.FC = ({ children }) => {
  const userContext = useUser();
  const systemContext = useSystem();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = async () => {
      if (location.pathname === '/transaction-result') return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const hasProfile = await getUserIdHasProfile(user.id);
        if (!hasProfile) {
          navigate('/signup-details');
        } else {
          userContext.setIsAuthenticated(true);
          userContext.setUid(user.id);
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

      systemContext.setMode(mode as 'desktop' | 'mobile-portrait' | 'mobile-landscape');
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
