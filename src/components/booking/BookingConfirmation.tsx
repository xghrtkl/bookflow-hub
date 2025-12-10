import { Booking, Service, ServiceVariant, Business } from '@/types/booking';
import { formatPrice, formatDuration } from '@/data/mockData';
import { getEffectiveDuration, getEffectivePrice } from '@/lib/bookingUtils';
import { CheckCircle2, Calendar, Clock, MapPin, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface BookingConfirmationProps {
  booking: Booking;
  business: Business;
  service: Service;
  variant?: ServiceVariant;
  customerName: string;
  onNewBooking: () => void;
}

export function BookingConfirmation({
  booking,
  business,
  service,
  variant,
  customerName,
  onNewBooking,
}: BookingConfirmationProps) {
  const duration = getEffectiveDuration(service, variant);
  const startDate = new Date(booking.startAt);

  const copyBookingCode = () => {
    navigator.clipboard.writeText(booking.bookingCode);
    toast({
      title: 'Copied!',
      description: 'Booking code copied to clipboard',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success Header */}
      <div className="gradient-primary py-8 px-4 text-center text-primary-foreground">
        <div className="animate-scale-in">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display">Booking Confirmed!</h1>
          <p className="mt-2 opacity-90">Thank you, {customerName}</p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="flex-1 px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up">
          {/* QR Code Section */}
          <div className="p-6 bg-muted/50 flex flex-col items-center border-b border-border">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCode
                value={booking.qrCodeData}
                size={160}
                level="M"
              />
            </div>
            
            {/* Booking Code */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Booking Code</p>
              <button
                onClick={copyBookingCode}
                className="flex items-center gap-2 mt-1 px-4 py-2 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <span className="text-xl font-bold font-mono text-foreground">
                  {booking.bookingCode}
                </span>
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{formatDateTime(startDate)}</p>
                <p className="text-muted-foreground">{formatTime(startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {variant?.name || service.name}
                </p>
                <p className="text-muted-foreground">
                  {formatDuration(duration.value, duration.unit)}
                  {booking.peopleCount > 1 && ` • ${booking.peopleCount} people`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{business.name}</p>
                <p className="text-muted-foreground">{business.description}</p>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(booking.totalPriceCents, booking.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3 pb-8">
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={onNewBooking}
          >
            Book Another Service
          </Button>
        </div>
      </div>
    </div>
  );
}
