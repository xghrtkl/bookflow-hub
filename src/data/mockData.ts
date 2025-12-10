import { Business, Service, ServiceVariant, Schedule, Booking, Customer } from '@/types/booking';

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
    basePriceCents: 15000000, // 150,000 IDR
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
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
    basePriceCents: 50000000, // 500,000 IDR
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
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
    basePriceCents: 10000000, // 100,000 IDR
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
    basePriceCents: 12500000, // 125,000 IDR
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
    basePriceCents: 25000000, // 250,000 IDR
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
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
    basePriceCents: 7500000, // 75,000 IDR
    currency: 'IDR',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockVariants: ServiceVariant[] = [
  {
    id: 'var-1',
    serviceId: 'svc-1',
    name: "Women's Cut",
    durationValue: 60,
    priceCents: 20000000, // 200,000 IDR
    isActive: true,
  },
  {
    id: 'var-2',
    serviceId: 'svc-1',
    name: "Men's Cut",
    durationValue: 30,
    priceCents: 10000000, // 100,000 IDR
    isActive: true,
  },
  {
    id: 'var-3',
    serviceId: 'svc-1',
    name: "Kid's Cut",
    durationValue: 20,
    priceCents: 7500000, // 75,000 IDR
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

export const mockSchedules: Schedule[] = [
  // Monday - Saturday 9 AM - 6 PM
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

export const mockCustomers: Customer[] = [];

// Helper to get service variants
export function getServiceVariants(serviceId: string): ServiceVariant[] {
  return mockVariants.filter((v) => v.serviceId === serviceId && v.isActive);
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
