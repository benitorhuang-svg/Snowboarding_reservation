import { apiClient } from '../api-client';

export const bookingService = {
  async createBooking(sessionIds: string[]) {
    return apiClient.fetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({ sessionId: sessionIds[0] }),
    });
  },

  async getUserBookings() {
    return apiClient.fetch('/bookings');
  },
};
