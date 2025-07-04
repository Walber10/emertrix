
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus } from "lucide-react";

const MaintenanceCompliance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance & Compliance</h1>
        <p className="text-gray-600 mt-2">Track compliance and maintain emergency preparedness</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Compliance Tracking
          </CardTitle>
          <CardDescription>Monitor compliance status and maintenance schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Items</h3>
            <p className="text-gray-600 mb-4">Start by adding compliance tracking items</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceCompliance;
