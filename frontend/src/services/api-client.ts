import { getIdToken, getIdTokenForced } from './firebase';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = await getIdToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/')) {
      const freshToken = await getIdTokenForced();
      if (freshToken) {
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${freshToken}`,
        };
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },
};
