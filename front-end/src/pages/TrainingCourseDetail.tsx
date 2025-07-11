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
import { ArrowLeft, BookOpen, Edit } from 'lucide-react';
import { format } from 'date-fns';

const TrainingCourseDetail = () => {
  const navigate = useNavigate();
  const { facilityId, courseId } = useParams();
  const { appData, getTrainingCoursesByFacility, getFacilityById, updateTrainingCourse } = useApp();

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  const facility = getFacilityById(facilityId || '');
  const courses = getTrainingCoursesByFacility(facilityId || '');
  const course = courses.find(c => c._id === courseId);

  if (!facility || !course) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Training course not found</p>
            <Button onClick={() => navigate('/training-overview')} className="mt-4">
              Return to Training Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMarkComplete = () => {
    updateTrainingCourse({ ...course, status: 'completed' });
    navigate('/training-overview');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/training-overview')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Training Overview
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.courseType}</h1>
          <p className="text-gray-600">{appData.organization?.name || 'Your Organization'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/book-training/${facilityId}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleMarkComplete}
            variant="outline"
            disabled={course.status === 'completed'}
          >
            {course.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Course Type:</h3>
              <p className="text-gray-700">{course.courseType}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Start Date:</h3>
              <p className="text-gray-700">
                {course.scheduledDate ? format(course.scheduledDate, 'PPP') : 'Not scheduled'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Course Coordinator:</h3>
              <p className="text-gray-700">{course.organiserName}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status:</h3>
              <p className="text-gray-700 capitalize">{course.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Facility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.participants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                    No participants assigned yet
                  </TableCell>
                </TableRow>
              ) : (
                course.participants.map(participantId => {
                  const participant = appData.users.find(u => u.id === participantId);
                  return participant ? (
                    <TableRow key={participantId}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{facility.name}</TableCell>
                    </TableRow>
                  ) : null;
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingCourseDetail;
