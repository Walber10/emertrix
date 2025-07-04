
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Phone, Users, Plus, X, Mail, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmertrixLogo } from "@/components/EmertrixLogo";

interface Occupant {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Microsite {
  id: string;
  name: string;
  address: string;
  type: string;
  epcRepresentative: string;
  occupants: string[];
}

interface FacilityFormData {
  facilityName: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  maxOccupancy: string;
  facilityType: string;
  pointOfContact: string;
  pocEmail: string;
  pocPhone: string;
  occupants: Occupant[];
  microsites: Microsite[];
}

const CreateFacility = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appData, addFacility, addUser } = useApp();

  const [formData, setFormData] = useState<FacilityFormData>({
    facilityName: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    maxOccupancy: "",
    facilityType: "",
    pointOfContact: "",
    pocEmail: "",
    pocPhone: "",
    occupants: [],
    microsites: []
  });

  const [newOccupant, setNewOccupant] = useState<Omit<Occupant, 'id'>>({
    name: "",
    email: "",
    phone: ""
  });

  const [newMicrosite, setNewMicrosite] = useState<Omit<Microsite, 'id'>>({
    name: "",
    address: "",
    type: "",
    epcRepresentative: "",
    occupants: []
  });

  const facilityTypes = [
    "Office Building",
    "Warehouse",
    "Manufacturing Plant", 
    "Retail Store",
    "Healthcare Facility",
    "Educational Institution",
    "Industrial Facility",
    "Mixed Use Building",
    "Other"
  ];

  const updateFormData = (field: keyof FacilityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNewOccupant = (field: keyof Omit<Occupant, 'id'>, value: string) => {
    setNewOccupant(prev => ({ ...prev, [field]: value }));
  };

  const updateNewMicrosite = (field: keyof Omit<Microsite, 'id'>, value: string) => {
    setNewMicrosite(prev => ({ ...prev, [field]: value }));
  };

  const addOccupant = () => {
    if (!newOccupant.name || !newOccupant.email || !newOccupant.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all occupant details",
        variant: "destructive"
      });
      return;
    }

    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      occupants: [...prev.occupants, { id: newId, ...newOccupant }]
    }));
    setNewOccupant({ name: "", email: "", phone: "" });
  };

  const removeOccupant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      occupants: prev.occupants.filter(occupant => occupant.id !== id)
    }));
  };

  const addMicrosite = () => {
    if (!newMicrosite.name || !newMicrosite.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all microsite details",
        variant: "destructive"
      });
      return;
    }

    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      microsites: [...prev.microsites, { id: newId, ...newMicrosite }]
    }));
    setNewMicrosite({ name: "", address: "", type: "", epcRepresentative: "", occupants: [] });
  };

  const removeMicrosite = (id: string) => {
    setFormData(prev => ({
      ...prev,
      microsites: prev.microsites.filter(microsite => microsite.id !== id)
    }));
  };

  const validateForm = () => {
    if (!formData.facilityName || !formData.address || !formData.city || !formData.state || !formData.postcode || !formData.phone || !formData.maxOccupancy || !formData.facilityType || !formData.pointOfContact || !formData.pocEmail || !formData.pocPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Create Point of Contact
      const poc = addUser({
        organizationId: appData.organization?._id || '',
        name: formData.pointOfContact,
        email: formData.pocEmail,
        phone: formData.pocPhone,
        role: 'point-of-contact',
        facilityIds: []
      });

      // Create Occupants
      const occupantIds = formData.occupants.map(occupant => {
        const user = addUser({
          organizationId: appData.organization?._id || '',
          name: occupant.name,
          email: occupant.email,
          phone: occupant.phone,
          role: 'occupant',
          facilityIds: []
        });
        return user._id;
      });

      // Create the facility
      const facilityData = {
        organizationId: appData.organization?._id || '',
        name: formData.facilityName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        phoneNumber: formData.phone,
        maxOccupancy: parseInt(formData.maxOccupancy),
        facilityType: formData.facilityType,
        pointOfContactId: poc._id,
        assignedOccupantIds: occupantIds,
        microsites: formData.microsites.map(ms => ({
          id: ms.id,
          name: ms.name,
          address: ms.address,
          type: ms.type || '',
          epcRepresentative: ms.epcRepresentative || '',
          occupants: ms.occupants || []
        }))
      };

      const facility = addFacility(facilityData);

      toast({
        title: "Facility Created",
        description: `${facility.name} has been created successfully`,
        duration: 3000
      });
      navigate("/organization-dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create facility",
        variant: "destructive"
      });
    }
  };

  const handleSkipForNow = () => {
    navigate("/organization-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <EmertrixLogo size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Facility</h1>
          <p className="text-gray-600 text-lg">Add a new facility to your organization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white shadow-sm border-l-4 border-l-emertrix-orange">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 text-emertrix-orange" />
                Facility Details
              </CardTitle>
              <CardDescription className="text-base">Enter details for your facility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic facility information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName" className="text-left block flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-emertrix-orange" />
                    <span>Name *</span>
                  </Label>
                  <Input
                    id="facilityName"
                    value={formData.facilityName}
                    onChange={(e) => updateFormData("facilityName", e.target.value)}
                    placeholder="Enter facility name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-left block flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-emertrix-orange" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-left block flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-emertrix-orange" />
                    <span>Address *</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Enter facility address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-left block">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-left block">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode" className="text-left block">Postcode *</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => updateFormData("postcode", e.target.value)}
                    placeholder="Postcode"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOccupancy" className="text-left block">Max Occupancy *</Label>
                  <Input
                    id="maxOccupancy"
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => updateFormData("maxOccupancy", e.target.value)}
                    placeholder="Max Occupancy"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="facilityType" className="text-left block">Type *</Label>
                  <Select 
                    value={formData.facilityType}
                    onValueChange={(value) => updateFormData("facilityType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Point of Contact Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-emertrix-orange" />
                  Point of Contact *
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointOfContact" className="text-left block">Name *</Label>
                    <Input
                      id="pointOfContact"
                      value={formData.pointOfContact}
                      onChange={(e) => updateFormData("pointOfContact", e.target.value)}
                      placeholder="Point of Contact Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pocEmail" className="text-left block flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-emertrix-orange" />
                      <span>Email *</span>
                    </Label>
                    <Input
                      id="pocEmail"
                      type="email"
                      value={formData.pocEmail}
                      onChange={(e) => updateFormData("pocEmail", e.target.value)}
                      placeholder="Point of Contact Email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pocPhone" className="text-left block flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-emertrix-orange" />
                      <span>Phone *</span>
                    </Label>
                    <Input
                      id="pocPhone"
                      value={formData.pocPhone}
                      onChange={(e) => updateFormData("pocPhone", e.target.value)}
                      placeholder="Point of Contact Phone"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Occupants Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-emertrix-orange" />
                      Occupants (Optional)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Add occupants to this facility
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="occupantName" className="text-left block">Name</Label>
                      <Input
                        id="occupantName"
                        value={newOccupant.name}
                        onChange={(e) => updateNewOccupant("name", e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupantEmail" className="text-left block">Email</Label>
                      <Input
                        id="occupantEmail"
                        type="email"
                        value={newOccupant.email}
                        onChange={(e) => updateNewOccupant("email", e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupantPhone" className="text-left block">Phone</Label>
                      <Input
                        id="occupantPhone"
                        value={newOccupant.phone}
                        onChange={(e) => updateNewOccupant("phone", e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addOccupant} 
                    variant="outline"
                    className="border-emertrix-orange text-emertrix-orange hover:bg-emertrix-orange hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Occupant
                  </Button>
                </div>

                {formData.occupants.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {formData.occupants.map(occupant => (
                      <Card key={occupant.id} className="bg-gray-50">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{occupant.name}</h5>
                              <p className="text-sm text-gray-600">{occupant.email}</p>
                              <p className="text-sm text-gray-500">{occupant.phone}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOccupant(occupant.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {formData.occupants.length === 0 && (
                  <div className="text-center py-4 border-2 border-dashed border-emertrix-orange/30 rounded-lg bg-orange-50/50 mt-4">
                    <Users className="h-6 w-6 text-emertrix-orange/60 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No occupants added</p>
                  </div>
                )}
              </div>

              {/* Microsites Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emertrix-orange" />
                      Microsites (Optional)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Add sub-sites within this facility
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="micrositeName" className="text-left block">Name</Label>
                      <Input
                        id="micrositeName"
                        value={newMicrosite.name}
                        onChange={(e) => updateNewMicrosite("name", e.target.value)}
                        placeholder="Microsite name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="micrositeAddress" className="text-left block">Address</Label>
                      <Input
                        id="micrositeAddress"
                        value={newMicrosite.address}
                        onChange={(e) => updateNewMicrosite("address", e.target.value)}
                        placeholder="Microsite address"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addMicrosite} 
                    variant="outline"
                    className="border-emertrix-orange text-emertrix-orange hover:bg-emertrix-orange hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Microsite
                  </Button>
                </div>

                {formData.microsites.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {formData.microsites.map(microsite => (
                      <Card key={microsite.id} className="bg-gray-50">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{microsite.name}</h5>
                              <p className="text-sm text-gray-600">{microsite.address}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMicrosite(microsite.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {formData.microsites.length === 0 && (
                  <div className="text-center py-4 border-2 border-dashed border-emertrix-orange/30 rounded-lg bg-orange-50/50 mt-4">
                    <MapPin className="h-6 w-6 text-emertrix-orange/60 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No microsites added</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t bg-white px-6 py-4 rounded-lg shadow-sm">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSkipForNow}
            >
              Skip for now
            </Button>
            <Button 
              type="submit"
              className="bg-emertrix-gradient hover:opacity-90 text-white"
              size="lg"
            >
              Create Facility
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFacility;
