
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookTraining = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const { appData, addTrainingCourse, getFacilityById, getUsersByRole, getUserById } = useApp();
  const { toast } = useToast();

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  const [formData, setFormData] = useState({
    courseType: '',
    organiserName: '',
    participants: [] as string[]
  });

  const facility = getFacilityById(facilityId || '');
  const availableUsers = getUsersByRole('occupant').concat(getUsersByRole('point-of-contact'));
  const facilityOccupants = facility?.assignedOccupantIds.map(id => getUserById(id)).filter(Boolean) || [];

  const courseTypes = [
    'Fire Safety Training',
    'First Aid Certification',
    'Emergency Evacuation Procedures',
    'Workplace Health & Safety',
    'Manual Handling',
    'Risk Assessment Training'
  ];

  const handleParticipantToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseType || !formData.organiserName || formData.participants.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one participant.",
        variant: "destructive"
      });
      return;
    }

    try {
      addTrainingCourse({
        courseType: formData.courseType,
        organiserName: formData.organiserName,
        participants: formData.participants,
        status: 'scheduled',
        facilityId: facilityId || '',
        organizationId: appData.organization?._id || ''
      });

      toast({
        title: "Training Booked Successfully",
        description: "The training course has been scheduled and participants will be notified.",
      });

      navigate(`/facility/${facilityId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book training course. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!facility) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Facility not found</p>
            <Button onClick={() => navigate('/training-overview')} className="mt-4">
              Return to Training Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/facility/${facilityId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Facility
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Training
          </CardTitle>
          <p className="text-sm text-gray-600">
            Schedule a training course for {facility.name}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type *</Label>
              <Select value={formData.courseType} onValueChange={(value) => setFormData(prev => ({ ...prev, courseType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from available training courses" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organiserName">Organiser Name *</Label>
              <Select value={formData.organiserName} onValueChange={(value) => setFormData(prev => ({ ...prev, organiserName: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from existing users" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user._id} value={user.name}>
                      {user.name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Participants * (Select from existing occupants)</Label>
              <Card className="p-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {facilityOccupants.map((user) => (
                    <div key={user._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={user._id}
                        checked={formData.participants.includes(user._id)}
                        onCheckedChange={() => handleParticipantToggle(user._id)}
                      />
                      <Label htmlFor={user._id} className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        {user.name} - {user.email}
                      </Label>
                    </div>
                  ))}
                </div>
                {facilityOccupants.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No occupants assigned to this facility yet.
                  </p>
                )}
              </Card>
              <p className="text-xs text-gray-500">
                Selected: {formData.participants.length} participant(s)
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Submit Training Request
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/facility/${facilityId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Submitting this form will trigger a notification to Ryan, who will manually enrol the selected participants. 
                The course will appear as "in progress" in your facility dashboard once processing begins.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookTraining;
