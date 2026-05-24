// backend/services/schwabAuth.js
import axios from 'axios';

let tokenCache = {
  accessToken: null,
  refreshToken: process.env.SCHWAB_REFRESH_TOKEN, // Initialized via manual login portal
  expiresAt: null
};

export async function getValidAccessToken() {
  const now = Date.now();
  
  // If token is still valid for the next 2 minutes, return it
  if (tokenCache.accessToken && tokenCache.expiresAt > now + 120000) {
    return tokenCache.accessToken;
  }

  // Otherwise, use refresh token to get a new access token
  try {
    const encodedCredentials = Buffer.from(
      `${process.env.SCHWAB_CLIENT_ID}:${process.env.SCHWAB_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post('https://api.schwabapi.com/v1/oauth/token', 
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenCache.refreshToken
      }), {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    tokenCache.accessToken = response.data.access_token;
    tokenCache.refreshToken = response.data.refresh_token; // Schwab may return a rotating refresh token
    tokenCache.expiresAt = now + (response.data.expires_in * 1000);

    // Persist tokenCache.refreshToken to your DB here to prevent session loss!
    return tokenCache.accessToken;
  } catch (error) {
    console.error('Failed to rotate Schwab access token:', error.response?.data || error.message);
    throw error;
  }
}