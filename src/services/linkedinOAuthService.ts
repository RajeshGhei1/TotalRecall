
import { linkedinApiService } from './linkedinApiService';
import { linkedinCredentialsService } from './linkedinCredentialsService';

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

  // Load config from database for a specific tenant
  loadConfig = async (tenantId: string): Promise<boolean> => {
    try {
      const credentials = await linkedinCredentialsService.getConfiguredCredentials(tenantId);
      if (credentials) {
        this.config = credentials;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading LinkedIn config:', error);
      return false;
    }
  };

  // Generate LinkedIn OAuth URL
  getAuthUrl = async (tenantId: string): Promise<string | null> => {
    // Try to load config from database first
    if (!this.config) {
      const loaded = await this.loadConfig(tenantId);
      if (!loaded) {
        throw new Error('LinkedIn OAuth config not found for tenant');
      }
    }

    if (!this.config) {
      throw new Error('LinkedIn OAuth config not set');
    }

    // Generate state parameter with tenant ID
    const state = btoa(JSON.stringify({ 
      tenantId, 
      timestamp: Date.now() 
    }));

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
        const errorText = await response.text();
        console.error('LinkedIn token exchange failed:', response.status, errorText);
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
        const errorText = await response.text();
        console.error('LinkedIn token refresh failed:', response.status, errorText);
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
    state: string
  ): Promise<boolean> => {
    try {
      // Parse tenant ID from state
      const stateData = JSON.parse(atob(state));
      const tenantId = stateData.tenantId;

      if (!tenantId) {
        throw new Error('No tenant ID found in state');
      }

      // Load config for this tenant
      const loaded = await this.loadConfig(tenantId);
      if (!loaded) {
        throw new Error('LinkedIn config not found for tenant');
      }

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

  // Test if credentials are properly configured
  testCredentials = async (tenantId: string): Promise<boolean> => {
    return await linkedinCredentialsService.testCredentials(tenantId);
  };
}

export const linkedinOAuthService = new LinkedInOAuthService();
