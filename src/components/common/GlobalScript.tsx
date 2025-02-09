import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import supabase from '../../lib/supabase';
import { getUserIdHasProfile } from '../../services/profile';

const GlobalScript: React.FC = ({ children }) => {
  const userContext = useUser();
  const navigate = useNavigate();

  {/* On page load scripts*/}
  useEffect(() => {
    {/* Check if user is logged in. Set context data if yes. */}
    if (userContext) {
      const userIsLoggedIn = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const hasProfile = await getUserIdHasProfile(user.id);
          if (!hasProfile) {
            navigate('/signup-details');
          } else {
            userContext.setIsAuthenticated(true);
            userContext.setUid(user.id);
          }
        }
      };
      userIsLoggedIn();
    }
  }, [navigate, userContext]);

  return <>{children}</>;
};

export default GlobalScript;