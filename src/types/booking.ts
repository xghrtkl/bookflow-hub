export type DurationUnit = 'minute' | 'hour' | 'day';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type ResourceType = 'staff' | 'room' | 'asset' | 'generic';
export type Industry = 'beauty' | 'health' | 'education' | 'event' | 'rental' | 'fitness' | 'wellness' | 'other';

export interface Business {
  id: string;
  ownerUserId: string;
  name: string;
  slug: string;
  industry: Industry;
  timezone: string;
  defaultBookingCodePrefix: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  category: string;
  durationValue: number;
  durationUnit: DurationUnit;
  capacityPerSlot: number;
  basePriceCents: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceVariant {
  id: string;
  serviceId: string;
  name: string;
  durationValue?: number;
  durationUnit?: DurationUnit;
  priceCents?: number;
  isActive: boolean;
}

export interface Resource {
  id: string;
  businessId: string;
  name: string;
  type: ResourceType;
  isActive: boolean;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  serviceVariantId?: string;
  resourceId?: string;
  customerId: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  peopleCount: number;
  totalPriceCents: number;
  currency: string;
  bookingCode: string;
  qrCodeData: string;
  notes?: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  businessId: string;
  resourceId?: string;
  serviceId?: string;
  weekday: number; // 0-6, 0 = Sunday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotSizeMinutes: number;
  isActive: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  remainingCapacity: number;
}

export interface BookingFormData {
  serviceId: string;
  variantId?: string;
  date: Date;
  timeSlot: TimeSlot;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  notes?: string;
}
