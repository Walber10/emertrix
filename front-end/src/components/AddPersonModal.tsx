import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useParams } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFacilityId?: string;
  onPersonAdded?: (userId: string) => void;
  hideAssignToFacility?: boolean;
}

export const AddPersonModal = ({
  isOpen,
  onClose,
  defaultFacilityId,
  onPersonAdded,
  hideAssignToFacility = false,
}: AddPersonModalProps) => {
  const { addUser, assignOccupantToFacility, appData } = useApp();
  const { toast } = useToast();
  const { id: urlFacilityId } = useParams();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'occupant' as 'admin' | 'point-of-contact' | 'occupant',
    isPointOfContact: false,
    assignToFacility: defaultFacilityId || urlFacilityId || 'no-facility',
    assignToMicrosite: 'no-microsite',
    profilePicture: null as File | null,
    qualifications: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Determine the final role based on checkbox
      const finalRole = formData.isPointOfContact ? 'point-of-contact' : formData.role;

      const newUser = addUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: finalRole,
        organizationId: appData.organization?._id || '',
        facilityIds: [],
      });

      // If facility is selected or hideAssignToFacility is true (auto-assign), assign the user to it
      const facilityToAssign = hideAssignToFacility
        ? defaultFacilityId || urlFacilityId
        : formData.assignToFacility;

      if (facilityToAssign && facilityToAssign !== 'no-facility') {
        assignOccupantToFacility(facilityToAssign, newUser._id);
      }

      // Always call the callback to notify parent component
      if (onPersonAdded) {
        onPersonAdded(newUser._id);
      }

      toast({
        title: 'Success',
        description: `${formData.firstName} ${formData.lastName} has been added successfully`,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'occupant',
        isPointOfContact: false,
        assignToFacility: defaultFacilityId || urlFacilityId || 'no-facility',
        assignToMicrosite: 'no-microsite',
        profilePicture: null,
        qualifications: null,
      });

      onClose();
    } catch (error) {
      console.error('Error adding person:', error);
      toast({
        title: 'Error',
        description: 'Failed to add person',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Occupant</DialogTitle>
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

          {!hideAssignToFacility && (
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
          )}

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

          {/* What happens next section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">What happens next:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• User profile will be created and assigned to a seat</li>
              <li>• Registration email will be sent for login access</li>
              {formData.isPointOfContact && (
                <li>• User will be designated as point of contact for emergency coordination</li>
              )}
              {hideAssignToFacility && (
                <li>• Occupant will be automatically assigned to this facility</li>
              )}
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
              Add Occupant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
