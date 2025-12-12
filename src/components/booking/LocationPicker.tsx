import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Location, LocationSchedule } from '@/types/booking';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
  locations: Location[];
  schedules: LocationSchedule[];
  selectedLocationId?: string;
  onSelect: (location: Location) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function LocationPicker({ locations, schedules, selectedLocationId, onSelect }: LocationPickerProps) {
  const getLocationHours = (locationId: string) => {
    const locationSchedules = schedules.filter((s) => s.locationId === locationId && s.isActive);
    if (locationSchedules.length === 0) return null;

    // Get today's schedule
    const today = new Date().getDay();
    const todaySchedule = locationSchedules.find((s) => s.weekday === today);

    if (!todaySchedule) {
      // Find next open day
      const nextOpen = locationSchedules.sort((a, b) => {
        const aDays = (a.weekday - today + 7) % 7;
        const bDays = (b.weekday - today + 7) % 7;
        return aDays - bDays;
      })[0];
      return `Opens ${WEEKDAYS[nextOpen.weekday]} ${nextOpen.startTime}`;
    }

    return `Open today ${todaySchedule.startTime} - ${todaySchedule.endTime}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Select Location</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose your preferred branch</p>
      </div>

      <div className="space-y-3">
        {locations.map((location) => {
          const isSelected = selectedLocationId === location.id;
          const hours = getLocationHours(location.id);

          return (
            <Card
              key={location.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary border-primary'
              )}
              onClick={() => onSelect(location)}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{location.name}</h3>
                    {location.address && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {location.address}
                      </p>
                    )}
                    {hours && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{hours}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
