import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MapPin, Plus, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const { appData, canCreateMoreFacilities, getTotalSeats, getUsedSeats, getMaxFacilities } =
    useAppContext();

  const handleCreateFacility = () => {
    navigate('/create-facility');
  };

  const handleViewFacility = (facilityId: string) => {
    navigate(`/facility/${facilityId}`);
  };

  const handleManagePeople = () => {
    navigate('/people');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome to {appData.organization?.name || 'your organization'}
              </p>
            </div>
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appData.facilities.length}/{getMaxFacilities()}
              </div>
              <p className="text-xs text-muted-foreground">
                {getMaxFacilities() - appData.facilities.length} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appData.users.length}</div>
              <p className="text-xs text-muted-foreground">Across all facilities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getUsedSeats()}/{getTotalSeats()} used
              </div>
              <p className="text-xs text-muted-foreground">
                {getTotalSeats() - getUsedSeats()} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Plans</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appData.emergencyPlans.length}</div>
              <p className="text-xs text-muted-foreground">Active plans</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleCreateFacility}
                disabled={!canCreateMoreFacilities()}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Plus className="h-6 w-6 mb-2" />
                Add New Facility
              </Button>
              <Button
                onClick={handleManagePeople}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="h-6 w-6 mb-2" />
                Manage People
              </Button>
              <Button
                onClick={() => navigate('/training')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                Training & Exercises
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Facilities List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>Manage your organization's facilities</CardDescription>
            </div>
            {canCreateMoreFacilities() && (
              <Button onClick={handleCreateFacility} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {appData.facilities.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first facility</p>
                <Button onClick={handleCreateFacility} disabled={!canCreateMoreFacilities()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Facility
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appData.facilities.map(facility => (
                  <Card
                    key={facility._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {facility.address}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {facility.assignedOccupantIds.length} occupants
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewFacility(facility._id)}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
