import { Building2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import FacilityHeader from '@/components/facility/FacilityHeader';
import FacilityInfoCard from '@/components/facility/FacilityInfoCard';
import ComplianceStatusCard from '@/components/facility/ComplianceStatusCard';
import QuickActionsCard from '@/components/facility/QuickActionsCard';
import EmergencyPlanSection from '@/components/facility/EmergencyPlanSection';
import EmergencyComponentsGrid from '@/components/facility/EmergencyComponentsGrid';
import PeopleOccupantsSection from '@/components/facility/PeopleOccupantsSection';

const FacilityDashboard = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const { appData, getUserById, removeOccupantFromFacility } = useApp();

  useEffect(() => {
    if (!appData.isInitialized || !appData.organization || appData.planLimits.seats === 0) {
      navigate('/account-setup');
      return;
    }
  }, [appData.isInitialized, appData.organization, appData.planLimits.seats, navigate]);

  const facility = appData.facilities.find(f => f.id === facilityId);

  if (!facility) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/organization-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organization
          </Button>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Facility Not Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              The requested facility could not be found or you don't have access to it.
            </p>
            <Button
              onClick={() => navigate('/organization-dashboard')}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Organization Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignedOccupants = facility.assignedOccupantIds
    .map(userId => getUserById(userId))
    .filter(Boolean);

  const occupantCount = assignedOccupants.length;

  const metrics = {
    currentOccupancy: occupantCount,
    compliancePercentage: 75,
  };

  const handleRemoveOccupant = (userId: string) => {
    removeOccupantFromFacility(facility.id, userId);
  };

  return (
    <div className="p-6 space-y-6">
      <FacilityHeader
        facilityName={facility.name}
        facilityAddress={facility.address}
        facilityEmail={facility.email}
        facilityPhone={facility.phoneNumber}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FacilityInfoCard facilityType={facility.facilityType} occupantCount={occupantCount} />
        <ComplianceStatusCard compliancePercentage={metrics.compliancePercentage} />
        <QuickActionsCard />
      </div>

      <EmergencyPlanSection />

      <EmergencyComponentsGrid />

      <PeopleOccupantsSection
        assignedOccupants={assignedOccupants}
        occupantCount={occupantCount}
        onRemoveOccupant={handleRemoveOccupant}
      />
    </div>
  );
};

export default FacilityDashboard;
