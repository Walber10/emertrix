import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CreateExercise = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const { addExercise, getFacilityById, getUsersByRole, getEmergencyPlanByFacilityId, appData } =
    useApp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    exerciseType: '',
    objectives: '',
    selectedProcedureId: '',
    proposedDate: undefined as Date | undefined,
    proposedTime: '',
    location: '',
    coordinator: '',
  });

  const facility = getFacilityById(facilityId || '');
  const availableUsers = getUsersByRole('occupant').concat(getUsersByRole('point-of-contact'));

  // Get emergency procedures from the facility's emergency plan
  const emergencyPlan = getEmergencyPlanByFacilityId(facilityId || '');
  const emergencyProcedures =
    emergencyPlan?.procedureIds
      ?.map(procedureId => {
        const procedure = appData.emergencyProcedures.find(p => p._id === procedureId);
        return procedure ? { id: procedure._id, title: procedure.title } : null;
      })
      .filter(Boolean) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.exerciseType ||
      !formData.selectedProcedureId ||
      !formData.proposedDate ||
      !formData.proposedTime ||
      !formData.location ||
      !formData.coordinator
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields including the emergency procedure.',
        variant: 'destructive',
      });
      return;
    }

    try {
      addExercise({
        exerciseType: formData.exerciseType,
        objectives: formData.objectives,
        selectedProcedureId: formData.selectedProcedureId,
        proposedDate: formData.proposedDate,
        proposedTime: formData.proposedTime,
        location: formData.location,
        coordinator: formData.coordinator,
        status: 'scheduled',
        facilityId: facilityId || '',
      });

      toast({
        title: 'Exercise Created Successfully',
        description:
          'The emergency exercise has been scheduled and will appear in upcoming exercises.',
      });

      navigate(`/facility/${facilityId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create exercise. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!facility) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Facility not found</p>
            <Button onClick={() => navigate('/organization-dashboard')} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5" />
            Create New Exercise
          </CardTitle>
          <p className="text-sm text-gray-600">
            Schedule an emergency drill or exercise for {facility?.name}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="exerciseType" className="text-sm font-medium">
                Exercise Type *
              </Label>
              <Input
                id="exerciseType"
                value={formData.exerciseType}
                onChange={e => setFormData(prev => ({ ...prev, exerciseType: e.target.value }))}
                placeholder='e.g. "Fire Drill", "Evacuation Exercise"'
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Suggested: Fire Drill, Evacuation Exercise, Medical Emergency Drill, Lockdown
                Exercise, Severe Weather Response, Bomb Threat Response
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives" className="text-sm font-medium">
                Exercise Objectives (Optional)
              </Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={e => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                placeholder='e.g. "Test evacuation procedures for night shift with minimal staff"'
                rows={3}
                className="w-full resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Emergency Procedure *</Label>
              <Select
                value={formData.selectedProcedureId}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, selectedProcedureId: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      emergencyProcedures.length > 0
                        ? 'Choose from existing procedures to indicate which one is being tested'
                        : 'No emergency procedures created yet'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {emergencyProcedures.length > 0 ? (
                    emergencyProcedures.map(procedure => (
                      <SelectItem key={procedure.id} value={procedure.id}>
                        {procedure.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No emergency procedures available - create an emergency plan first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">For future compliance tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Proposed Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.proposedDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.proposedDate ? format(formData.proposedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.proposedDate}
                      onSelect={date => setFormData(prev => ({ ...prev, proposedDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedTime" className="text-sm font-medium">
                  Proposed Time *
                </Label>
                <div className="relative">
                  <Input
                    id="proposedTime"
                    type="time"
                    value={formData.proposedTime}
                    onChange={e => setFormData(prev => ({ ...prev, proposedTime: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Location *</Label>
              <Select
                value={formData.location}
                onValueChange={value => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the relevant facility and/or microsite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={facility.name}>{facility.name} (Main Facility)</SelectItem>
                  {facility.microsites?.map(microsite => (
                    <SelectItem key={microsite.id} value={`${facility.name} - ${microsite.name}`}>
                      {facility.name} - {microsite.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Exercise Coordinator *</Label>
              <Select
                value={formData.coordinator}
                onValueChange={value => setFormData(prev => ({ ...prev, coordinator: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select from existing users responsible for running the drill" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                Create Exercise
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/facility/${facilityId}`)}
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> Once scheduled, the exercise will appear on the facility's
              Individual Facility page as an upcoming exercise, with options to edit, cancel, or
              mark as completed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateExercise;
