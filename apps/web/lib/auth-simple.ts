'use client';

import Keycloak from 'keycloak-js';

let keycloak: Keycloak | null = null;
let isInitialized = false;

// Reset function to clear state
export function resetKeycloak() {
  keycloak = null;
  isInitialized = false;
}

export function getKeycloak(): Keycloak {
  if (keycloak) return keycloak;

  // Debug environment variables
  console.log('Environment variables:', {
    NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  });

  const config = {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myrealm',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'my-react-spa',
  };

  console.log('Keycloak config:', config);

  keycloak = new Keycloak(config);

  return keycloak;
}

export async function initKeycloak(onAuth?: (kc: Keycloak) => void) {
  const kc = getKeycloak();

  // Check if already initialized
  if (isInitialized) {
    console.log('Simple auth: Already initialized, returning current state');
    return { kc, authenticated: kc.authenticated || false };
  }

  try {
    console.log('Simple auth: Starting initialization');

    // Get the config we used to create the Keycloak instance
    const config = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myrealm',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'my-react-spa',
    };

    console.log('Simple auth: Using config:', config);

    // Try different initialization approaches
    let authenticated = false;

    // Check if we're returning from a login (URL has auth parameters)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAuthCode =
      urlParams.has('code') ||
      urlParams.has('state') ||
      hashParams.has('code') ||
      hashParams.has('state');
    const hasAuthHash =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('id_token');

    console.log('Simple auth: URL search params:', window.location.search);
    console.log('Simple auth: URL hash:', window.location.hash);
    console.log('Simple auth: Has auth code:', hasAuthCode);
    console.log('Simple auth: Has auth hash:', hasAuthHash);

    // Capture hash parameters BEFORE kc.init() clears them
    const originalHash = window.location.hash;
    const originalHashString = originalHash.substring(1);
    console.log('Simple auth: Captured original hash:', originalHash);
    console.log(
      'Simple auth: Captured original hash string:',
      originalHashString
    );

    // Handle implicit flow tokens if present
    if (
      hasAuthHash &&
      (originalHashString.includes('id_token') ||
        originalHashString.includes('access_token'))
    ) {
      console.log(
        'Simple auth: Implicit flow tokens detected, processing manually...'
      );

      try {
        // Extract tokens from hash
        const hashParams = new URLSearchParams(originalHashString);
        const idToken = hashParams.get('id_token');
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('token_type');
        const expiresIn = hashParams.get('expires_in');

        if (idToken && accessToken) {
          console.log(
            'Simple auth: Found implicit flow tokens, setting them manually...'
          );

          // Set tokens manually on Keycloak instance
          kc.token = accessToken;
          kc.idToken = idToken;
          kc.tokenParsed = JSON.parse(atob(idToken.split('.')[1])); // Decode JWT payload
          kc.authenticated = true;
          authenticated = true;

          console.log('Simple auth: Implicit flow authentication successful');
          console.log('Simple auth: User info:', kc.tokenParsed);

          // Clear the URL hash
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          console.log(
            'Simple auth: URL cleared after successful authentication'
          );
        }
      } catch (tokenError) {
        console.log(
          'Simple auth: Failed to process implicit flow tokens:',
          tokenError
        );
        authenticated = false;
      }
    } else {
      // Use check-sso for normal session checking
      console.log('Simple auth: Using check-sso method...');
      try {
        authenticated = await kc.init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          flow: 'implicit',
          responseMode: 'fragment',
        });
        console.log('Simple auth: Check-sso result:', authenticated);
      } catch (initError) {
        console.log('Simple auth: Check-sso failed:', initError);
        authenticated = false;
      }
    }

    console.log('Simple auth: Keycloak authenticated state:', kc.authenticated);
    console.log('Simple auth: Keycloak token:', kc.token ? 'exists' : 'none');

    // Final authentication state check
    if (authenticated === undefined) {
      authenticated = kc.authenticated || !!kc.token || false;
      console.log(
        'Simple auth: Using Keycloak authenticated state:',
        authenticated
      );
    }

    // Mark as initialized
    isInitialized = true;
    console.log('Simple auth: Initialization result:', authenticated);

    if (authenticated && onAuth) {
      console.log('Simple auth: Calling onAuth callback');
      onAuth(kc);
    }

    return { kc, authenticated };
  } catch (error) {
    console.error('Simple auth: Failed to initialize Keycloak', error);
    console.error('Simple auth: Error details:', {
      message: error?.message || 'No message',
      stack: error?.stack || 'No stack',
      name: error?.name || 'No name',
      error: error,
    });

    // Mark as initialized even if failed to prevent retry loops
    isInitialized = true;
    return { kc, authenticated: false };
  }
}

export function login() {
  const kc = getKeycloak();
  return kc.login();
}

export function logout() {
  const kc = getKeycloak();
  const origin =
    typeof window !== 'undefined' ? window.location.origin : undefined;
  return kc.logout({ redirectUri: origin });
}

export function getToken(): string | null {
  const kc = getKeycloak();

  if (!kc.token) {
    console.log('getToken: No token available');
    return null;
  }

  // Check if token is expired
  if (kc.tokenParsed && kc.tokenParsed.exp) {
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = kc.tokenParsed.exp;

    if (now >= tokenExp) {
      console.log('getToken: Token is expired, attempting refresh', {
        now,
        tokenExp,
      });

      // Try to refresh the token
      try {
        kc.updateToken(30)
          .then((refreshed) => {
            if (refreshed) {
              console.log('getToken: Token refreshed successfully');
            } else {
              console.log('getToken: Token refresh failed');
            }
          })
          .catch((error) => {
            console.error('getToken: Token refresh error:', error);
          });
      } catch (error) {
        console.error('getToken: Token refresh failed:', error);
      }

      return null;
    }

    console.log('getToken: Token is valid', {
      now,
      tokenExp,
      expiresIn: tokenExp - now,
    });
  }

  console.log('getToken: Returning valid token');
  return kc.token;
}

export function getUser() {
  const kc = getKeycloak();
  return kc.tokenParsed || null;
}

export function isAuthenticated(): boolean {
  const kc = getKeycloak();
  return !!kc.authenticated;
}
