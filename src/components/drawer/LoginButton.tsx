import React from 'react';
import Button from '../common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const LoginButton: React.FC = () => {
  return (
    <Button style={{
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
    }}>
      <FontAwesomeIcon icon={faUserCircle} size="lg" style={{ marginRight: '8px' }} />
      Login / Signup
    </Button>
  );
};

export default LoginButton;