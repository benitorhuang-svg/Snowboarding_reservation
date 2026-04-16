import { apiClient } from '../api-client';

export const authService = {
  async syncUser(
    firebaseUid: string,
    email: string,
    profile?: {
      name?: string;
      mobilePhone?: string;
      language?: string;
      skillLevel?: string;
      recaptchaToken?: string;
    },
  ) {
    return apiClient.fetch('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({
        firebaseUid,
        email,
        ...profile,
      }),
    });
  },

  async lineLogin(lineAccessToken: string, lineUserId: string, email?: string) {
    // Note: lineLogin doesn't use the standard apiClient.fetch because it handles its own auth flow
    const response = await fetch('http://localhost:3000/api/v1/auth/line-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineAccessToken, lineUserId, email }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(error.message || 'LINE login failed');
    }

    return response.json();
  },
};
