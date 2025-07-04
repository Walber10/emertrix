
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, Target } from "lucide-react";
import { format } from "date-fns";

const ExerciseOverview = () => {
  const navigate = useNavigate();
  const { appData, getExercisesByFacility, getFacilityById } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to account setup if no data
  if (!appData.isInitialized || appData.facilities.length === 0) {
    navigate('/account-setup');
    return null;
  }

  // Get organization name from context
  const organizationName = appData.organization?.name || "Your Organization";

  // Get all exercises across all facilities
  const allExercises = appData.facilities.flatMap(facility => 
    getExercisesByFacility(facility._id).map(exercise => ({
      ...exercise,
      facility: facility
    }))
  );

  // Filter exercises based on search
  const filteredExercises = allExercises.filter(exercise =>
    exercise.exerciseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.coordinator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewExercise = (exerciseId: string, facilityId: string) => {
    navigate(`/exercise-detail/${facilityId}/${exerciseId}`);
  };

  const handleCreateExercise = () => {
    // Navigate to create exercise, but we need to select a facility first
    if (appData.facilities.length === 1) {
      navigate(`/create-exercise/${appData.facilities[0]._id}`);
    } else {
      navigate('/exercises'); // Go to main exercises page to select facility
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise Overview</h1>
          <p className="text-gray-600">{organizationName}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCreateExercise}>
            Create New Exercise
          </Button>
          <Button onClick={() => navigate('/exercises')} variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Completed Exercises
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planned Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">[Filter]</Button>
              <Button variant="outline" size="sm">[Sort By]</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise Type</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Microsite (if applicable)</TableHead>
                <TableHead>Proposed Date</TableHead>
                <TableHead>Exercise Coordinator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No exercises scheduled yet
                  </TableCell>
                </TableRow>
              ) : (
                filteredExercises.map((exercise) => (
                  <TableRow key={exercise._id}>
                    <TableCell className="font-medium">{exercise.exerciseType}</TableCell>
                    <TableCell>{exercise.facility.name}</TableCell>
                    <TableCell>
                      {exercise.location.includes(' - ') ? 
                        exercise.location.split(' - ')[1] : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>{format(exercise.proposedDate, "PPP")}</TableCell>
                    <TableCell>{exercise.coordinator}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewExercise(exercise._id, exercise.facility._id)}
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

export default ExerciseOverview;
