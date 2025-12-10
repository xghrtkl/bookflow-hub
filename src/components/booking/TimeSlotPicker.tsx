import { TimeSlot } from '@/types/booking';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  showCapacity?: boolean;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  showCapacity = false,
  onSelect,
}: TimeSlotPickerProps) {
  const availableSlots = slots.filter((s) => s.available);
  const unavailableSlots = slots.filter((s) => !s.available);

  if (slots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No available time slots for this date.</p>
      </div>
    );
  }

  const isSelected = (slot: TimeSlot) => {
    return selectedSlot?.startTime === slot.startTime;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Select a time</h3>
        <span className="text-sm text-muted-foreground">
          {availableSlots.length} available
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot, idx) => (
          <button
            key={idx}
            onClick={() => slot.available && onSelect(slot)}
            disabled={!slot.available}
            className={cn(
              'py-3 px-2 rounded-lg text-center transition-all duration-200',
              slot.available
                ? isSelected(slot)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-foreground hover:border-primary/30 border border-transparent'
                : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through'
            )}
          >
            <div className="font-medium text-sm">{slot.startTime}</div>
            {showCapacity && slot.available && slot.remainingCapacity > 1 && (
              <div className="flex items-center justify-center gap-1 mt-1 text-xs opacity-70">
                <Users className="w-3 h-3" />
                {slot.remainingCapacity}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
