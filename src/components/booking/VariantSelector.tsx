import { Service, ServiceVariant } from '@/types/booking';
import { formatPrice, formatDuration } from '@/data/mockData';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  service: Service;
  variants: ServiceVariant[];
  selectedVariantId?: string;
  onSelect: (variant: ServiceVariant) => void;
}

export function VariantSelector({
  service,
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Choose an option</h3>
      <div className="space-y-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const duration = variant.durationValue ?? service.durationValue;
          const durationUnit = variant.durationUnit ?? service.durationUnit;
          const price = variant.priceCents ?? service.basePriceCents;

          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">{variant.name}</span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(duration, durationUnit)}
                  </div>
                </div>
              </div>
              <span className="font-semibold text-primary">
                {formatPrice(price, service.currency)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
