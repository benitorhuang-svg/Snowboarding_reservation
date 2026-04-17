import { useMemo } from 'react';
import type { User, Booking } from '@shared';

export const useUserStats = (user: User, bookings: Booking[]) => {
  const getSkillProgress = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'BEGINNER':
        return 25;
      case 'INTERMEDIATE':
        return 50;
      case 'ADVANCED':
        return 75;
      case 'EXPERT':
        return 100;
      default:
        return 25;
    }
  };

  const stats = useMemo(() => {
    const paidBookings = bookings.filter(
      (b) => b.status === 'PAID' || b.status === 'COMPLETED',
    );
    const upcoming = bookings
      .filter(
        (b) =>
          b.status === 'PAID' && new Date(b.items[0]?.session?.startTime) > new Date(),
      )
      .sort(
        (a, b) =>
          new Date(a.items[0]?.session?.startTime).getTime() -
          new Date(b.items[0]?.session?.startTime).getTime(),
      )[0];

    const skillLevel = user.skillLevel || 'BEGINNER';

    return {
      totalLessons: paidBookings.length,
      nextSession: upcoming
        ? new Date(upcoming.items[0]?.session?.startTime).toLocaleDateString()
        : 'NONE',
      skillLevel,
      progress: getSkillProgress(skillLevel),
    };
  }, [bookings, user.skillLevel]);

  return stats;
};
