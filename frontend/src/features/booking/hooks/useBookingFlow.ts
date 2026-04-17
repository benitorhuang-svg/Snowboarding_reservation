import { useState, useEffect, useMemo, useCallback } from 'react';
import { courseService } from '@services/modules/course.service';
import { bookingService } from '@services/modules/booking.service';
import { useNotification } from '@/core';
import type { Course, Session, Booking } from '@shared';

export const useBookingFlow = () => {
  const { notify } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const uniqueDates = useMemo(() => {
    const dates = sessions.map((s) => new Date(s.startTime).toLocaleDateString());
    return Array.from(new Set(dates)).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [sessions]);

  const sessionsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return sessions.filter(
      (s) => new Date(s.startTime).toLocaleDateString() === selectedDate,
    );
  }, [sessions, selectedDate]);

  const fetchCourses = useCallback(async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data.items);
    } catch {
      notify('Failed to load courses', 'error');
    }
  }, [notify]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const handleCourseSelect = async (course: Course) => {
    setSelectedCourse(course);
    setIsLoading(true);
    try {
      const data = await courseService.getSessions({ courseId: course.id });
      setSessions(data);
      if (data.length > 0) {
        const firstDate = new Date(data[0].startTime).toLocaleDateString();
        setSelectedDate(firstDate);
      }
      setCurrentStep(2);
    } catch {
      notify('Failed to load slots', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSession) return;
    setIsLoading(true);
    try {
      const order = await bookingService.createBooking([selectedSession.id]);
      setCurrentOrder(order as unknown as Booking);
      setCurrentStep(4);
    } catch (error: any) {
      notify(error?.message || 'Booking failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    courses,
    selectedCourse,
    sessionsForSelectedDate,
    selectedSession,
    setSelectedSession,
    currentOrder,
    isLoading,
    selectedDate,
    setSelectedDate,
    uniqueDates,
    handleCourseSelect,
    handleBooking,
  };
};
