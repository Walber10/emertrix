import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TrainingOverview = () => {
  const navigate = useNavigate();
  const { appData, getTrainingCoursesByFacility, getFacilityById, getUserById } = useApp();
  const { onboarding } = useOnboardingState();
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  // Get organization name from context
  const organizationName = onboarding.organization?.name || 'Your Organization';

  // Get all training courses across all facilities
  const allTrainingCourses = appData.facilities.flatMap(facility =>
    getTrainingCoursesByFacility(facility.id).map(course => ({
      ...course,
      facility: facility,
    })),
  );

  // Filter courses based on search
  const filteredCourses = allTrainingCourses.filter(
    course =>
      course.courseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.organiserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.facility.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewCourse = (courseId: string, facilityId: string) => {
    navigate(`/training-course/${facilityId}/${courseId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Overview</h1>
          <p className="text-gray-600">{organizationName}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/training')} variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Book Training
          </Button>
          <Button onClick={() => navigate('/training')} variant="outline">
            View Course Catalogue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scheduled Training</span>
            <Button onClick={() => navigate('/training')} variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Completed Training
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                [Filter]
              </Button>
              <Button variant="outline" size="sm">
                [Sort By]
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Date Started</TableHead>
                <TableHead>Course Coordinator</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No training courses scheduled yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map(course => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{course.courseType}</TableCell>
                    <TableCell>
                      {course.scheduledDate ? format(course.scheduledDate, 'PPP') : 'Not scheduled'}
                    </TableCell>
                    <TableCell>{course.organiserName}</TableCell>
                    <TableCell>{course.facility.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCourse(course._id, course.facility.id)}
                      >
                        View / Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingOverview;
