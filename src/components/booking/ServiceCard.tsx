import { Service, ServiceVariant } from '@/types/booking';
import { formatPrice, formatDuration } from '@/data/mockData';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  variants?: ServiceVariant[];
  onClick: () => void;
}

export function ServiceCard({ service, variants, onClick }: ServiceCardProps) {
  const hasVariants = variants && variants.length > 0;
  const priceRange = hasVariants
    ? getPriceRange(service, variants)
    : formatPrice(service.basePriceCents, service.currency);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg bg-card border border-border',
        'hover:border-primary/50 hover:shadow-md transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        'active:scale-[0.98]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{service.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {service.description}
          </p>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDuration(service.durationValue, service.durationUnit)}
              {hasVariants && '+'}
            </span>
            {service.capacityPerSlot > 1 && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Up to {service.capacityPerSlot}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className="font-semibold text-primary whitespace-nowrap">
            {priceRange}
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}

function getPriceRange(service: Service, variants: ServiceVariant[]): string {
  const prices = variants
    .filter((v) => v.isActive)
    .map((v) => v.priceCents ?? service.basePriceCents);
  
  if (prices.length === 0) {
    return formatPrice(service.basePriceCents, service.currency);
  }
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  if (min === max) {
    return formatPrice(min, service.currency);
  }
  
  return `${formatPrice(min, service.currency)} - ${formatPrice(max, service.currency)}`;
}
