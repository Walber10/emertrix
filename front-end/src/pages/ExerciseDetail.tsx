import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Shield, Edit } from 'lucide-react';
import { format } from 'date-fns';

const ExerciseDetail = () => {
  const navigate = useNavigate();
  const { facilityId, exerciseId } = useParams();
  const { appData, getExercisesByFacility, getFacilityById, getExerciseReviewByExerciseId } =
    useApp();

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  const facility = getFacilityById(facilityId || '');
  const exercises = getExercisesByFacility(facilityId || '');
  const exercise = exercises.find(ex => ex._id === exerciseId);
  const exerciseReview = getExerciseReviewByExerciseId(exerciseId || '');

  if (!facility || !exercise) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Exercise not found</p>
            <Button onClick={() => navigate('/exercise-overview')} className="mt-4">
              Return to Exercise Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/exercise-overview')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exercise Overview
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            EXERCISE
            <span className="text-gray-500 text-lg">#{exercise._id}</span>
          </h1>
          <p className="text-gray-600">{appData.organization?.name || 'Your Organization'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/create-exercise/${facilityId}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => navigate(`/exercise-review/${facilityId}/${exerciseId}`)}
            variant="outline"
          >
            Complete Exercise
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Exercise Type:</h3>
              <p className="text-gray-700">{exercise.exerciseType}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Location:</h3>
              <p className="text-gray-700">{exercise.location}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Proposed Date:</h3>
              <p className="text-gray-700">{format(exercise.proposedDate, 'PPP')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Proposed Time:</h3>
              <p className="text-gray-700">{exercise.proposedTime}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Exercise Coordinator:</h3>
              <p className="text-gray-700">{exercise.coordinator}</p>
            </div>
            {exercise.objectives && (
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Objectives:</h3>
                <p className="text-gray-700">{exercise.objectives}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {exerciseReview && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Completion Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Date Completed:</h3>
                <p className="text-gray-700">
                  {exerciseReview.dateCompleted
                    ? format(exerciseReview.dateCompleted, 'PPP')
                    : 'Not completed'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Reviewer:</h3>
                <p className="text-gray-700">{exerciseReview.reviewer}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Observations/Lessons Learnt:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{exerciseReview.observations}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Participants</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exerciseReview.participants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                        No participants recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    exerciseReview.participants.map(participantId => {
                      const participant = appData.users.find(u => u._id === participantId);
                      return participant ? (
                        <TableRow key={participantId}>
                          <TableCell>{participant.name}</TableCell>
                          <TableCell>{participant.role}</TableCell>
                        </TableRow>
                      ) : null;
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseDetail;
