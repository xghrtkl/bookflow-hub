import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockServices, getServiceVariants, formatPrice, formatDuration } from '@/data/mockData';
import { Service, DurationUnit } from '@/types/booking';
import { toast } from '@/hooks/use-toast';

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const toggleServiceActive = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    ));
    toast({
      title: 'Service updated',
      description: 'Service status has been changed.',
    });
  };

  const handleSaveService = (data: Partial<Service>) => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? { ...s, ...data } : s
      ));
      toast({ title: 'Service updated' });
    } else {
      const newService: Service = {
        id: crypto.randomUUID(),
        businessId: '1',
        name: data.name || '',
        description: data.description || '',
        category: data.category || 'General',
        durationValue: data.durationValue || 30,
        durationUnit: data.durationUnit || 'minute',
        capacityPerSlot: data.capacityPerSlot || 1,
        basePriceCents: data.basePriceCents || 0,
        currency: 'IDR',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setServices([...services, newService]);
      toast({ title: 'Service created' });
    }
    setIsAddDialogOpen(false);
    setEditingService(null);
  };

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Services</h2>
          <p className="text-sm text-muted-foreground">Manage your services and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService || undefined}
              onSave={handleSaveService}
              onCancel={() => {
                setIsAddDialogOpen(false);
                setEditingService(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Services by Category */}
      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {category}
          </h3>
          <div className="space-y-3">
            {services
              .filter(s => s.category === category)
              .map(service => {
                const variants = getServiceVariants(service.id);
                return (
                  <div
                    key={service.id}
                    className="p-4 rounded-lg bg-card border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{service.name}</h4>
                          {!service.isActive && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatDuration(service.durationValue, service.durationUnit)}
                          </span>
                          {service.capacityPerSlot > 1 && (
                            <span className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              {service.capacityPerSlot} max
                            </span>
                          )}
                          <span className="font-medium text-primary">
                            {formatPrice(service.basePriceCents, service.currency)}
                          </span>
                        </div>

                        {variants.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {variants.length} variant{variants.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleServiceActive(service.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingService(service);
                            setIsAddDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ServiceFormProps {
  service?: Service;
  onSave: (data: Partial<Service>) => void;
  onCancel: () => void;
}

function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || '',
    durationValue: service?.durationValue || 30,
    durationUnit: service?.durationUnit || 'minute' as DurationUnit,
    capacityPerSlot: service?.capacityPerSlot || 1,
    basePriceCents: service?.basePriceCents ? service.basePriceCents / 100 : 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      basePriceCents: formData.basePriceCents * 100,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g. Hair, Nails, Skincare"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            min={1}
            value={formData.durationValue}
            onChange={e => setFormData({ ...formData, durationValue: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationUnit">Unit</Label>
          <Select
            value={formData.durationUnit}
            onValueChange={(value: DurationUnit) => setFormData({ ...formData, durationUnit: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minute">Minutes</SelectItem>
              <SelectItem value="hour">Hours</SelectItem>
              <SelectItem value="day">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (IDR)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={formData.basePriceCents}
            onChange={e => setFormData({ ...formData, basePriceCents: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Max Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            value={formData.capacityPerSlot}
            onChange={e => setFormData({ ...formData, capacityPerSlot: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {service ? 'Save Changes' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}
