import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp, User } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: User | null;
}

export const EditPersonModal = ({ isOpen, onClose, person }: EditPersonModalProps) => {
  const { updateUser, appData, assignOccupantToFacility, removeOccupantFromFacility } = useApp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'occupant' as 'admin' | 'occupant',
    isPointOfContact: false,
    assignToFacility: 'no-facility',
    assignToMicrosite: 'no-microsite',
    profilePicture: null as File | null,
    qualifications: null as File | null,
  });

  useEffect(() => {
    if (person) {
      const [firstName, ...lastNameParts] = person.name.split(' ');

      // Find which facility this person is assigned to
      const assignedFacility = appData.facilities.find(facility =>
        facility.assignedOccupantIds.includes(person._id),
      );

      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: person.email,
        phone: person.phone,
        role:
          person.role === 'point-of-contact' ? 'occupant' : (person.role as 'admin' | 'occupant'),
        isPointOfContact: person.role === 'point-of-contact',
        assignToFacility: assignedFacility?._id || 'no-facility',
        assignToMicrosite: 'no-microsite',
        profilePicture: null,
        qualifications: null,
      });
    }
  }, [person, appData.facilities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!person) return;

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updatedRole = formData.isPointOfContact ? 'point-of-contact' : formData.role;

      updateUser(person._id, {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: updatedRole,
      });

      // Handle facility assignment changes
      const currentFacility = appData.facilities.find(facility =>
        facility.assignedOccupantIds.includes(person._id),
      );

      // Remove from current facility if assigned
      if (currentFacility) {
        removeOccupantFromFacility(currentFacility._id, person._id);
      }

      // Assign to new facility if selected
      if (formData.assignToFacility && formData.assignToFacility !== 'no-facility') {
        assignOccupantToFacility(formData.assignToFacility, person._id);
      }

      toast({
        title: 'Success',
        description: 'Person updated successfully',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update person',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  // Get current facility's microsites if facility is selected
  const selectedFacility =
    formData.assignToFacility && formData.assignToFacility !== 'no-facility'
      ? appData.facilities.find(f => f._id === formData.assignToFacility)
      : null;

  if (!person) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={value => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupant">Occupant</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPointOfContact"
              checked={formData.isPointOfContact}
              onCheckedChange={checked => handleInputChange('isPointOfContact', checked as boolean)}
            />
            <Label
              htmlFor="isPointOfContact"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Designate as Point of Contact
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignToFacility">Assign to Facility (Optional)</Label>
            <Select
              value={formData.assignToFacility}
              onValueChange={value => {
                handleInputChange('assignToFacility', value);
                // Reset microsite when facility changes
                if (value === 'no-facility') {
                  handleInputChange('assignToMicrosite', 'no-microsite');
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-facility">No facility assignment</SelectItem>
                {appData.facilities.map(facility => (
                  <SelectItem key={facility._id} value={facility._id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFacility &&
            selectedFacility.microsites &&
            selectedFacility.microsites.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="assignToMicrosite">Assign to Microsite (Optional)</Label>
                <Select
                  value={formData.assignToMicrosite}
                  onValueChange={value => handleInputChange('assignToMicrosite', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select microsite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-microsite">No microsite assignment</SelectItem>
                    {selectedFacility.microsites.map(microsite => (
                      <SelectItem key={microsite.id} value={microsite.id}>
                        {microsite.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={e => handleFileChange('profilePicture', e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">Upload Qualifications (Optional)</Label>
            <Input
              id="qualifications"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={e => handleFileChange('qualifications', e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
              Update Person
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
