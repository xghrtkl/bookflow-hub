import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Users, MessageSquare } from 'lucide-react';

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  peopleCount: number;
  notes: string;
}

interface CustomerFormProps {
  maxPeople?: number;
  onSubmit: (data: CustomerFormData) => void;
  isSubmitting?: boolean;
}

export function CustomerForm({ maxPeople = 1, onSubmit, isSubmitting }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
    peopleCount: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-foreground">Your details</h3>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            WhatsApp / Phone *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+62 812 3456 7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email (optional)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* People Count */}
        {maxPeople > 1 && (
          <div className="space-y-2">
            <Label htmlFor="people" className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Number of people
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setFormData({
                    ...formData,
                    peopleCount: Math.max(1, formData.peopleCount - 1),
                  })
                }
                disabled={formData.peopleCount <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium text-lg">
                {formData.peopleCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setFormData({
                    ...formData,
                    peopleCount: Math.min(maxPeople, formData.peopleCount + 1),
                  })
                }
                disabled={formData.peopleCount >= maxPeople}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">
                (max {maxPeople})
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Notes (optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
      </Button>
    </form>
  );
}
