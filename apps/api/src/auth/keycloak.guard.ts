import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import * as crypto from 'crypto';

@Injectable()
export class KeycloakGuard implements CanActivate {
  private keycloakUrl: string;
  private realm: string;
  private publicKey: string | null = null;

  constructor() {
    this.keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
    this.realm = process.env.KEYCLOAK_REALM || 'myrealm';

    console.log('KeycloakGuard: Initializing with config:', {
      keycloakUrl: this.keycloakUrl,
      realm: this.realm,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('KeycloakGuard: No token provided');
      throw new UnauthorizedException('No token provided');
    }

    console.log('KeycloakGuard: Token received, length:', token.length);
    console.log(
      'KeycloakGuard: Token preview:',
      token.substring(0, 50) + '...'
    );

    try {
      const decoded = await this.verifyToken(token);
      console.log(
        'KeycloakGuard: Token verified successfully for user:',
        decoded.preferred_username || decoded.sub
      );
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('KeycloakGuard: Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string): Promise<any> {
    console.log('KeycloakGuard: Starting token verification');

    // Get the public key from the realm configuration
    const publicKey = await this.getPublicKey();
    if (!publicKey) {
      throw new Error('Failed to get public key from Keycloak');
    }

    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      console.log('KeycloakGuard: JWT verification successful');
      return decoded;
    } catch (error) {
      console.error('KeycloakGuard: JWT verify error:', error.message);
      throw error;
    }
  }

  private async getPublicKey(): Promise<string> {
    if (this.publicKey) {
      return this.publicKey;
    }

    try {
      console.log(
        'KeycloakGuard: Fetching public key from realm configuration'
      );
      const response = await fetch(`${this.keycloakUrl}/realms/${this.realm}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch realm configuration: ${response.status} ${response.statusText}`
        );
      }

      const realmConfig = await response.json();
      const publicKeyPem = realmConfig.public_key;

      if (!publicKeyPem) {
        throw new Error('No public key found in realm configuration');
      }

      // Convert the public key to PEM format
      this.publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;
      console.log('KeycloakGuard: Public key retrieved successfully');

      return this.publicKey;
    } catch (error) {
      console.error('KeycloakGuard: Failed to get public key:', error.message);
      throw error;
    }
  }
}
