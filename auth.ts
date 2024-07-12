import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Strava from "next-auth/providers/strava";

// Initialize and export authentication handlers and functions
export const { auth, handlers, signIn, signOut } = NextAuth({
  // Configure authentication providers
  providers: [Strava({
    clientId: process.env.AUTH_STRAVA_ID, // Strava client ID from environment variables
    clientSecret: process.env.AUTH_STRAVA_SECRET, // Strava client secret from environment variables
    authorization: {
      params: {
        scope:  'activity:read' // Scope for accessing activity data
      }
    }
  })],
  
  // Configure callback functions for handling authentication events
  callbacks: {
    // Session callback to modify the session object
    async session({ session, token, user }) {
      session.user.token = token.accessToken; // Add access token to the session user
    
      return session;
    },
    
    // JWT callback to modify the JWT token
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and other info to the token after sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.exp = Date.now() + (account.expires_in ?? 0) * 1000;
        token.refreshToken = account.refresh_token;
        return token;
      }
      
      console.log(token.exp);
      // Check if the current token is still valid
      if (Date.now() < (token.exp ?? 0)) {
        return token;
      }

      // Refresh the token if it's expired
      return refreshToken(token);
    }
  }
});

// Function to refresh the access token using the refresh token
async function refreshToken(token: JWT) {
  try {
    // Set parameters for the refresh token request
    const params = {
      client_id: process.env.AUTH_STRAVA_ID!,
      client_secret: process.env.AUTH_STRAVA_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    };

    // Create the URL for the refresh token request
    const url = 
      "https://www.strava.com/oauth/token?" +
      new URLSearchParams(params as Record<string, string>);

    console.log(url);
    // Send the request to refresh the token
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    // Parse the response containing the refreshed tokens
    const refreshedTokens = await response.json();

    // Throw an error if the response is not OK
    if (!response.ok) {
      throw new Error(refreshedTokens);
    }

    // Return the new token with updated access and refresh tokens
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log("Error refreshing access token: ", error);

    // Return the token with an error field if refreshing fails
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
