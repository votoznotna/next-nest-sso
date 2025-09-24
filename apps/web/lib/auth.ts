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
    const authenticated = await kc.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri:
        typeof window !== 'undefined' ? window.location.origin + '/silent-check-sso.html' : undefined,
    });

    if (authenticated && onAuth) {
      onAuth(kc);
    }

    // Set up token refresh
    setInterval(async () => {
      try {
        await kc.updateToken(30);
      } catch (error) {
        console.log('Failed to refresh token', error);
      }
    }, 10000);

    return { kc, authenticated };
  } catch (error) {
    console.error('Failed to initialize Keycloak', error);
    return { kc, authenticated: false };
  }
}

export function login() {
  const kc = getKeycloak();
  return kc.login();
}

export function logout() {
  const kc = getKeycloak();
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
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
