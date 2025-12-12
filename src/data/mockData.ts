import { 
  Business, Service, ServiceVariant, Schedule, Booking, Customer,
  Resource, ServiceResource, Location, LocationSchedule, ServiceLocation,
  ResourceLocation, MembershipTier, Membership, Discount, WaitingListEntry, Payment
} from '@/types/booking';

export const mockBusiness: Business = {
  id: '1',
  ownerUserId: 'owner-1',
  name: 'Glow Beauty Studio',
  slug: 'glow-beauty',
  industry: 'beauty',
  timezone: 'Asia/Jakarta',
  defaultBookingCodePrefix: 'GLW',
  description: 'Your destination for premium beauty treatments. We specialize in hair, nails, and skincare services.',
  logoUrl: undefined,
  createdAt: new Date().toISOString(),
};

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    businessId: '1',
    name: 'Glow Beauty - Sudirman',
    slug: 'sudirman',
    address: 'Jl. Jend. Sudirman No. 123, Jakarta Selatan',
    phone: '+62 21 1234 5678',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loc-2',
    businessId: '1',
    name: 'Glow Beauty - Kemang',
    slug: 'kemang',
    address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
    phone: '+62 21 8765 4321',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockLocationSchedules: LocationSchedule[] = [
  // Sudirman - Mon-Sat 9-6
  ...[1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `loc-sch-1-${weekday}`,
    locationId: 'loc-1',
    weekday,
    startTime: '09:00',
    endTime: '18:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    slotSizeMinutes: 30,
    isActive: true,
  })),
  // Kemang - Mon-Sun 10-8
  ...[0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `loc-sch-2-${weekday}`,
    locationId: 'loc-2',
    weekday,
    startTime: '10:00',
    endTime: '20:00',
    slotSizeMinutes: 30,
    isActive: true,
  })),
];

export const mockResources: Resource[] = [
  {
    id: 'res-1',
    businessId: '1',
    name: 'Sarah',
    type: 'staff',
    role: 'Senior Stylist',
    isActive: true,
  },
  {
    id: 'res-2',
    businessId: '1',
    name: 'Maya',
    type: 'staff',
    role: 'Hair Colorist',
    isActive: true,
  },
  {
    id: 'res-3',
    businessId: '1',
    name: 'Dewi',
    type: 'staff',
    role: 'Nail Technician',
    isActive: true,
  },
  {
    id: 'res-4',
    businessId: '1',
    name: 'Rina',
    type: 'staff',
    role: 'Esthetician',
    isActive: true,
  },
  {
    id: 'res-5',
    businessId: '1',
    name: 'Yoga Instructor Andi',
    type: 'staff',
    role: 'Yoga Instructor',
    isActive: true,
  },
];

