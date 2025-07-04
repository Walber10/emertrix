import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, ShieldAlert, Wrench } from "lucide-react";

const EmergencyComponentsGrid = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Management Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-gray-50"
            onClick={() => navigate(`/facility/${facilityId}/risk-assessment`)}
          >
            <ShieldAlert className="h-6 w-6" />
            Risk Assessment
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-gray-50"
            onClick={() => navigate(`/facility/${facilityId}/emergency-plan`)}
          >
            <BookOpen className="h-6 w-6" />
            Emergency Plan
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-gray-50"
            onClick={() => navigate(`/facility/${facilityId}/training`)}
          >
            <Wrench className="h-6 w-6" />
            Training & Exercises
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyComponentsGrid;
