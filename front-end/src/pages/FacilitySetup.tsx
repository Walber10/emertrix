import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Building2,
  MapPin,
  Phone,
  Users,
  Plus,
  X,
  Map,
  UserPlus,
  AlertTriangle,
  Crown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { EmertrixLogo } from '@/components/EmertrixLogo';
import MicrositeDialog from '@/components/MicrositeDialog';
import { AddPersonModal } from '@/components/AddPersonModal';

interface Microsite {
  id: string;
  name: string;
  address: string;
  type: string;
  epcRepresentative: string;
  occupants: string[];
}

interface FacilityFormData {
  id: number;
  facilityName: string;
  facilityAddress: string;
  city: string;
  state: string;
  postcode: string;
  facilityPhoneNumber: string;
  facilityType: string;
  facilityPointOfContact: string;
  assignOccupants: string[];
  microsites: Microsite[];
}

const FacilitySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    appData,
    addFacility,
    addUser,
    canCreateMoreFacilities,
    getMaxFacilities,
    getAvailableSeats,
    getTotalSeats,
    getUsedSeats,
    canCreateNewOccupant,
    getUserById,
  } = useApp();
  const { onboarding, getSelectedPlanLimits } = useOnboardingState();
  const { users } = appData;

  const [facilities, setFacilities] = useState<FacilityFormData[]>([
    {
      id: 1,
      facilityName: '',
      facilityAddress: '',
      city: '',
      state: '',
      postcode: '',
      facilityPhoneNumber: '',
      facilityType: '',
      facilityPointOfContact: '',
      assignOccupants: [],
      microsites: [],
    },
  ]);

  const [micrositeDialogOpen, setMicrositeDialogOpen] = useState(false);
  const [currentFacilityId, setCurrentFacilityId] = useState<number | null>(null);
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [currentFacilityForPerson, setCurrentFacilityForPerson] = useState<number | null>(null);

  const facilityTypes = [
    'Office Building',
    'Warehouse',
    'Manufacturing Plant',
    'Retail Store',
    'Healthcare Facility',
    'Educational Institution',
    'Industrial Facility',
    'Mixed Use Building',
    'Other',
  ];

  const allUsers = users.filter(
    user => user.role === 'admin' || user.role === 'point-of-contact' || user.role === 'occupant',
  );

  const planLimits = getSelectedPlanLimits();
  const maxFacilities = planLimits.facilities;
  const canAddMore = facilities.length < maxFacilities;

  const addFacilityForm = () => {
    if (canAddMore) {
      const newId = facilities.length + 1;
      setFacilities([
        ...facilities,
        {
          id: newId,
          facilityName: '',
          facilityAddress: '',
          city: '',
          state: '',
          postcode: '',
          facilityPhoneNumber: '',
          facilityType: '',
          facilityPointOfContact: '',
          assignOccupants: [],
          microsites: [],
        },
      ]);
    }
  };

  const removeFacilityForm = (id: number) => {
    if (facilities.length > 1) {
      setFacilities(facilities.filter(f => f.id !== id));
    }
  };

  const updateFacility = (id: number, field: string, value: string) => {
    setFacilities(facilities.map(f => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const openMicrositeDialog = (facilityId: number) => {
    setCurrentFacilityId(facilityId);
    setMicrositeDialogOpen(true);
  };

  const handleMicrositeSave = (microsite: Microsite) => {
    if (currentFacilityId) {
      setFacilities(
        facilities.map(f =>
          f.id === currentFacilityId
            ? {
                ...f,
                microsites: [...f.microsites, microsite],
              }
            : f,
        ),
      );
    }
  };

  const removeMicrosite = (facilityId: number, micrositeId: string) => {
    setFacilities(
      facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              microsites: f.microsites.filter(m => m.id !== micrositeId),
            }
          : f,
      ),
    );
  };

  const addExistingOccupant = (facilityId: number, userId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (facility && facility.assignOccupants.includes(userId)) {
      toast({
        title: 'User Already Assigned',
        description: 'This user is already assigned to this facility',
        variant: 'destructive',
      });
      return;
    }

    setFacilities(
      facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              assignOccupants: [...f.assignOccupants, userId],
            }
          : f,
      ),
    );
  };

  const openAddPersonModal = (facilityId: number) => {
    if (!canCreateNewOccupant()) {
      toast({
        title: 'No Available Seats',
        description: `You have used all ${getTotalSeats()} available seats. Please upgrade your plan to add more occupants.`,
        variant: 'destructive',
      });
      return;
    }
    setCurrentFacilityForPerson(facilityId);
    setAddPersonModalOpen(true);
  };

  const handlePersonModalClose = () => {
    setAddPersonModalOpen(false);
    setCurrentFacilityForPerson(null);
  };

  const handlePersonAdded = (userId: string) => {
    console.log('Person added callback:', userId, currentFacilityForPerson);
    if (currentFacilityForPerson) {
      // Add the user to the local facility state
      setFacilities(
        facilities.map(f =>
          f.id === currentFacilityForPerson
            ? {
                ...f,
                assignOccupants: [...f.assignOccupants, userId],
              }
            : f,
        ),
      );

      // Show success message
      toast({
        title: 'Success',
        description: 'Occupant has been added to the facility successfully',
      });
    }
  };

  const removeOccupant = (facilityId: number, userId: string) => {
    setFacilities(
      facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              assignOccupants: f.assignOccupants.filter(id => id !== userId),
              facilityPointOfContact:
                f.facilityPointOfContact === userId ? '' : f.facilityPointOfContact,
            }
          : f,
      ),
    );
  };

  const setAsPointOfContact = (facilityId: number, userId: string) => {
    setFacilities(
      facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              facilityPointOfContact: userId,
            }
          : f,
      ),
    );
  };

  const validateFacilities = () => {
    for (const facility of facilities) {
      if (!facility.facilityName || !facility.facilityAddress || !facility.facilityType) {
        toast({
          title: 'Missing Information',
          description: `Please fill in all required fields for ${facility.facilityName || 'facility'}`,
          variant: 'destructive',
        });
        return false;
      }

      const incompleteMicrosites = facility.microsites.filter(m => !m.name || !m.address);
      if (incompleteMicrosites.length > 0) {
        toast({
          title: 'Incomplete Microsites',
          description: `Please complete all microsite details for ${facility.facilityName} or remove incomplete ones`,
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFacilities()) {
      return;
    }

    facilities.forEach(facility => {
      const facilityData = {
        name: facility.facilityName,
        address: facility.facilityAddress,
        city: facility.city,
        state: facility.state,
        postcode: facility.postcode,
        phoneNumber: facility.facilityPhoneNumber,
        email: facility.facilityPhoneNumber, // Using phone as fallback for now
        facilityType: facility.facilityType,
        pointOfContactId: facility.facilityPointOfContact,
        assignedOccupantIds: facility.assignOccupants,
        microsites: facility.microsites,
        organizationId: appData.organization?._id || '',
      };

      addFacility(facilityData);
    });

    const totalMicrosites = facilities.reduce((sum, f) => sum + f.microsites.length, 0);
    const facilityText = facilities.length === 1 ? 'facility' : 'facilities';
    const micrositeText = totalMicrosites === 1 ? 'microsite' : 'microsites';

    toast({
      title: 'Facilities Saved Successfully',
      description: `${facilities.length} ${facilityText} saved${totalMicrosites > 0 ? ` with ${totalMicrosites} total ${micrositeText}` : ''}.`,
    });

    // Navigate to organization dashboard
    navigate('/organization-dashboard');
  };

  const handleSkipForNow = () => {
    // Navigate directly to organization dashboard without saving
    navigate('/organization-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <EmertrixLogo size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Facility</h1>
          <p className="text-gray-600 text-lg">Set up your organization's facility</p>
          <div className="flex justify-center items-center gap-6 mt-4">
            <p className="text-sm text-emertrix-orange font-medium">
              Plan: {onboarding.plan?.tier?.toUpperCase()} - Facilities: {facilities.length}/
              {maxFacilities}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">
                Seats: {getUsedSeats()}/{planLimits.seats} used
              </span>
              {getAvailableSeats() <= 2 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-6">
            {facilities.map((facility, index) => (
              <Card
                key={facility.id}
                className="bg-white shadow-sm border-l-4 border-l-emertrix-orange"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="h-5 w-5 text-emertrix-orange" />
                        Facility Details {facilities.length > 1 ? `(${index + 1})` : ''}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Enter details for your facility
                      </CardDescription>
                    </div>
                    {facilities.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFacilityForm(facility.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic facility information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`facilityName-${facility.id}`}
                        className="text-left block flex items-center space-x-2"
                      >
                        <Building2 className="h-4 w-4 text-emertrix-orange" />
                        <span>Name *</span>
                      </Label>
                      <Input
                        id={`facilityName-${facility.id}`}
                        value={facility.facilityName}
                        onChange={e => updateFacility(facility.id, 'facilityName', e.target.value)}
                        placeholder="Enter facility name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`facilityPhoneNumber-${facility.id}`}
                        className="text-left block flex items-center space-x-2"
                      >
                        <Phone className="h-4 w-4 text-emertrix-orange" />
                        <span>Phone Number</span>
                      </Label>
                      <Input
                        id={`facilityPhoneNumber-${facility.id}`}
                        type="tel"
                        value={facility.facilityPhoneNumber}
                        onChange={e =>
                          updateFacility(facility.id, 'facilityPhoneNumber', e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor={`facilityAddress-${facility.id}`}
                        className="text-left block flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4 text-emertrix-orange" />
                        <span>Address *</span>
                      </Label>
                      <Input
                        id={`facilityAddress-${facility.id}`}
                        value={facility.facilityAddress}
                        onChange={e =>
                          updateFacility(facility.id, 'facilityAddress', e.target.value)
                        }
                        placeholder="Enter facility address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`city-${facility.id}`} className="text-left block">
                        City
                      </Label>
                      <Input
                        id={`city-${facility.id}`}
                        value={facility.city}
                        onChange={e => updateFacility(facility.id, 'city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`state-${facility.id}`} className="text-left block">
                        State
                      </Label>
                      <Input
                        id={`state-${facility.id}`}
                        value={facility.state}
                        onChange={e => updateFacility(facility.id, 'state', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`postcode-${facility.id}`} className="text-left block">
                        Postcode
                      </Label>
                      <Input
                        id={`postcode-${facility.id}`}
                        value={facility.postcode}
                        onChange={e => updateFacility(facility.id, 'postcode', e.target.value)}
                        placeholder="Postcode"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`facilityType-${facility.id}`} className="text-left block">
                        Type *
                      </Label>
                      <Select
                        value={facility.facilityType}
                        onValueChange={value => updateFacility(facility.id, 'facilityType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilityTypes.map(type => (
                            <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Microsites Section */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Map className="h-4 w-4 text-emertrix-orange" />
                          Microsites (Optional)
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Add sub-sites within this facility with their own occupants and EPC
                          representatives
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openMicrositeDialog(facility.id)}
                        className="border-emertrix-orange text-emertrix-orange hover:bg-emertrix-orange hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Microsite
                      </Button>
                    </div>

                    {facility.microsites.length > 0 && (
                      <div className="space-y-3">
                        {facility.microsites.map(microsite => (
                          <Card key={microsite.id} className="bg-gray-50">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="font-medium">{microsite.name}</h5>
                                  <p className="text-sm text-gray-600">{microsite.address}</p>
                                  <p className="text-sm text-gray-500">
                                    Type:{' '}
                                    {microsite.type
                                      .replace('-', ' ')
                                      .replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  {microsite.epcRepresentative && (
                                    <p className="text-sm text-emertrix-orange">
                                      EPC Rep: {getUserById(microsite.epcRepresentative)?.name}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500">
                                    Occupants: {microsite.occupants.length}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMicrosite(facility.id, microsite.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {facility.microsites.length === 0 && (
                      <div className="text-center py-4 border-2 border-dashed border-emertrix-orange/30 rounded-lg bg-orange-50/50">
                        <Map className="h-6 w-6 text-emertrix-orange/60 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No microsites added</p>
                      </div>
                    )}
                  </div>

                  {/* Assign Occupants Section - Updated to show orange icon for POC */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4 text-emertrix-orange" />
                          Assign Occupants (Optional)
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Add occupants and designate a point of contact
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select onValueChange={userId => addExistingOccupant(facility.id, userId)}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Add Existing" />
                          </SelectTrigger>
                          <SelectContent>
                            {allUsers.map(user => (
                              <SelectItem
                                key={user._id}
                                value={user._id}
                                disabled={facility.assignOccupants.includes(user._id)}
                              >
                                {user.name} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openAddPersonModal(facility.id)}
                          disabled={!canCreateNewOccupant()}
                          className="border-emertrix-orange text-emertrix-orange hover:bg-emertrix-orange hover:text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New
                        </Button>
                      </div>
                    </div>

                    {!canCreateNewOccupant() && (
                      <p className="text-sm text-orange-600 flex items-center gap-1 mb-4">
                        <AlertTriangle className="h-3 w-3" />
                        No available seats to create new occupants
                      </p>
                    )}

                    {facility.assignOccupants.length > 0 && (
                      <div className="space-y-3">
                        {facility.assignOccupants.map(userId => {
                          const user = getUserById(userId);
                          const isPointOfContact = user?.role === 'point-of-contact';
                          return (
                            <Card key={userId} className="bg-gray-50">
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h5 className="font-medium flex items-center gap-2">
                                      {user?.name || 'Unknown User'}
                                      {isPointOfContact && (
                                        <Crown className="h-4 w-4 text-emertrix-orange" />
                                      )}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {user?.email} • {user?.role}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOccupant(facility.id, userId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {facility.assignOccupants.length === 0 && (
                      <div className="text-center py-4 border-2 border-dashed border-emertrix-orange/30 rounded-lg bg-orange-50/50">
                        <Users className="h-6 w-6 text-emertrix-orange/60 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No occupants assigned</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Facility Button */}
            {canAddMore && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFacilityForm}
                  className="flex items-center gap-2 border-emertrix-orange text-emertrix-orange hover:bg-emertrix-orange hover:text-white"
                  size="lg"
                >
                  <Plus className="h-5 w-5" />
                  Add Facility ({facilities.length}/{maxFacilities})
                </Button>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex justify-between items-center pt-8 border-t bg-white px-6 py-4 rounded-lg shadow-sm">
              <Button type="button" variant="outline" onClick={handleSkipForNow}>
                Skip for now
              </Button>
              <Button
                type="submit"
                className="bg-emertrix-gradient hover:opacity-90 text-white"
                size="lg"
              >
                Save {facilities.length} {facilities.length === 1 ? 'Facility' : 'Facilities'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Microsite Dialog */}
      <MicrositeDialog
        open={micrositeDialogOpen}
        onOpenChange={setMicrositeDialogOpen}
        onSave={handleMicrositeSave}
        facilityId={currentFacilityId || 0}
        existingOccupants={
          currentFacilityId
            ? facilities.find(f => f.id === currentFacilityId)?.assignOccupants || []
            : []
        }
      />

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={addPersonModalOpen}
        onClose={handlePersonModalClose}
        onPersonAdded={handlePersonAdded}
        hideAssignToFacility={true}
      />
    </div>
  );
};

export default FacilitySetup;
