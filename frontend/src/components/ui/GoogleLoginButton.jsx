import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  return (
    <GoogleOAuthProvider clientId="1076418109888-0779o09325iod1ogpgqbgtguqc09djmv.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}      
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;

// project-1076418109888
// 1076418109888-0779o09325iod1ogpgqbgtguqc09djmv.apps.googleusercontent.com