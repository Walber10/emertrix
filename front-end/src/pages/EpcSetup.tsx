
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EpcSetup = () => {
  const navigate = useNavigate();
  
  // Simulate no facility created yet - in real app this would come from state/API
  const hasFacility = false;

  if (!hasFacility) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EPC Setup</h1>
          <p className="text-gray-600 mt-2">Emergency Planning Committee Configuration</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facility Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a facility first before setting up the Emergency Planning Committee.
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
        <h1 className="text-3xl font-bold text-gray-900">EPC Setup</h1>
        <p className="text-gray-600 mt-2">Emergency Planning Committee Configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emergency Planning Committee (EPC)
          </CardTitle>
          <CardDescription>
            Responsible for overseeing emergency management activities and ensuring all components are developed, maintained, and reviewed as required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No EPC Members Added</h3>
            <p className="text-gray-600 mb-4">Start by adding members to your Emergency Planning Committee</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add EPC Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EpcSetup;
