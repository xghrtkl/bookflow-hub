import { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Booking, BookingStatus } from '@/types/booking';
import { mockServices, formatPrice, formatDuration } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

// Mock bookings for demo
const mockDemoBookings: (Booking & { customerName: string; customerPhone: string })[] = [
  {
    id: '1',
    businessId: '1',
    serviceId: 'svc-1',
    customerId: 'cust-1',
    customerName: 'Sarah Johnson',
    customerPhone: '+62 812 3456 7890',
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    peopleCount: 1,
    totalPriceCents: 20000000,
    currency: 'IDR',
    bookingCode: 'GLW-20241210-A1B2',
    qrCodeData: 'https://example.com/checkin/GLW-20241210-A1B2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    businessId: '1',
    serviceId: 'svc-2',
    customerId: 'cust-2',
    customerName: 'Michael Chen',
    customerPhone: '+62 813 9876 5432',
    startAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    peopleCount: 1,
    totalPriceCents: 50000000,
    currency: 'IDR',
    bookingCode: 'GLW-20241210-C3D4',
    qrCodeData: 'https://example.com/checkin/GLW-20241210-C3D4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    businessId: '1',
    serviceId: 'svc-3',
    customerId: 'cust-3',
    customerName: 'Emma Wilson',
    customerPhone: '+62 814 5555 6666',
    startAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 6.5 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    peopleCount: 2,
    totalPriceCents: 20000000,
    currency: 'IDR',
    bookingCode: 'GLW-20241210-E5F6',
    qrCodeData: 'https://example.com/checkin/GLW-20241210-E5F6',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    businessId: '1',
    serviceId: 'svc-5',
    customerId: 'cust-4',
    customerName: 'David Lee',
    customerPhone: '+62 815 1111 2222',
    startAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    peopleCount: 1,
    totalPriceCents: 25000000,
    currency: 'IDR',
    bookingCode: 'GLW-20241210-G7H8',
    qrCodeData: 'https://example.com/checkin/GLW-20241210-G7H8',
    createdAt: new Date().toISOString(),
  },
];

export function BookingsManager() {
  const [bookings, setBookings] = useState(mockDemoBookings);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockDemoBookings[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('today');

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));
    setSelectedBooking(null);
    toast({
      title: 'Booking updated',
      description: `Status changed to ${status}`,
    });
  };

  const getServiceName = (serviceId: string) => {
    return mockServices.find(s => s.id === serviceId)?.name || 'Unknown Service';
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  const filteredBookings = bookings.filter(booking => {
    const now = new Date();
    const startAt = new Date(booking.startAt);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'today':
        return startAt >= today && startAt < tomorrow;
      case 'upcoming':
        return startAt >= now;
      case 'past':
        return startAt < now;
      default:
        return true;
    }
  });

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      confirmed: 'bg-primary/10 text-primary',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-destructive/10 text-destructive',
      no_show: 'bg-muted text-muted-foreground',
    };
    return styles[status];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Bookings</h2>
          <p className="text-sm text-muted-foreground">Manage your appointments</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['today', 'upcoming', 'past', 'all'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="whitespace-nowrap"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No bookings found</p>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const { date, time } = formatDateTime(booking.startAt);
            return (
              <button
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {booking.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {getServiceName(booking.serviceId)}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {date}
                        <Clock className="w-3 h-3 ml-1" />
                        {time}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(booking.totalPriceCents, booking.currency)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {selectedBooking.customerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedBooking.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">
                    {getServiceName(selectedBooking.serviceId)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium text-foreground">
                    {formatDateTime(selectedBooking.startAt).date}, {formatDateTime(selectedBooking.startAt).time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">People</span>
                  <span className="font-medium text-foreground">{selectedBooking.peopleCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Booking Code</span>
                  <span className="font-mono text-foreground">{selectedBooking.bookingCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(selectedBooking.totalPriceCents, selectedBooking.currency)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                </div>
              )}
              
              {selectedBooking.status === 'pending' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
