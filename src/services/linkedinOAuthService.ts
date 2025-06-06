
import { linkedinApiService } from './linkedinApiService';

export interface LinkedInOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

class LinkedInOAuthService {
  private config: LinkedInOAuthConfig | null = null;

  setConfig = (config: LinkedInOAuthConfig) => {
    this.config = config;
  };

  // Generate LinkedIn OAuth URL
  getAuthUrl = (state: string): string => {
    if (!this.config) {
      throw new Error('LinkedIn OAuth config not set');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: this.config.scope.join(' ')
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  };

  // Exchange authorization code for access token
  exchangeCodeForToken = async (code: string, state: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  } | null> => {
    if (!this.config) {
      throw new Error('LinkedIn OAuth config not set');
    }

    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LinkedIn token exchange error:', error);
      return null;
    }
  };

  // Refresh access token
  refreshToken = async (refreshToken: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  } | null> => {
    if (!this.config) {
      throw new Error('LinkedIn OAuth config not set');
    }

    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LinkedIn token refresh error:', error);
      return null;
    }
  };

  // Complete OAuth flow and store connection
  completeOAuthFlow = async (
    code: string, 
    state: string, 
    tenantId: string
  ): Promise<boolean> => {
    try {
      const tokenData = await this.exchangeCodeForToken(code, state);
      if (!tokenData) return false;

      const success = await linkedinApiService.storeConnection(
        tenantId,
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      );

      return success;
    } catch (error) {
      console.error('OAuth flow completion error:', error);
      return false;
    }
  };
}

export const linkedinOAuthService = new LinkedInOAuthService();
