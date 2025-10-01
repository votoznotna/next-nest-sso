'use client';

import Keycloak from 'keycloak-js';

let keycloak: Keycloak | null = null;

export function getKeycloak(): Keycloak {
  if (keycloak) return keycloak;

  keycloak = new Keycloak({
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myrealm',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'my-react-spa',
  });

  return keycloak;
}

export async function initKeycloak(onAuth?: (kc: Keycloak) => void) {
  const kc = getKeycloak();

  try {
    let authenticated = false;

    console.log('initKeycloak: Starting initialization');
    console.log('initKeycloak: Current URL:', window.location.href);
    console.log('initKeycloak: Current search params:', window.location.search);
    console.log('initKeycloak: Current hash:', window.location.hash);

    // Check if we're coming back from a login (URL has auth parameters)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove # from hash

    const hasAuthCode =
      urlParams.has('code') ||
      urlParams.has('state') ||
      hashParams.has('code') ||
      hashParams.has('state');
    const hasAuthHash =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('id_token') ||
      window.location.hash.includes('code=') ||
      window.location.hash.includes('state=');

    console.log('initKeycloak: Has auth code:', hasAuthCode);
    console.log('initKeycloak: Has auth hash:', hasAuthHash);
    console.log('initKeycloak: Hash params:', hashParams.toString());

    if (hasAuthCode || hasAuthHash) {
      console.log(
        'initKeycloak: Detected auth parameters in URL, initializing with login-required'
      );
      // If we have auth parameters, use login-required to process them
      authenticated = await kc.init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });
      console.log('initKeycloak: Login-required result:', authenticated);
    } else {
      console.log('initKeycloak: No auth parameters, trying check-sso');
      // Otherwise, try silent check-sso
      try {
        const initPromise = kc.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri:
            typeof window !== 'undefined'
              ? window.location.origin + '/silent-check-sso.html'
              : undefined,
          checkLoginIframe: false,
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Silent SSO timeout')), 5000);
        });

        authenticated = (await Promise.race([
          initPromise,
          timeoutPromise,
        ])) as boolean;
        console.log('initKeycloak: Check-sso result:', authenticated);
      } catch (silentError) {
        console.warn(
          'initKeycloak: Silent SSO check failed or timed out:',
          silentError
        );
        authenticated = false;
      }
    }

    console.log('initKeycloak: Final authenticated state:', authenticated);
    console.log('initKeycloak: Keycloak token:', kc.token ? 'exists' : 'none');
    console.log('initKeycloak: Keycloak user:', kc.tokenParsed);

    if (authenticated && onAuth) {
      console.log('initKeycloak: Calling onAuth callback');
      onAuth(kc);
    }

    // Set up token refresh only if authenticated
    if (authenticated) {
      console.log('initKeycloak: Setting up token refresh');
      setInterval(async () => {
        try {
          await kc.updateToken(30);
        } catch (error) {
          console.log('Failed to refresh token', error);
        }
      }, 10000);
    }

    return { kc, authenticated };
  } catch (error) {
    console.error('initKeycloak: Failed to initialize Keycloak', error);
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
  return kc.token || null;
}

export function getUser() {
  const kc = getKeycloak();
  return kc.tokenParsed || null;
}

export function isAuthenticated(): boolean {
  const kc = getKeycloak();
  return !!kc.authenticated;
}

export async function forceReinit(): Promise<{
  kc: Keycloak;
  authenticated: boolean;
}> {
  // Clear the existing instance to force re-initialization
  keycloak = null;
  const kc = getKeycloak();

  try {
    const authenticated = await kc.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });

    return { kc, authenticated };
  } catch (error) {
    console.error('Force reinit failed:', error);
    return { kc, authenticated: false };
  }
}
