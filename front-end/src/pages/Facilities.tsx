import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, MapPin, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';

const Facilities = () => {
  const navigate = useNavigate();
  const { appData, hasCompleted } = useApp();

  useEffect(() => {
    if (!hasCompleted('plan-selection') || !hasCompleted('account-setup')) {
      navigate('/account-setup');
      return;
    }
  }, [hasCompleted, navigate]);

  const { facilities } = appData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Setup Required':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 80) return 'text-green-600';
    if (compliance >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const EmptyFacilitiesState = () => (
    <Card className="text-center py-16">
      <CardContent>
        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Facilities Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start managing your emergency preparedness by adding your first facility. You can set up
          emergency plans, assign people, and track compliance.
        </p>
        <Button
          onClick={() => navigate('/create-facility')}
          size="lg"
          className="flex items-center gap-2 mx-auto"
        >
          <Plus className="h-5 w-5" />
          Add Your First Facility
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
          <p className="text-gray-600 mt-2">
            Manage your organization's facilities and emergency plans
          </p>
        </div>
        {facilities.length > 0 && (
          <Button onClick={() => navigate('/create-facility')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Facility
          </Button>
        )}
      </div>

      {facilities.length === 0 ? (
        <EmptyFacilitiesState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map(facility => {
            const currentOccupancy = facility.assignedOccupantIds.length;
            const maxOccupancy = facility.maxOccupancy || 0;
            const status = 'Setup Required';

            return (
              <Card
                key={facility._id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => navigate(`/facility/${facility._id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-blue-600">{facility.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {facility.address}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                    >
                      {status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Occupancy</div>
                      <div className="font-semibold">
                        {currentOccupancy}/{maxOccupancy}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Emergency Plans</div>
                      <div className="font-semibold">0</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Risk Assessments</div>
                      <div className="font-semibold">0</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Compliance</div>
                      <div className={`font-bold ${getComplianceColor(0)}`}>0%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Facilities;
