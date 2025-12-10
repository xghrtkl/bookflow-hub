import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { VariantSelector } from '@/components/booking/VariantSelector';
import { DatePicker } from '@/components/booking/DatePicker';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { CustomerForm } from '@/components/booking/CustomerForm';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import {
  mockBusiness,
  mockServices,
  getServiceVariants,
  getServicesByCategory,
  formatPrice,
  formatDuration,
} from '@/data/mockData';
import {
  generateTimeSlots,
  getAvailableDates,
  generateBookingCode,
  getEffectiveDuration,
  getEffectivePrice,
  getDurationMinutes,
} from '@/lib/bookingUtils';
import { Service, ServiceVariant, TimeSlot, Booking } from '@/types/booking';
import { cn } from '@/lib/utils';

type BookingStep = 'services' | 'variants' | 'datetime' | 'details' | 'confirmation';

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // For MVP, use mock data
  const business = mockBusiness;
  const services = mockServices.filter((s) => s.isActive);
  const servicesByCategory = getServicesByCategory(services);

  // Booking state
  const [step, setStep] = useState<BookingStep>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get variants for selected service
  const variants = selectedService ? getServiceVariants(selectedService.id) : [];

  // Get available dates
  const availableDates = useMemo(() => {
    return getAvailableDates(business.id, 14);
  }, [business.id]);

  // Get time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];

    const duration = getEffectiveDuration(selectedService, selectedVariant ?? undefined);
    const durationMinutes = getDurationMinutes(duration.value, duration.unit);

    return generateTimeSlots(
      selectedDate,
      business.id,
      selectedService.id,
      durationMinutes,
      selectedService.capacityPerSlot
    );
  }, [selectedService, selectedVariant, selectedDate, business.id]);

  // Handlers
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    const serviceVariants = getServiceVariants(service.id);
    if (serviceVariants.length > 0) {
      setStep('variants');
    } else {
      setStep('datetime');
    }
  };

  const handleVariantSelect = (variant: ServiceVariant) => {
    setSelectedVariant(variant);
    setStep('datetime');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleBack = () => {
    switch (step) {
      case 'variants':
        setSelectedService(null);
        setStep('services');
        break;
      case 'datetime':
        if (variants.length > 0) {
          setStep('variants');
        } else {
          setSelectedService(null);
          setStep('services');
        }
        setSelectedDate(null);
        setSelectedSlot(null);
        break;
      case 'details':
        setStep('datetime');
        setSelectedSlot(null);
        break;
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    phone: string;
    email: string;
    peopleCount: number;
    notes: string;
  }) => {
    if (!selectedService || !selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    setCustomerName(formData.name);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const duration = getEffectiveDuration(selectedService, selectedVariant ?? undefined);
    const durationMinutes = getDurationMinutes(duration.value, duration.unit);
    const price = getEffectivePrice(selectedService, selectedVariant ?? undefined);

    // Create start/end timestamps
    const [hours, minutes] = selectedSlot.startTime.split(':').map(Number);
    const startAt = new Date(selectedDate);
    startAt.setHours(hours, minutes, 0, 0);

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + durationMinutes);

    const bookingCode = generateBookingCode(business.defaultBookingCodePrefix);

    const booking: Booking = {
      id: crypto.randomUUID(),
      businessId: business.id,
      serviceId: selectedService.id,
      serviceVariantId: selectedVariant?.id,
      customerId: crypto.randomUUID(),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      status: 'confirmed',
      peopleCount: formData.peopleCount,
      totalPriceCents: price * formData.peopleCount,
      currency: selectedService.currency,
      bookingCode,
      qrCodeData: `${window.location.origin}/checkin/${bookingCode}`,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(booking);
    setIsSubmitting(false);
    setStep('confirmation');
  };

  const handleNewBooking = () => {
    setStep('services');
    setSelectedService(null);
    setSelectedVariant(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setConfirmedBooking(null);
  };

  // Render confirmation
  if (step === 'confirmation' && confirmedBooking && selectedService) {
    return (
      <BookingConfirmation
        booking={confirmedBooking}
        business={business}
        service={selectedService}
        variant={selectedVariant ?? undefined}
        customerName={customerName}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          {step !== 'services' ? (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-foreground truncate">{business.name}</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {/* Step: Services */}
        {step === 'services' && (
          <div className="space-y-6 animate-fade-in">
            {/* Business Info */}
            <div className="text-center pb-4">
              <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground">
                {business.name}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {business.description}
              </p>
            </div>

            {/* Services by Category */}
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      variants={getServiceVariants(service.id)}
                      onClick={() => handleServiceSelect(service)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step: Variants */}
        {step === 'variants' && selectedService && (
          <div className="space-y-6 animate-fade-in">
            {/* Selected Service Summary */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h2 className="font-semibold text-foreground">{selectedService.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedService.description}
              </p>
            </div>

            <VariantSelector
              service={selectedService}
              variants={variants}
              selectedVariantId={selectedVariant?.id}
              onSelect={handleVariantSelect}
            />
          </div>
        )}

        {/* Step: Date & Time */}
        {step === 'datetime' && selectedService && (
          <div className="space-y-6 animate-fade-in">
            {/* Selected Service Summary */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    {selectedVariant?.name || selectedService.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(
                      selectedVariant?.durationValue ?? selectedService.durationValue,
                      selectedVariant?.durationUnit ?? selectedService.durationUnit
                    )}
                  </p>
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(
                    getEffectivePrice(selectedService, selectedVariant ?? undefined),
                    selectedService.currency
                  )}
                </span>
              </div>
            </div>

            {/* Date Picker */}
            <DatePicker
              availableDates={availableDates}
              selectedDate={selectedDate ?? undefined}
              onSelect={handleDateSelect}
            />

            {/* Time Slots */}
            {selectedDate && (
              <TimeSlotPicker
                slots={timeSlots}
                selectedSlot={selectedSlot ?? undefined}
                showCapacity={selectedService.capacityPerSlot > 1}
                onSelect={handleSlotSelect}
              />
            )}
          </div>
        )}

        {/* Step: Customer Details */}
        {step === 'details' && selectedService && selectedSlot && (
          <div className="space-y-6 animate-fade-in">
            {/* Booking Summary */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">
                  {selectedVariant?.name || selectedService.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDate?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold text-primary">
                  {formatPrice(
                    getEffectivePrice(selectedService, selectedVariant ?? undefined),
                    selectedService.currency
                  )}
                </span>
              </div>
            </div>

            {/* Customer Form */}
            <CustomerForm
              maxPeople={selectedSlot.remainingCapacity}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </main>
    </div>
  );
}
