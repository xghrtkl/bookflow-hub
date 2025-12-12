import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User, QrCode, Copy, ArrowLeft, Home } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockServices, mockBusiness, mockLocations, formatPrice, formatDuration } from '@/data/mockData';
import { Booking, Service, Location } from '@/types/booking';
import { toast } from 'sonner';

export default function ConfirmationPage() {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem(`booking_${bookingCode}`);
    
    if (storedBooking) {
      const parsedBooking = JSON.parse(storedBooking) as Booking;
      
      // Only show confirmation for confirmed bookings
      if (parsedBooking.status !== 'confirmed' && parsedBooking.status !== 'completed') {
        // Redirect to payment if pending
        if (parsedBooking.status === 'pending_payment') {
          navigate(`/pay/${bookingCode}`);
          return;
        }
        toast.error('Booking not confirmed');
        navigate('/');
        return;
      }

      setBooking(parsedBooking);
      
      const foundService = mockServices.find((s) => s.id === parsedBooking.serviceId);
      setService(foundService || null);

      if (parsedBooking.locationId) {
        const foundLocation = mockLocations.find((l) => l.id === parsedBooking.locationId);
        setLocation(foundLocation || null);
      }
    } else {
      toast.error('Booking not found');
      navigate('/');
    }
  }, [bookingCode, navigate]);

  const handleCopyCode = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingCode);
      toast.success('Booking code copied!');
    }
  };

  if (!booking || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const bookingDate = new Date(booking.startAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-foreground">{mockBusiness.name}</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Success Banner */}
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">Booking Confirmed!</h2>
          <p className="text-muted-foreground mt-2">
            Your appointment has been successfully booked
          </p>
        </div>

        {/* QR Code Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Show this QR code at check-in</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg mx-auto w-fit">
              <QRCode value={booking.qrCodeData} size={180} />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Booking Code</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold font-mono text-primary tracking-wider">
                  {booking.bookingCode}
                </span>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Booking Details</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(service.durationValue, service.durationUnit)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {bookingDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">
                    {bookingDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {new Date(booking.endAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {location && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{location.name}</p>
                    {location.address && (
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    )}
                  </div>
                </div>
              )}

              {booking.peopleCount > 1 && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">People</p>
                    <p className="font-medium text-foreground">{booking.peopleCount} people</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(booking.totalPriceCents, booking.currency)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to={`/b/${mockBusiness.slug}`}>
            <Button variant="outline" className="w-full">
              Book Another Appointment
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground">
          A confirmation has been sent to your phone. Please arrive 10 minutes before your appointment.
        </p>
      </main>
    </div>
  );
}
