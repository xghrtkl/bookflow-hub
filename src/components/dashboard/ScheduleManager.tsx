import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockSchedules } from '@/data/mockData';
import { Schedule } from '@/types/booking';
import { toast } from '@/hooks/use-toast';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);

  const toggleDay = (weekday: number) => {
    const existing = schedules.find(s => s.weekday === weekday);
    if (existing) {
      setSchedules(schedules.map(s => 
        s.weekday === weekday ? { ...s, isActive: !s.isActive } : s
      ));
    } else {
      const newSchedule: Schedule = {
        id: crypto.randomUUID(),
        businessId: '1',
        weekday,
        startTime: '09:00',
        endTime: '18:00',
        slotSizeMinutes: 30,
        isActive: true,
      };
      setSchedules([...schedules, newSchedule]);
    }
    toast({ title: 'Schedule updated' });
  };

  const updateSchedule = (weekday: number, field: 'startTime' | 'endTime' | 'slotSizeMinutes', value: string | number) => {
    setSchedules(schedules.map(s => 
      s.weekday === weekday ? { ...s, [field]: value } : s
    ));
  };

  const getScheduleForDay = (weekday: number) => {
    return schedules.find(s => s.weekday === weekday);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">Schedule</h2>
        <p className="text-sm text-muted-foreground">Set your weekly working hours</p>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-3">
        {WEEKDAYS.map((day, index) => {
          const schedule = getScheduleForDay(index);
          const isActive = schedule?.isActive ?? false;

          return (
            <div
              key={day}
              className="p-4 rounded-lg bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleDay(index)}
                  />
                  <span className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {day}
                  </span>
                </div>
                {isActive && schedule && (
                  <span className="text-sm text-muted-foreground">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                )}
              </div>

              {isActive && schedule && (
                <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start</Label>
                    <Input
                      type="time"
                      value={schedule.startTime}
                      onChange={e => updateSchedule(index, 'startTime', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">End</Label>
                    <Input
                      type="time"
                      value={schedule.endTime}
                      onChange={e => updateSchedule(index, 'endTime', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Slot (min)</Label>
                    <Input
                      type="number"
                      min={5}
                      step={5}
                      value={schedule.slotSizeMinutes}
                      onChange={e => updateSchedule(index, 'slotSizeMinutes', parseInt(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Weekly Summary</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Open {schedules.filter(s => s.isActive).length} days per week
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {schedules
            .filter(s => s.isActive)
            .sort((a, b) => a.weekday - b.weekday)
            .map(s => (
              <span
                key={s.weekday}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
              >
                {WEEKDAYS[s.weekday].slice(0, 3)}
              </span>
            ))}
        </div>
      </div>

      {/* Time Blocks (Future Feature) */}
      <div className="p-4 rounded-lg bg-card border border-border border-dashed">
        <div className="text-center text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Break Times & Blocked Slots</p>
          <p className="text-xs mt-1">Coming soon - block specific times for breaks</p>
        </div>
      </div>
    </div>
  );
}
