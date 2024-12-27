import React, { useEffect } from 'react';

function GoogleSignInButton() {
  useEffect(() => {
    const handleGoogleSignIn = () => {
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
        });

        auth2.signIn().then(googleUser => {
          const authResponse = googleUser.getAuthResponse();
          const code = authResponse.code;

          // Now you have the authorization code (`code`) to send to your backend
          console.log('Authorization code:', code);
          
          // Send `code` to your backend using fetch or axios to exchange for access token
          // Example:
          // fetch('http://your-api-domain.com/user/social/url/', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ code }),
          // })
          // .then(response => response.json())
          // .then(data => console.log('Data:', data))
          // .catch(error => console.error('Error:', error));
        });
      });
    };

    // Load Google OAuth 2.0 library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = handleGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div className="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
  );
}

export default GoogleSignInButton;