export const mockServices: Service[] = [
  {
    id: 'svc-1',
    businessId: '1',
    name: 'Haircut & Styling',
    description: 'Professional haircut with wash, cut, and styling',
    category: 'Hair',
    durationValue: 45,
    durationUnit: 'minute',
    capacityPerSlot: 1,
    basePriceCents: 15000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    requiresPaymentBeforeConfirmation: false,
  },
  {
    id: 'svc-2',
    businessId: '1',
    name: 'Hair Coloring',
    description: 'Full hair coloring with premium products',
    category: 'Hair',
    durationValue: 120,
    durationUnit: 'minute',
    capacityPerSlot: 1,
    basePriceCents: 50000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    requiresPaymentBeforeConfirmation: true,
  },
  {
    id: 'svc-3',
    businessId: '1',
    name: 'Manicure',
    description: 'Classic manicure with nail polish',
    category: 'Nails',
    durationValue: 30,
    durationUnit: 'minute',
    capacityPerSlot: 2,
    basePriceCents: 10000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'svc-4',
    businessId: '1',
    name: 'Pedicure',
    description: 'Relaxing pedicure with foot massage',
    category: 'Nails',
    durationValue: 45,
    durationUnit: 'minute',
    capacityPerSlot: 2,
    basePriceCents: 12500000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'svc-5',
    businessId: '1',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial with premium skincare',
    category: 'Skincare',
    durationValue: 60,
    durationUnit: 'minute',
    capacityPerSlot: 1,
    basePriceCents: 25000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    requiresPaymentBeforeConfirmation: true,
  },
  {
    id: 'svc-6',
    businessId: '1',
    name: 'Yoga Class',
    description: 'Group yoga session for all levels',
    category: 'Wellness',
    durationValue: 60,
    durationUnit: 'minute',
    capacityPerSlot: 10,
    basePriceCents: 7500000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    isGroupBooking: true,
    minPeoplePerBooking: 1,
    waitingListEnabled: true,
  },
  {
    id: 'svc-7',
    businessId: '1',
    name: 'Private Yoga Session',
    description: 'One-on-one yoga instruction tailored to your needs',
    category: 'Wellness',
    durationValue: 90,
    durationUnit: 'minute',
    capacityPerSlot: 1,
    basePriceCents: 35000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    requiresPaymentBeforeConfirmation: true,
    waitingListEnabled: true,
  },
  {
    id: 'svc-8',
    businessId: '1',
    name: 'Corporate Wellness Workshop',
    description: 'Group wellness workshop for corporate teams',
    category: 'Wellness',
    durationValue: 3,
    durationUnit: 'hour',
    capacityPerSlot: 20,
    basePriceCents: 5000000,
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
    isGroupBooking: true,
    minPeoplePerBooking: 5,
  },
];

export const mockVariants: ServiceVariant[] = [
  {
    id: 'var-1',
    serviceId: 'svc-1',
    name: "Women's Cut",
    durationValue: 60,
    priceCents: 20000000,
    isActive: true,
  },
  {
    id: 'var-2',
    serviceId: 'svc-1',
    name: "Men's Cut",
    durationValue: 30,
    priceCents: 10000000,
    isActive: true,
  },
  {
    id: 'var-3',
    serviceId: 'svc-1',
    name: "Kid's Cut",
    durationValue: 20,
    priceCents: 7500000,
    isActive: true,
  },
  {
    id: 'var-4',
    serviceId: 'svc-2',
    name: 'Full Color',
    priceCents: 50000000,
    isActive: true,
  },
  {
    id: 'var-5',
    serviceId: 'svc-2',
    name: 'Highlights',
    durationValue: 90,
    priceCents: 40000000,
    isActive: true,
  },
  {
    id: 'var-6',
    serviceId: 'svc-2',
    name: 'Balayage',
    durationValue: 180,
    priceCents: 80000000,
    isActive: true,
  },
];

export const mockServiceResources: ServiceResource[] = [
  { serviceId: 'svc-1', resourceId: 'res-1' },
  { serviceId: 'svc-1', resourceId: 'res-2' },
  { serviceId: 'svc-2', resourceId: 'res-2' },
  { serviceId: 'svc-3', resourceId: 'res-3' },
  { serviceId: 'svc-4', resourceId: 'res-3' },
  { serviceId: 'svc-5', resourceId: 'res-4' },
  { serviceId: 'svc-6', resourceId: 'res-5' },
  { serviceId: 'svc-7', resourceId: 'res-5' },
  { serviceId: 'svc-8', resourceId: 'res-5' },
];

export const mockServiceLocations: ServiceLocation[] = [
  // All services at Sudirman
  { serviceId: 'svc-1', locationId: 'loc-1', isActive: true },
  { serviceId: 'svc-2', locationId: 'loc-1', isActive: true },
  { serviceId: 'svc-3', locationId: 'loc-1', isActive: true },
  { serviceId: 'svc-4', locationId: 'loc-1', isActive: true },
  { serviceId: 'svc-5', locationId: 'loc-1', isActive: true },
  { serviceId: 'svc-6', locationId: 'loc-1', isActive: true },
  // Limited services at Kemang (no yoga classes)
  { serviceId: 'svc-1', locationId: 'loc-2', isActive: true },
  { serviceId: 'svc-2', locationId: 'loc-2', priceCentsOverride: 55000000, isActive: true },
  { serviceId: 'svc-3', locationId: 'loc-2', isActive: true },
  { serviceId: 'svc-4', locationId: 'loc-2', isActive: true },
  { serviceId: 'svc-5', locationId: 'loc-2', priceCentsOverride: 28000000, isActive: true },
];

