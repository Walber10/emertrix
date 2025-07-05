import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus } from 'lucide-react';

const TrainingExercises = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Exercises</h1>
        <p className="text-gray-600 mt-2">Manage training programs and emergency exercises</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Training & Exercises
          </CardTitle>
          <CardDescription>Schedule and track emergency training and exercises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Scheduled</h3>
            <p className="text-gray-600 mb-4">Start by scheduling your first training session</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingExercises;
