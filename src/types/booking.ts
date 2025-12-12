export type DurationUnit = 'minute' | 'hour' | 'day';
export type BookingStatus = 'pending' | 'pending_payment' | 'payment_failed' | 'payment_expired' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type ResourceType = 'staff' | 'room' | 'asset' | 'generic';
export type Industry = 'beauty' | 'health' | 'education' | 'event' | 'rental' | 'fitness' | 'wellness' | 'other';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
export type PaymentMethod = 'qris' | 'va' | 'credit_card' | 'cash' | 'other';
export type WaitingListStatus = 'waiting' | 'invited' | 'converted' | 'cancelled' | 'expired';
export type DiscountType = 'percentage' | 'fixed';

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

export interface Location {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LocationSchedule {
  id: string;
  locationId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  slotSizeMinutes: number;
  isActive: boolean;
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
  // Payment settings
  requiresPaymentBeforeConfirmation?: boolean;
  // Group booking settings
  isGroupBooking?: boolean;
  minPeoplePerBooking?: number;
  // Waiting list
  waitingListEnabled?: boolean;
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
  role?: string;
  isActive: boolean;
}

export interface ServiceResource {
  serviceId: string;
  resourceId: string;
}

export interface ServiceLocation {
  serviceId: string;
  locationId: string;
  priceCentsOverride?: number;
  capacityOverride?: number;
  isActive: boolean;
}

export interface ResourceLocation {
  resourceId: string;
  locationId: string;
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
  locationId?: string;
  customerId: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  peopleCount: number;
  totalPriceCents: number;
  discountAppliedCents?: number;
  currency: string;
  bookingCode: string;
  qrCodeData: string;
  notes?: string;
  createdAt: string;
  waitingListEntryId?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  externalReference?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  businessId: string;
  resourceId?: string;
  serviceId?: string;
  locationId?: string;
  weekday: number;
  startTime: string;
  endTime: string;
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
  resourceId?: string;
  locationId?: string;
  date: Date;
  timeSlot: TimeSlot;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  notes?: string;
  voucherCode?: string;
}

// Membership & Loyalty
export interface MembershipTier {
  id: string;
  businessId: string;
  name: string;
  pointsMultiplier: number;
  defaultDiscountPercent?: number;
  minPointsRequired: number;
  isActive: boolean;
  createdAt: string;
}

export interface Membership {
  id: string;
  customerId: string;
  businessId: string;
  tierId: string;
  pointsBalance: number;
  totalPointsEarned: number;
  joinedAt: string;
}

export interface LoyaltyPointEvent {
  id: string;
  membershipId: string;
  bookingId?: string;
  pointsDelta: number;
  reason: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  businessId: string;
  name: string;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountCents?: number;
  serviceId?: string;
  tierId?: string;
  locationId?: string;
  isAuto: boolean;
  startAt: string;
  endAt: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

// Waiting List
export interface WaitingListEntry {
  id: string;
  businessId: string;
  serviceId: string;
  locationId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  desiredStartAt?: string;
  notes?: string;
  status: WaitingListStatus;
  invitedAt?: string;
  convertedBookingId?: string;
  createdAt: string;
}
