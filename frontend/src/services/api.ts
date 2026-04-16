import { authService } from './modules/auth.service';
import { bookingService } from './modules/booking.service';
import { courseService } from './modules/course.service';

/**
 * @deprecated Use specialized services from ./modules/ instead
 */
export const api = {
  syncUser: authService.syncUser.bind(authService),
  lineLogin: authService.lineLogin.bind(authService),
  getCourses: courseService.getCourses.bind(courseService),
  getSessions: courseService.getSessions.bind(courseService),
  createBooking: bookingService.createBooking.bind(bookingService),
  getUserBookings: bookingService.getUserBookings.bind(bookingService),
};

export { authService, bookingService, courseService };
