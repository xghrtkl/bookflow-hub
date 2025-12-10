import { Service, ServiceVariant, Schedule, Booking, TimeSlot, DurationUnit } from '@/types/booking';
import { mockSchedules, mockBookings } from '@/data/mockData';

/**
 * Calculate duration in minutes based on value and unit
 */
export function getDurationMinutes(value: number, unit: DurationUnit): number {
  switch (unit) {
    case 'minute':
      return value;
    case 'hour':
      return value * 60;
    case 'day':
      return value * 24 * 60;
    default:
      return value;
  }
}

/**
 * Get effective duration for a service (considering variant override)
 */
export function getEffectiveDuration(
  service: Service,
  variant?: ServiceVariant
): { value: number; unit: DurationUnit } {
  if (variant?.durationValue && variant?.durationUnit) {
    return { value: variant.durationValue, unit: variant.durationUnit };
  }
  if (variant?.durationValue) {
    return { value: variant.durationValue, unit: service.durationUnit };
  }
  return { value: service.durationValue, unit: service.durationUnit };
}

/**
 * Get effective price for a service (considering variant override)
 */
export function getEffectivePrice(service: Service, variant?: ServiceVariant): number {
  return variant?.priceCents ?? service.basePriceCents;
}

/**
 * Generate time slots for a given date based on schedule
 */
export function generateTimeSlots(
  date: Date,
  businessId: string,
  serviceId: string,
  durationMinutes: number,
  capacity: number
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  
  // Find applicable schedule for this day
  const schedule = mockSchedules.find(
    (s) => s.businessId === businessId && s.weekday === dayOfWeek && s.isActive
  );
  
  if (!schedule) {
    return [];
  }
  
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = schedule.startTime.split(':').map(Number);
  const [endHour, endMin] = schedule.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Generate slots based on slot size
  for (let current = startMinutes; current + durationMinutes <= endMinutes; current += schedule.slotSizeMinutes) {
    const slotStart = new Date(date);
    slotStart.setHours(Math.floor(current / 60), current % 60, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);
    
    // Check remaining capacity
    const remainingCapacity = calculateRemainingCapacity(
      slotStart,
      slotEnd,
      businessId,
      serviceId,
      capacity
    );
    
    // Don't show past slots
    const now = new Date();
    const isPast = slotStart <= now;
    
    slots.push({
      startTime: formatTime(slotStart),
      endTime: formatTime(slotEnd),
      available: !isPast && remainingCapacity > 0,
      remainingCapacity: isPast ? 0 : remainingCapacity,
    });
  }
  
  return slots;
}

/**
 * Calculate remaining capacity for a time slot
 */
function calculateRemainingCapacity(
  slotStart: Date,
  slotEnd: Date,
  businessId: string,
  serviceId: string,
  maxCapacity: number
): number {
  // Get overlapping bookings
  const overlapping = mockBookings.filter((booking) => {
    if (booking.businessId !== businessId || booking.serviceId !== serviceId) {
      return false;
    }
    if (booking.status === 'cancelled' || booking.status === 'no_show') {
      return false;
    }
    
    const bookingStart = new Date(booking.startAt);
    const bookingEnd = new Date(booking.endAt);
    
    // Check overlap: new_start < existing_end AND new_end > existing_start
    return slotStart < bookingEnd && slotEnd > bookingStart;
  });
  
  const totalBooked = overlapping.reduce((sum, b) => sum + b.peopleCount, 0);
  return Math.max(0, maxCapacity - totalBooked);
}

/**
 * Format time as HH:mm
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Generate a unique booking code
 */
export function generateBookingCode(prefix: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

/**
 * Get next available dates (excluding days without schedules)
 */
export function getAvailableDates(businessId: string, count: number = 14): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  while (dates.length < count) {
    const dayOfWeek = checkDate.getDay();
    const hasSchedule = mockSchedules.some(
      (s) => s.businessId === businessId && s.weekday === dayOfWeek && s.isActive
    );
    
    if (hasSchedule) {
      dates.push(new Date(checkDate));
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return dates;
}
