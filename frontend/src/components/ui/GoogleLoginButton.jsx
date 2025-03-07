import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  return (
    <GoogleOAuthProvider clientId="1076418109888-p5n3qj3nt18orr3nub3lg82obrussst3.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;

// project-1076418109888
// 1076418109888-p5n3qj3nt18orr3nub3lg82obrussst3.apps.googleusercontent.com