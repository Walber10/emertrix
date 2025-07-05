import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const RiskAssessmentSetup = () => {
  const navigate = useNavigate();
  const { appData } = useApp();
  const hasFacility = appData.facilities.length > 0;

  if (!hasFacility) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Assessment Setup</h1>
          <p className="text-gray-600 mt-2">
            Identify and evaluate potential hazards at your facility
          </p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facility Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a facility first before conducting risk assessments.
            </p>
            <Button
              onClick={() => navigate('/facility-setup')}
              className="flex items-center gap-2 mx-auto"
            >
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
        <h1 className="text-3xl font-bold text-gray-900">Risk Assessment Setup</h1>
        <p className="text-gray-600 mt-2">
          Identify and evaluate potential hazards at your facility
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
          <CardDescription>Configure risk assessment for your facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Assessments Yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first risk assessment</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Risk Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentSetup;
