
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EcoSetup = () => {
  const navigate = useNavigate();
  
  // Simulate no facility created yet - in real app this would come from state/API
  const hasFacility = false;

  if (!hasFacility) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ECO Setup</h1>
          <p className="text-gray-600 mt-2">Emergency Control Organization Configuration</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facility Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a facility first before setting up the Emergency Control Organization.
            </p>
            <Button onClick={() => navigate("/facility-setup")} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Create Your First Facility
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ECO Setup</h1>
        <p className="text-gray-600 mt-2">Emergency Control Organization Configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Emergency Control Organization (ECO)
          </CardTitle>
          <CardDescription>
            The wardens assigned to manage emergency response during an incident. Every facility must have an ECO, structured according to Australian Standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ECO Structure Created</h3>
            <p className="text-gray-600 mb-4">Start by setting up your Emergency Control Organization structure</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Setup ECO Structure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcoSetup;
