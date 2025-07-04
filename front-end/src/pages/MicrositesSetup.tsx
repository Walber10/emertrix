import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const MicrositesSetup = () => {
  const navigate = useNavigate();
  const { appData } = useApp();
  const hasFacility = appData.facilities.length > 0;

  if (!hasFacility) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Microsites Setup</h1>
          <p className="text-gray-600 mt-2">Configure sub-sites within your facility</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facility Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a facility first before setting up microsites.
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
        <h1 className="text-3xl font-bold text-gray-900">Microsites Setup</h1>
        <p className="text-gray-600 mt-2">Configure sub-sites within your facility</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Microsites Configuration
          </CardTitle>
          <CardDescription>
            Microsites are sub-sites within your facility (e.g., home office under daycare scheme)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Microsites Created</h3>
            <p className="text-gray-600 mb-4">Start by creating your first microsite</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Microsite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MicrositesSetup;
