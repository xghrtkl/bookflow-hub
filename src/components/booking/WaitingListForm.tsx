import { useState } from 'react';
import { Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service, Location } from '@/types/booking';
import { toast } from 'sonner';

interface WaitingListFormProps {
  service: Service;
  location?: Location;
  onSubmit: (data: {
    name: string;
    phone: string;
    email?: string;
    desiredDate?: Date;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export function WaitingListForm({ service, location, onSubmit, onCancel }: WaitingListFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    desiredDate: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      desiredDate: formData.desiredDate ? new Date(formData.desiredDate) : undefined,
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Join Waiting List</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              We'll notify you when a spot opens up
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium text-foreground">{service.name}</p>
            {location && (
              <p className="text-muted-foreground">{location.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-name">Your Name *</Label>
            <Input
              id="wl-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-phone">Phone (WhatsApp) *</Label>
            <Input
              id="wl-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 812 3456 7890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-email">Email (optional)</Label>
            <Input
              id="wl-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-date">Preferred Date (optional)</Label>
            <Input
              id="wl-date"
              type="date"
              value={formData.desiredDate}
              onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-notes">Notes (optional)</Label>
            <Textarea
              id="wl-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any preferences or special requests..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Join Waiting List
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
