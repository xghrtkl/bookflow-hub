import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  availableDates: Date[];
  selectedDate?: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ availableDates, selectedDate, onSelect }: DatePickerProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;
  
  const visibleDates = availableDates.slice(startIndex, startIndex + visibleCount);
  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + visibleCount < availableDates.length;

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Select a date</h3>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
          disabled={!canGoBack}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoBack
              ? 'hover:bg-muted text-foreground'
              : 'text-muted-foreground/30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex gap-2 justify-center">
          {visibleDates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(date)}
              className={cn(
                'flex-1 max-w-[72px] py-3 px-2 rounded-xl text-center transition-all duration-200',
                isSelected(date)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              )}
            >
              <div className="text-xs font-medium opacity-70">
                {isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : formatDay(date)}
              </div>
              <div className="text-xl font-bold mt-1">{formatDate(date)}</div>
              <div className="text-xs font-medium opacity-70">{formatMonth(date)}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStartIndex(startIndex + 1)}
          disabled={!canGoForward}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoForward
              ? 'hover:bg-muted text-foreground'
              : 'text-muted-foreground/30 cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
