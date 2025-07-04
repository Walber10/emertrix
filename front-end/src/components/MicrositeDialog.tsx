import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface MicrositeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (microsite: any) => void;
  facilityId: number;
  existingOccupants: string[];
}

const MicrositeDialog = ({ open, onOpenChange, onSave, facilityId, existingOccupants }: MicrositeDialogProps) => {
  const { appData, addUser } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'office',
    epcRepresentative: '',
    occupants: [] as string[]
  });

  const [newPersonData, setNewPersonData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const facilityTypes = [
    "Office",
    "Warehouse",
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Education",
    "Industrial",
    "Mixed Use",
    "Other"
  ];

  const epcRepresentatives = appData.users.filter(user => user.role === 'admin' || user.role === 'point-of-contact');
  const { users } = appData;

  const availableUsers = users.filter(user => 
    user.role === 'occupant' && 
    !existingOccupants.includes(user._id) &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOccupantToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      occupants: prev.occupants.includes(userId)
        ? prev.occupants.filter(id => id !== userId)
        : [...prev.occupants, userId]
    }));
  };

  const handleCreateNewOccupant = () => {
    const newUser = addUser({
      role: 'occupant',
      name: newPersonData.name,
      email: newPersonData.email,
      phone: newPersonData.phone,
      organizationId: appData.organization?._id || '',
      facilityIds: []
    });

    setFormData(prev => ({
      ...prev,
      occupants: [...prev.occupants, newUser._id]
    }));

    setNewPersonData({
      name: '',
      email: '',
      phone: ''
    });

    toast({
      title: "New Occupant Created",
      description: `${newPersonData.name} has been added as an occupant.`,
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...formData,
      id: Date.now().toString()
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Microsite</DialogTitle>
          <DialogDescription>
            Create a new microsite within this facility.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epcRepresentative">EPC Representative</Label>
              <Select value={formData.epcRepresentative} onValueChange={(value) => setFormData({ ...formData, epcRepresentative: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a representative" />
                </SelectTrigger>
                <SelectContent>
                  {epcRepresentatives.map((rep) => (
                    <SelectItem key={rep._id} value={rep._id}>
                      {rep.name} - {rep.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-semibold">Assign Existing Occupants</h4>
          {availableUsers.map((user) => (
            <div key={user._id} className="flex items-center space-x-2">
              <Checkbox
                id={user._id}
                checked={formData.occupants.includes(user._id)}
                onCheckedChange={() => handleOccupantToggle(user._id)}
              />
              <Label htmlFor={user._id} className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                {user.name} - {user.email}
              </Label>
            </div>
          ))}
          
          <h4 className="text-md font-semibold mt-4">Create New Occupant</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newPersonData.name}
                onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newPersonData.email}
                onChange={(e) => setNewPersonData({ ...newPersonData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-phone">Phone</Label>
              <Input
                id="new-phone"
                type="tel"
                value={newPersonData.phone}
                onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
              />
            </div>
            <div>
              <Button type="button" onClick={handleCreateNewOccupant}>
                Create Occupant
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MicrositeDialog;
