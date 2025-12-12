import { useState } from 'react';
import { Plus, Edit2, Trash2, Crown, Gift, Tag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  mockMembershipTiers, mockMemberships, mockDiscounts, mockServices, 
  mockLocations, mockCustomers, formatPrice 
} from '@/data/mockData';
import { MembershipTier, Discount, DiscountType } from '@/types/booking';
import { toast } from 'sonner';

export function MembershipManager() {
  const [tiers, setTiers] = useState<MembershipTier[]>(mockMembershipTiers);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const [tierForm, setTierForm] = useState({
    name: '',
    pointsMultiplier: 1,
    defaultDiscountPercent: 0,
    minPointsRequired: 0,
    isActive: true,
  });

  const [discountForm, setDiscountForm] = useState({
    name: '',
    code: '',
    discountType: 'percentage' as DiscountType,
    discountValue: 0,
    maxDiscountCents: undefined as number | undefined,
    serviceId: '',
    tierId: '',
    locationId: '',
    isAuto: false,
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: undefined as number | undefined,
    isActive: true,
  });

  // Tier handlers
  const openAddTierDialog = () => {
    setEditingTier(null);
    setTierForm({ name: '', pointsMultiplier: 1, defaultDiscountPercent: 0, minPointsRequired: 0, isActive: true });
    setIsTierDialogOpen(true);
  };

  const openEditTierDialog = (tier: MembershipTier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      pointsMultiplier: tier.pointsMultiplier,
      defaultDiscountPercent: tier.defaultDiscountPercent || 0,
      minPointsRequired: tier.minPointsRequired,
      isActive: tier.isActive,
    });
    setIsTierDialogOpen(true);
  };

  const handleSaveTier = () => {
    if (!tierForm.name.trim()) {
      toast.error('Please enter tier name');
      return;
    }

    if (editingTier) {
      setTiers(tiers.map((t) => t.id === editingTier.id ? { ...t, ...tierForm } : t));
      toast.success('Tier updated');
    } else {
      const newTier: MembershipTier = {
        id: `tier-${Date.now()}`,
        businessId: '1',
        ...tierForm,
        createdAt: new Date().toISOString(),
      };
      setTiers([...tiers, newTier]);
      toast.success('Tier added');
    }
    setIsTierDialogOpen(false);
  };

  // Discount handlers
  const openAddDiscountDialog = () => {
    setEditingDiscount(null);
    setDiscountForm({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscountCents: undefined,
      serviceId: '',
      tierId: '',
      locationId: '',
      isAuto: false,
      startAt: new Date().toISOString().split('T')[0],
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: undefined,
      isActive: true,
    });
    setIsDiscountDialogOpen(true);
  };

  const openEditDiscountDialog = (discount: Discount) => {
    setEditingDiscount(discount);
    setDiscountForm({
      name: discount.name,
      code: discount.code || '',
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      maxDiscountCents: discount.maxDiscountCents,
      serviceId: discount.serviceId || '',
      tierId: discount.tierId || '',
      locationId: discount.locationId || '',
      isAuto: discount.isAuto,
      startAt: discount.startAt.split('T')[0],
      endAt: discount.endAt.split('T')[0],
      usageLimit: discount.usageLimit,
      isActive: discount.isActive,
    });
    setIsDiscountDialogOpen(true);
  };

  const handleSaveDiscount = () => {
    if (!discountForm.name.trim()) {
      toast.error('Please enter discount name');
      return;
    }
    if (!discountForm.isAuto && !discountForm.code.trim()) {
      toast.error('Voucher code is required for manual discounts');
      return;
    }

    if (editingDiscount) {
      setDiscounts(discounts.map((d) => 
        d.id === editingDiscount.id 
          ? { 
              ...d, 
              ...discountForm,
              startAt: new Date(discountForm.startAt).toISOString(),
              endAt: new Date(discountForm.endAt).toISOString(),
            } 
          : d
      ));
      toast.success('Discount updated');
    } else {
      const newDiscount: Discount = {
        id: `disc-${Date.now()}`,
        businessId: '1',
        ...discountForm,
        code: discountForm.isAuto ? undefined : discountForm.code,
        serviceId: discountForm.serviceId || undefined,
        tierId: discountForm.tierId || undefined,
        locationId: discountForm.locationId || undefined,
        startAt: new Date(discountForm.startAt).toISOString(),
        endAt: new Date(discountForm.endAt).toISOString(),
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      setDiscounts([...discounts, newDiscount]);
      toast.success('Discount added');
    }
    setIsDiscountDialogOpen(false);
  };

  const handleDeleteTier = (tier: MembershipTier) => {
    setTiers(tiers.filter((t) => t.id !== tier.id));
    toast.success('Tier removed');
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setDiscounts(discounts.filter((d) => d.id !== discount.id));
    toast.success('Discount removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">Membership & Loyalty</h2>
        <p className="text-sm text-muted-foreground">Manage membership tiers, points, and discounts</p>
      </div>

      <Tabs defaultValue="tiers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={openAddTierDialog} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="grid gap-4">
            {tiers.map((tier) => (
              <Card key={tier.id} className={!tier.isActive ? 'opacity-60' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground">{tier.name}</h3>
                        {!tier.isActive && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {tier.pointsMultiplier}x points
                        </Badge>
                        {tier.defaultDiscountPercent && tier.defaultDiscountPercent > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {tier.defaultDiscountPercent}% discount
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Min {tier.minPointsRequired} pts
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditTierDialog(tier)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTier(tier)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discounts Tab */}
        <TabsContent value="discounts" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={openAddDiscountDialog} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Discount
            </Button>
          </div>

          <div className="grid gap-4">
            {discounts.map((discount) => (
              <Card key={discount.id} className={!discount.isActive ? 'opacity-60' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground">{discount.name}</h3>
                        {discount.isAuto ? (
                          <Badge variant="secondary" className="text-xs">Auto</Badge>
                        ) : (
                          <Badge className="text-xs">{discount.code}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {discount.discountType === 'percentage' 
                            ? `${discount.discountValue}% off`
                            : formatPrice(discount.discountValue) + ' off'}
                        </Badge>
                        {discount.usageLimit && (
                          <Badge variant="outline" className="text-xs">
                            {discount.usageCount}/{discount.usageLimit} used
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Until {new Date(discount.endAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDiscountDialog(discount)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDiscount(discount)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4 mt-4">
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No members yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Members are automatically added when customers complete bookings
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tier Dialog */}
      <Dialog open={isTierDialogOpen} onOpenChange={setIsTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier ? 'Edit Tier' : 'Add Tier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tierName">Tier Name</Label>
              <Input
                id="tierName"
                value={tierForm.name}
                onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                placeholder="e.g., Gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="multiplier">Points Multiplier</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={tierForm.pointsMultiplier}
                  onChange={(e) => setTierForm({ ...tierForm, pointsMultiplier: parseFloat(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Default Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={tierForm.defaultDiscountPercent}
                  onChange={(e) => setTierForm({ ...tierForm, defaultDiscountPercent: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPoints">Min Points Required</Label>
              <Input
                id="minPoints"
                type="number"
                min="0"
                value={tierForm.minPointsRequired}
                onChange={(e) => setTierForm({ ...tierForm, minPointsRequired: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={tierForm.isActive}
                onCheckedChange={(checked) => setTierForm({ ...tierForm, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTierDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTier}>{editingTier ? 'Save Changes' : 'Add Tier'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Discount Name</Label>
              <Input
                value={discountForm.name}
                onChange={(e) => setDiscountForm({ ...discountForm, name: e.target.value })}
                placeholder="e.g., Holiday Special"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto-apply (no code needed)</Label>
              <Switch
                checked={discountForm.isAuto}
                onCheckedChange={(checked) => setDiscountForm({ ...discountForm, isAuto: checked })}
              />
            </div>

            {!discountForm.isAuto && (
              <div className="space-y-2">
                <Label>Voucher Code</Label>
                <Input
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountForm.discountType}
                  onValueChange={(value: DiscountType) => setDiscountForm({ ...discountForm, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  min="0"
                  value={discountForm.discountValue}
                  onChange={(e) => setDiscountForm({ ...discountForm, discountValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={discountForm.startAt}
                  onChange={(e) => setDiscountForm({ ...discountForm, startAt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={discountForm.endAt}
                  onChange={(e) => setDiscountForm({ ...discountForm, endAt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Service (optional)</Label>
              <Select
                value={discountForm.serviceId}
                onValueChange={(value) => setDiscountForm({ ...discountForm, serviceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All services</SelectItem>
                  {mockServices.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Tier (optional)</Label>
              <Select
                value={discountForm.tierId}
                onValueChange={(value) => setDiscountForm({ ...discountForm, tierId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All tiers</SelectItem>
                  {tiers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Location (optional)</Label>
              <Select
                value={discountForm.locationId}
                onValueChange={(value) => setDiscountForm({ ...discountForm, locationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All locations</SelectItem>
                  {mockLocations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Usage Limit (optional)</Label>
              <Input
                type="number"
                min="1"
                value={discountForm.usageLimit || ''}
                onChange={(e) => setDiscountForm({ ...discountForm, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Unlimited"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={discountForm.isActive}
                onCheckedChange={(checked) => setDiscountForm({ ...discountForm, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDiscount}>{editingDiscount ? 'Save Changes' : 'Add Discount'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
