import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, Clock, ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockBookings, mockPayments, mockServices, mockBusiness, formatPrice, formatDuration } from '@/data/mockData';
import { Booking, Payment, PaymentMethod, Service } from '@/types/booking';
import { toast } from 'sonner';

const PAYMENT_METHODS: { id: PaymentMethod; name: string; description: string }[] = [
  { id: 'qris', name: 'QRIS', description: 'Scan QR code with any e-wallet' },
  { id: 'va', name: 'Virtual Account', description: 'Bank transfer via VA' },
  { id: 'credit_card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, JCB' },
];

export default function PaymentPage() {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  // Simulated booking/payment lookup (in real app, fetch from API)
  useEffect(() => {
    // For demo, we'll check localStorage or create a mock pending booking
    const storedBooking = localStorage.getItem(`booking_${bookingCode}`);
    
    if (storedBooking) {
      const parsedBooking = JSON.parse(storedBooking) as Booking;
      setBooking(parsedBooking);
      
      const foundService = mockServices.find((s) => s.id === parsedBooking.serviceId);
      setService(foundService || null);

      // Check if already confirmed
      if (parsedBooking.status === 'confirmed') {
        navigate(`/confirmation/${bookingCode}`);
        return;
      }

      // Create or get payment
      const storedPayment = localStorage.getItem(`payment_${bookingCode}`);
      if (storedPayment) {
        setPayment(JSON.parse(storedPayment));
      } else {
        const newPayment: Payment = {
          id: `pay-${Date.now()}`,
          bookingId: parsedBooking.id,
          amountCents: parsedBooking.totalPriceCents,
          currency: parsedBooking.currency,
          status: 'pending',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
          createdAt: new Date().toISOString(),
        };
        setPayment(newPayment);
        localStorage.setItem(`payment_${bookingCode}`, JSON.stringify(newPayment));
      }
    } else {
      // No booking found - redirect to home
      toast.error('Booking not found');
      navigate('/');
    }
  }, [bookingCode, navigate]);

  const handlePayment = async () => {
    if (!booking || !payment) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      setPaymentStatus('success');
      
      // Update payment status
      const updatedPayment: Payment = {
        ...payment,
        status: 'paid',
        method: selectedMethod,
        paidAt: new Date().toISOString(),
      };
      setPayment(updatedPayment);
      localStorage.setItem(`payment_${bookingCode}`, JSON.stringify(updatedPayment));

      // Update booking status
      const updatedBooking: Booking = {
        ...booking,
        status: 'confirmed',
      };
      setBooking(updatedBooking);
      localStorage.setItem(`booking_${bookingCode}`, JSON.stringify(updatedBooking));

      toast.success('Payment successful!');

      // Redirect to confirmation after short delay
      setTimeout(() => {
        navigate(`/confirmation/${bookingCode}`);
      }, 1500);
    } else {
      setPaymentStatus('failed');
      
      const updatedPayment: Payment = {
        ...payment,
        status: 'failed',
      };
      setPayment(updatedPayment);
      localStorage.setItem(`payment_${bookingCode}`, JSON.stringify(updatedPayment));

      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    if (!payment) return;
    
    const updatedPayment: Payment = {
      ...payment,
      status: 'pending',
    };
    setPayment(updatedPayment);
    localStorage.setItem(`payment_${bookingCode}`, JSON.stringify(updatedPayment));
    setPaymentStatus('pending');
  };

  if (!booking || !payment || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Calculate time remaining
  const expiresAt = new Date(payment.expiresAt);
  const timeRemaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-foreground">Complete Payment</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Payment Status Cards */}
        {paymentStatus === 'success' && (
          <Card className="border-success/50 bg-success/5">
            <CardContent className="py-6 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
              <h2 className="text-xl font-bold text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground mt-2">Redirecting to your booking confirmation...</p>
            </CardContent>
          </Card>
        )}

        {paymentStatus === 'failed' && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-bold text-foreground">Payment Failed</h2>
              <p className="text-muted-foreground mt-2">Something went wrong. Please try again.</p>
              <Button onClick={handleRetry} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {paymentStatus !== 'success' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">
                    {formatDuration(service.durationValue, service.durationUnit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium text-foreground">
                    {new Date(booking.startAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(booking.startAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {booking.peopleCount > 1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">People</span>
                    <span className="font-medium text-foreground">{booking.peopleCount}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-lg">
                    {formatPrice(booking.totalPriceCents, booking.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Time Remaining */}
            {paymentStatus === 'pending' && timeRemaining > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Payment expires in {timeRemaining} minutes</span>
              </div>
            )}

            {/* Payment Method Selection */}
            {paymentStatus === 'pending' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          {method.id === 'qris' && <QrCode className="w-6 h-6 text-muted-foreground" />}
                          {method.id === 'credit_card' && <CreditCard className="w-6 h-6 text-muted-foreground" />}
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Pay Button */}
            {paymentStatus === 'pending' && (
              <Button
                className="w-full h-14 text-lg"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatPrice(booking.totalPriceCents, booking.currency)}`
                )}
              </Button>
            )}

            {/* Processing State */}
            {paymentStatus === 'processing' && (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="animate-spin text-2xl">⏳</span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Processing Payment</h2>
                  <p className="text-muted-foreground mt-2">Please wait while we process your payment...</p>
                </CardContent>
              </Card>
            )}

            {/* Demo Notice */}
            <p className="text-xs text-center text-muted-foreground">
              🎭 Demo Mode: Click "Pay" to simulate a payment. 90% chance of success.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
