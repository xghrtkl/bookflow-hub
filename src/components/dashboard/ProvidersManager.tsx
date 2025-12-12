import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Check, X, Link as LinkIcon } from 'lucide-react';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { mockResources, mockServiceResources, mockServices, getProviderServices } from '@/data/mockData';
import { Resource, Service } from '@/types/booking';
import { toast } from 'sonner';

export function ProvidersManager() {
  const [providers, setProviders] = useState<Resource[]>(
    mockResources.filter((r) => r.type === 'staff')
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Resource | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    isActive: true,
  });
  const [linkedServiceIds, setLinkedServiceIds] = useState<string[]>([]);

  const openAddDialog = () => {
    setEditingProvider(null);
    setFormData({ name: '', role: '', isActive: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (provider: Resource) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      role: provider.role || '',
      isActive: provider.isActive,
    });
    setIsDialogOpen(true);
  };

  const openServicesDialog = (provider: Resource) => {
    setSelectedProvider(provider);
    const currentServices = getProviderServices(provider.id);
    setLinkedServiceIds(currentServices.map((s) => s.id));
    setIsServicesDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (editingProvider) {
      setProviders(
        providers.map((p) =>
          p.id === editingProvider.id
            ? { ...p, name: formData.name, role: formData.role, isActive: formData.isActive }
            : p
        )
      );
      toast.success('Provider updated');
    } else {
      const newProvider: Resource = {
        id: `res-${Date.now()}`,
        businessId: '1',
        name: formData.name,
        role: formData.role,
        type: 'staff',
        isActive: formData.isActive,
      };
      setProviders([...providers, newProvider]);
      toast.success('Provider added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (provider: Resource) => {
    setProviders(providers.filter((p) => p.id !== provider.id));
    toast.success('Provider removed');
  };

  const handleToggleActive = (provider: Resource) => {
    setProviders(
      providers.map((p) =>
        p.id === provider.id ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  const handleSaveServices = () => {
    // In real app, update the mockServiceResources
    toast.success('Service assignments updated');
    setIsServicesDialogOpen(false);
  };

  const toggleService = (serviceId: string) => {
    setLinkedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Service Providers</h2>
          <p className="text-sm text-muted-foreground">Manage your staff and assign them to services</p>
        </div>
        <Button onClick={openAddDialog} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <div className="grid gap-4">
        {providers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No service providers yet</p>
              <Button onClick={openAddDialog} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Provider
              </Button>
            </CardContent>
          </Card>
        ) : (
          providers.map((provider) => {
            const services = getProviderServices(provider.id);
            return (
              <Card key={provider.id} className={!provider.isActive ? 'opacity-60' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
                        {!provider.isActive && (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      {provider.role && (
                        <p className="text-sm text-muted-foreground mt-0.5">{provider.role}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {services.length > 0 ? (
                          services.slice(0, 3).map((service) => (
                            <Badge key={service.id} variant="outline" className="text-xs">
                              {service.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No services assigned</span>
                        )}
                        {services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={provider.isActive}
                        onCheckedChange={() => handleToggleActive(provider)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openServicesDialog(provider)}
                        title="Manage Services"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(provider)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(provider)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Provider Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProvider ? 'Edit Provider' : 'Add Provider'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sarah"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title (optional)</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Senior Stylist"
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
              {editingProvider ? 'Save Changes' : 'Add Provider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Services Dialog */}
      <Dialog open={isServicesDialogOpen} onOpenChange={setIsServicesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Services to {selectedProvider?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {mockServices.filter((s) => s.isActive).map((service) => (
              <div
                key={service.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleService(service.id)}
              >
                <Checkbox
                  checked={linkedServiceIds.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.category}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServicesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveServices}>
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
