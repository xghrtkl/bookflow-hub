import { User, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/booking';
import { cn } from '@/lib/utils';

interface ProviderPickerProps {
  providers: Resource[];
  selectedProviderId?: string;
  onSelect: (provider: Resource | null) => void;
  allowSkip?: boolean;
}

export function ProviderPicker({ providers, selectedProviderId, onSelect, allowSkip = true }: ProviderPickerProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Choose Provider</h2>
        <p className="text-sm text-muted-foreground mt-1">Select your preferred staff member</p>
      </div>

      <div className="space-y-3">
        {/* No Preference Option */}
        {allowSkip && (
          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              !selectedProviderId && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onSelect(null)}
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  !selectedProviderId ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">No Preference</h3>
                  <p className="text-sm text-muted-foreground">Any available provider</p>
                </div>
                <ChevronRight className={cn(
                  'w-5 h-5',
                  !selectedProviderId ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Options */}
        {providers.map((provider) => {
          const isSelected = selectedProviderId === provider.id;

          return (
            <Card
              key={provider.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary border-primary'
              )}
              onClick={() => onSelect(provider)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{provider.name}</h3>
                    {provider.role && (
                      <p className="text-sm text-muted-foreground">{provider.role}</p>
                    )}
                  </div>
                  <ChevronRight className={cn(
                    'w-5 h-5',
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
