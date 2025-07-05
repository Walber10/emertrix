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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, ClipboardCheck, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ExerciseReview = () => {
  const navigate = useNavigate();
  const { facilityId, exerciseId } = useParams();
  const {
    appData,
    addExerciseReview,
    updateExercise,
    getExercisesByFacility,
    getFacilityById,
    getUserById,
  } = useApp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    completed: false,
    dateCompleted: undefined as Date | undefined,
    participants: [] as string[],
    reviewer: '',
    observations: '',
    emailSummaryTo: '',
  });

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  const facility = getFacilityById(facilityId || '');
  const exercises = getExercisesByFacility(facilityId || '');
  const exercise = exercises.find(ex => ex._id === exerciseId);
  const facilityOccupants =
    facility?.assignedOccupantIds.map(id => getUserById(id)).filter(Boolean) || [];

  const handleParticipantToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reviewer || !formData.observations) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.completed && !formData.dateCompleted) {
      toast({
        title: 'Missing Date',
        description: 'Please select the date when the exercise was completed.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Add the exercise review
      addExerciseReview({
        exerciseId: exerciseId || '',
        completed: formData.completed,
        dateCompleted: formData.dateCompleted,
        participants: formData.participants,
        reviewer: formData.reviewer,
        observations: formData.observations,
        emailSummaryTo: formData.emailSummaryTo,
      });

      // Update exercise status if completed
      if (formData.completed && exerciseId && exercise) {
        updateExercise({ ...exercise, status: 'completed' });
      }

      toast({
        title: 'Exercise Review Saved',
        description: formData.completed
          ? 'Exercise marked as completed and review saved successfully.'
          : 'Exercise review saved successfully.',
      });

      navigate(`/facility/${facilityId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save exercise review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!facility || !exercise) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Exercise or facility not found</p>
            <Button onClick={() => navigate('/organization-dashboard')} className="mt-4">
              Return to Dashboard
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
            <ClipboardCheck className="h-5 w-5" />
            Exercise Review
          </CardTitle>
          <p className="text-sm text-gray-600">
            Review and complete: {exercise.exerciseType} - {format(exercise.proposedDate, 'PPP')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Exercise Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {exercise.exerciseType}
              </div>
              <div>
                <span className="font-medium">Coordinator:</span> {exercise.coordinator}
              </div>
              <div>
                <span className="font-medium">Location:</span> {exercise.location}
              </div>
              <div>
                <span className="font-medium">Scheduled:</span>{' '}
                {format(exercise.proposedDate, 'PPP')} at {exercise.proposedTime}
              </div>
              {exercise.objectives && (
                <div className="md:col-span-2">
                  <span className="font-medium">Objectives:</span> {exercise.objectives}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, completed: checked as boolean }))
                }
              />
              <Label htmlFor="completed" className="font-medium">
                Exercise Completed (Yes / No - If No: Prompt user to provide a reason)
              </Label>
            </div>

            {formData.completed && (
              <div className="space-y-2">
                <Label>Date Completed *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.dateCompleted && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateCompleted
                        ? format(formData.dateCompleted, 'PPP')
                        : 'When the exercise actually took place'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateCompleted}
                      onSelect={date => setFormData(prev => ({ ...prev, dateCompleted: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Participants (Select from existing occupants & free text option to add
                non-occupants)
              </Label>
              <Card className="p-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {facilityOccupants.map(user => (
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
                Selected: {formData.participants.length} participant(s) | Add contractors,
                observers, etc. below
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewer">Exercise Reviewer *</Label>
              <Select
                value={formData.reviewer}
                onValueChange={value => setFormData(prev => ({ ...prev, reviewer: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select from occupant list or enter an external reviewer's name" />
                </SelectTrigger>
                <SelectContent>
                  {facilityOccupants.map(user => (
                    <SelectItem key={user._id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations / Lessons Learnt *</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={e => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Document key findings, performance issues, or improvement opportunities"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSummaryTo">Email Summary To (Optional)</Label>
              <Input
                id="emailSummaryTo"
                type="email"
                value={formData.emailSummaryTo}
                onChange={e => setFormData(prev => ({ ...prev, emailSummaryTo: e.target.value }))}
                placeholder="Enter one or more email addresses to send a copy of the review summary"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Save Exercise Review
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
                <strong>Note:</strong> Upon saving and marking the exercise complete, the exercise
                should be removed from the upcoming exercises list but be stored in a "completed
                exercises" list and the facility page. The exercise record should include the
                information captured in the exercise review. A summary of the exercises review
                inputs should also be emailed to all EPC members for that facility if possible.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseReview;
