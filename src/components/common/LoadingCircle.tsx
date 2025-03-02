import React, { FC } from 'react';

const LoadingCircle: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`\
        @keyframes spin {\
          from { transform: rotate(0deg); }\
          to { transform: rotate(360deg); }\
        }\
      `}</style>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #ccc',
        borderTop: '4px solid #333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{ marginTop: '8px' }}>Loading...</div>
    </div>
  );
};

export default LoadingCircle;