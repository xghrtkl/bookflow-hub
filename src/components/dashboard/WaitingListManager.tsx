import { useState } from 'react';
import { Clock, Phone, Mail, Calendar, Check, X, Send, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { mockWaitingList, mockServices, mockLocations, formatPrice } from '@/data/mockData';
import { WaitingListEntry, WaitingListStatus } from '@/types/booking';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<WaitingListStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  waiting: { label: 'Waiting', variant: 'secondary' },
  invited: { label: 'Invited', variant: 'default' },
  converted: { label: 'Converted', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'destructive' },
};

export function WaitingListManager() {
  const [entries, setEntries] = useState<WaitingListEntry[]>(mockWaitingList);
  const [selectedEntry, setSelectedEntry] = useState<WaitingListEntry | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'invite' | 'convert' | 'cancel'>('invite');

  const getService = (serviceId: string) => mockServices.find((s) => s.id === serviceId);
  const getLocation = (locationId?: string) => locationId ? mockLocations.find((l) => l.id === locationId) : null;

  const openActionDialog = (entry: WaitingListEntry, action: 'invite' | 'convert' | 'cancel') => {
    setSelectedEntry(entry);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  const handleAction = () => {
    if (!selectedEntry) return;

    let newStatus: WaitingListStatus;
    let message: string;

    switch (actionType) {
      case 'invite':
        newStatus = 'invited';
        message = 'Customer has been invited';
        break;
      case 'convert':
        newStatus = 'converted';
        message = 'Booking created from waiting list';
        break;
      case 'cancel':
        newStatus = 'cancelled';
        message = 'Entry cancelled';
        break;
      default:
        return;
    }

    setEntries(
      entries.map((e) =>
        e.id === selectedEntry.id
          ? { 
              ...e, 
              status: newStatus,
              ...(actionType === 'invite' ? { invitedAt: new Date().toISOString() } : {})
            }
          : e
      )
    );

    toast.success(message);
    setIsActionDialogOpen(false);
  };

  const filterByStatus = (status?: WaitingListStatus) => {
    if (!status) return entries;
    return entries.filter((e) => e.status === status);
  };

  const renderEntry = (entry: WaitingListEntry) => {
    const service = getService(entry.serviceId);
    const location = getLocation(entry.locationId);
    const statusConfig = STATUS_CONFIG[entry.status];

    return (
      <Card key={entry.id}>
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{entry.customerName}</h3>
                <Badge variant={statusConfig.variant} className="text-xs">
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{entry.customerPhone}</span>
                </div>
                {entry.customerEmail && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{entry.customerEmail}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {service && (
                  <Badge variant="outline" className="text-xs">
                    {service.name}
                  </Badge>
                )}
                {location && (
                  <Badge variant="outline" className="text-xs">
                    {location.name}
                  </Badge>
                )}
                {entry.desiredStartAt && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(entry.desiredStartAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              {entry.notes && (
                <p className="text-sm text-muted-foreground mt-2 italic">"{entry.notes}"</p>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Added {new Date(entry.createdAt).toLocaleDateString()}
                {entry.invitedAt && ` • Invited ${new Date(entry.invitedAt).toLocaleDateString()}`}
              </p>
            </div>

            {entry.status === 'waiting' && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openActionDialog(entry, 'invite')}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Invite
                </Button>
                <Button
                  size="sm"
                  onClick={() => openActionDialog(entry, 'convert')}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Book
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openActionDialog(entry, 'cancel')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}

            {entry.status === 'invited' && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => openActionDialog(entry, 'convert')}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Book
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openActionDialog(entry, 'cancel')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">Waiting List</h2>
        <p className="text-sm text-muted-foreground">Manage customers waiting for availability</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
          <TabsTrigger value="waiting">Waiting ({filterByStatus('waiting').length})</TabsTrigger>
          <TabsTrigger value="invited">Invited ({filterByStatus('invited').length})</TabsTrigger>
          <TabsTrigger value="converted">Converted ({filterByStatus('converted').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No waiting list entries</p>
              </CardContent>
            </Card>
          ) : (
            entries.map(renderEntry)
          )}
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4 mt-4">
          {filterByStatus('waiting').map(renderEntry)}
        </TabsContent>

        <TabsContent value="invited" className="space-y-4 mt-4">
          {filterByStatus('invited').map(renderEntry)}
        </TabsContent>

        <TabsContent value="converted" className="space-y-4 mt-4">
          {filterByStatus('converted').map(renderEntry)}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'invite' && 'Invite Customer'}
              {actionType === 'convert' && 'Create Booking'}
              {actionType === 'cancel' && 'Cancel Entry'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'invite' && 
                `Send an invitation to ${selectedEntry?.customerName} to book their slot.`}
              {actionType === 'convert' && 
                `Create a booking for ${selectedEntry?.customerName} from this waiting list entry.`}
              {actionType === 'cancel' && 
                `Are you sure you want to cancel this waiting list entry for ${selectedEntry?.customerName}?`}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedEntry.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{selectedEntry.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">
                    {getService(selectedEntry.serviceId)?.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'cancel' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              {actionType === 'invite' && 'Send Invitation'}
              {actionType === 'convert' && 'Create Booking'}
              {actionType === 'cancel' && 'Cancel Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