export const mockResourceLocations: ResourceLocation[] = [
  { resourceId: 'res-1', locationId: 'loc-1', isActive: true },
  { resourceId: 'res-1', locationId: 'loc-2', isActive: true },
  { resourceId: 'res-2', locationId: 'loc-1', isActive: true },
  { resourceId: 'res-3', locationId: 'loc-1', isActive: true },
  { resourceId: 'res-3', locationId: 'loc-2', isActive: true },
  { resourceId: 'res-4', locationId: 'loc-1', isActive: true },
  { resourceId: 'res-4', locationId: 'loc-2', isActive: true },
  { resourceId: 'res-5', locationId: 'loc-1', isActive: true },
];

export const mockSchedules: Schedule[] = [
  ...[1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `sch-${weekday}`,
    businessId: '1',
    weekday,
    startTime: '09:00',
    endTime: '18:00',
    slotSizeMinutes: 30,
    isActive: true,
  })),
];

export const mockBookings: Booking[] = [];
export const mockPayments: Payment[] = [];
export const mockCustomers: Customer[] = [];

// Membership Tiers
export const mockMembershipTiers: MembershipTier[] = [
  {
    id: 'tier-1',
    businessId: '1',
    name: 'Bronze',
    pointsMultiplier: 1,
    defaultDiscountPercent: 0,
    minPointsRequired: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-2',
    businessId: '1',
    name: 'Silver',
    pointsMultiplier: 1.5,
    defaultDiscountPercent: 5,
    minPointsRequired: 1000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-3',
    businessId: '1',
    name: 'Gold',
    pointsMultiplier: 2,
    defaultDiscountPercent: 10,
    minPointsRequired: 5000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-4',
    businessId: '1',
    name: 'Platinum',
    pointsMultiplier: 3,
    defaultDiscountPercent: 15,
    minPointsRequired: 15000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockMemberships: Membership[] = [];

export const mockDiscounts: Discount[] = [
  {
    id: 'disc-1',
    businessId: '1',
    name: 'New Customer 10% Off',
    discountType: 'percentage',
    discountValue: 10,
    isAuto: true,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc-2',
    businessId: '1',
    name: 'Gold Members Hair Discount',
    discountType: 'percentage',
    discountValue: 15,
    serviceId: 'svc-2',
    tierId: 'tier-3',
    isAuto: true,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc-3',
    businessId: '1',
    name: 'Holiday Special',
    code: 'HOLIDAY25',
    discountType: 'percentage',
    discountValue: 25,
    maxDiscountCents: 10000000,
    isAuto: false,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 100,
    usageCount: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc-4',
    businessId: '1',
    name: 'Kemang Opening Special',
    code: 'KEMANG50K',
    discountType: 'fixed',
    discountValue: 5000000,
    locationId: 'loc-2',
    isAuto: false,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 50,
    usageCount: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockWaitingList: WaitingListEntry[] = [
  {
    id: 'wl-1',
    businessId: '1',
    serviceId: 'svc-7',
    customerName: 'Putri Wulandari',
    customerPhone: '+62 812 3456 7890',
    customerEmail: 'putri@email.com',
    desiredStartAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Prefer morning sessions',
    status: 'waiting',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wl-2',
    businessId: '1',
    serviceId: 'svc-6',
    locationId: 'loc-1',
    customerName: 'Ahmad Rizki',
    customerPhone: '+62 813 9876 5432',
    status: 'invited',
    invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to get service variants
export function getServiceVariants(serviceId: string): ServiceVariant[] {
  return mockVariants.filter((v) => v.serviceId === serviceId && v.isActive);
}

// Helper to get service providers (resources with type='staff')
export function getServiceProviders(serviceId: string): Resource[] {
  const resourceIds = mockServiceResources
    .filter((sr) => sr.serviceId === serviceId)
    .map((sr) => sr.resourceId);
  return mockResources.filter((r) => resourceIds.includes(r.id) && r.type === 'staff' && r.isActive);
}

// Helper to get all providers (staff) for a business
export function getAllProviders(businessId: string): Resource[] {
  return mockResources.filter((r) => r.businessId === businessId && r.type === 'staff' && r.isActive);
}

// Helper to get services for a provider
export function getProviderServices(resourceId: string): Service[] {
  const serviceIds = mockServiceResources
    .filter((sr) => sr.resourceId === resourceId)
    .map((sr) => sr.serviceId);
  return mockServices.filter((s) => serviceIds.includes(s.id) && s.isActive);
}

// Helper to get locations for a business
export function getBusinessLocations(businessId: string): Location[] {
  return mockLocations.filter((l) => l.businessId === businessId && l.isActive);
}

// Helper to get services for a location
export function getLocationServices(locationId: string): Service[] {
  const serviceIds = mockServiceLocations
    .filter((sl) => sl.locationId === locationId && sl.isActive)
    .map((sl) => sl.serviceId);
  return mockServices.filter((s) => serviceIds.includes(s.id) && s.isActive);
}

// Helper to get providers for a location
export function getLocationProviders(locationId: string): Resource[] {
  const resourceIds = mockResourceLocations
    .filter((rl) => rl.locationId === locationId && rl.isActive)
    .map((rl) => rl.resourceId);
  return mockResources.filter((r) => resourceIds.includes(r.id) && r.type === 'staff' && r.isActive);
}

// Helper to get price for service at location (with override)
export function getServicePriceAtLocation(serviceId: string, locationId?: string): number {
  if (!locationId) {
    const service = mockServices.find((s) => s.id === serviceId);
    return service?.basePriceCents ?? 0;
  }
  const sl = mockServiceLocations.find((sl) => sl.serviceId === serviceId && sl.locationId === locationId);
  if (sl?.priceCentsOverride !== undefined) {
    return sl.priceCentsOverride;
  }
  const service = mockServices.find((s) => s.id === serviceId);
  return service?.basePriceCents ?? 0;
}

// Helper to group services by category
export function getServicesByCategory(services: Service[]): Record<string, Service[]> {
  return services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
}

// Format price in IDR
export function formatPrice(cents: number, currency: string = 'IDR'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format duration
export function formatDuration(value: number, unit: string): string {
  if (unit === 'minute') {
    if (value >= 60) {
      const hours = Math.floor(value / 60);
      const mins = value % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${value} min`;
  }
  if (unit === 'hour') {
    return value === 1 ? '1 hour' : `${value} hours`;
  }
  if (unit === 'day') {
    return value === 1 ? '1 day' : `${value} days`;
  }
  return `${value} ${unit}`;
}

// Calculate discount for a booking
export function calculateDiscount(
  serviceId: string,
  tierId?: string,
  locationId?: string,
  voucherCode?: string,
  basePriceCents: number = 0
): { discountCents: number; discountName?: string } {
  let bestDiscount = 0;
  let discountName: string | undefined;

  const now = new Date();

  for (const discount of mockDiscounts) {
    if (!discount.isActive) continue;
    if (new Date(discount.startAt) > now || new Date(discount.endAt) < now) continue;
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) continue;

    // Check targeting
    if (discount.serviceId && discount.serviceId !== serviceId) continue;
    if (discount.tierId && discount.tierId !== tierId) continue;
    if (discount.locationId && discount.locationId !== locationId) continue;

    // Voucher code check
    if (!discount.isAuto && discount.code) {
      if (!voucherCode || discount.code.toUpperCase() !== voucherCode.toUpperCase()) continue;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = Math.floor(basePriceCents * (discount.discountValue / 100));
    } else {
      discountAmount = discount.discountValue;
    }

    // Apply max cap
    if (discount.maxDiscountCents && discountAmount > discount.maxDiscountCents) {
      discountAmount = discount.maxDiscountCents;
    }

    if (discountAmount > bestDiscount) {
      bestDiscount = discountAmount;
      discountName = discount.name;
    }
  }

  return { discountCents: bestDiscount, discountName };
}
