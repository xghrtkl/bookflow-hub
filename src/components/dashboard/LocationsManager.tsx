import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { mockLocations, mockLocationSchedules, getLocationServices, getLocationProviders } from '@/data/mockData';
import { Location, LocationSchedule } from '@/types/booking';
import { toast } from 'sonner';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function LocationsManager() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [schedules, setSchedules] = useState<LocationSchedule[]>(mockLocationSchedules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    isActive: true,
  });

  const openAddDialog = () => {
    setEditingLocation(null);
    setFormData({ name: '', slug: '', address: '', phone: '', isActive: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      address: location.address || '',
      phone: location.phone || '',
      isActive: location.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Please enter name and slug');
      return;
    }

    if (editingLocation) {
      setLocations(
        locations.map((l) =>
          l.id === editingLocation.id
            ? { ...l, ...formData }
            : l
        )
      );
      toast.success('Location updated');
    } else {
      const newLocation: Location = {
        id: `loc-${Date.now()}`,
        businessId: '1',
        name: formData.name,
        slug: formData.slug,
        address: formData.address,
        phone: formData.phone,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      };
      setLocations([...locations, newLocation]);

      // Create default schedules for new location
      const newSchedules = [1, 2, 3, 4, 5, 6].map((weekday) => ({
        id: `loc-sch-${newLocation.id}-${weekday}`,
        locationId: newLocation.id,
        weekday,
        startTime: '09:00',
        endTime: '18:00',
        slotSizeMinutes: 30,
        isActive: true,
      }));
      setSchedules([...schedules, ...newSchedules]);

      toast.success('Location added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (location: Location) => {
    setLocations(locations.filter((l) => l.id !== location.id));
    setSchedules(schedules.filter((s) => s.locationId !== location.id));
    toast.success('Location removed');
  };

  const getLocationSchedule = (locationId: string): LocationSchedule[] => {
    return schedules.filter((s) => s.locationId === locationId);
  };

  const updateSchedule = (scheduleId: string, field: string, value: string | boolean | number) => {
    setSchedules(
      schedules.map((s) =>
        s.id === scheduleId ? { ...s, [field]: value } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Locations</h2>
          <p className="text-sm text-muted-foreground">Manage your branches and working hours</p>
        </div>
        <Button onClick={openAddDialog} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="space-y-4">
        {locations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No locations yet</p>
              <Button onClick={openAddDialog} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Location
              </Button>
            </CardContent>
          </Card>
        ) : (
          locations.map((location) => {
            const locationSchedules = getLocationSchedule(location.id);
            const services = getLocationServices(location.id);
            const providers = getLocationProviders(location.id);
            const isExpanded = expandedLocation === location.id;

            return (
              <Collapsible
                key={location.id}
                open={isExpanded}
                onOpenChange={() => setExpandedLocation(isExpanded ? null : location.id)}
              >
                <Card className={!location.isActive ? 'opacity-60' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <h3 className="font-semibold text-foreground truncate">{location.name}</h3>
                          {!location.isActive && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        {location.address && (
                          <p className="text-sm text-muted-foreground mt-1 ml-6">{location.address}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2 ml-6">
                          <Badge variant="outline" className="text-xs">
                            {services.length} services
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {providers.length} providers
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(location)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(location)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent className="mt-4">
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-medium text-foreground">Working Hours</h4>
                        </div>
                        <div className="space-y-2">
                          {WEEKDAYS.map((day, index) => {
                            const schedule = locationSchedules.find((s) => s.weekday === index);
                            return (
                              <div
                                key={day}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                              >
                                <div className="w-24">
                                  <span className="text-sm font-medium text-foreground">{day}</span>
                                </div>
                                <Switch
                                  checked={schedule?.isActive ?? false}
                                  onCheckedChange={(checked) =>
                                    schedule && updateSchedule(schedule.id, 'isActive', checked)
                                  }
                                />
                                {schedule?.isActive && (
                                  <>
                                    <Input
                                      type="time"
                                      value={schedule.startTime}
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, 'startTime', e.target.value)
                                      }
                                      className="w-28 h-8"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <Input
                                      type="time"
                                      value={schedule.endTime}
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, 'endTime', e.target.value)
                                      }
                                      className="w-28 h-8"
                                    />
                                    {schedule.breakStartTime && (
                                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                        Break: {schedule.breakStartTime}-{schedule.breakEndTime}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            );
          })
        )}
      </div>

      {/* Add/Edit Location Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Edit Location' : 'Add Location'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Glow Beauty - Sudirman"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., sudirman"
              />
              <p className="text-xs text-muted-foreground">Used in booking URL: /b/business/slug</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+62 21 1234 5678"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingLocation ? 'Save Changes' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
