import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const EmergencyPlanSection = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            No emergency plan has been set up for this facility yet.
          </p>
          <Button
            onClick={() => navigate(`/facility/${facilityId}/emergency-plan-setup`)}
            size="lg"
          >
            Set Up Emergency Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyPlanSection;
