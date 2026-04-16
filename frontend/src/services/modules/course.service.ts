import { apiClient } from '../api-client';

export const courseService = {
  async getCourses() {
    return apiClient.fetch('/courses');
  },

  async getSessions(params: { courseId?: string; coachId?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.fetch(`/courses/sessions?${query}`);
  },
};
