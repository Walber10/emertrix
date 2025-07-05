import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Planning System</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive emergency management solution for your facilities. Create compliant
            emergency plans, manage risks, and ensure safety.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/plan-selection')}
            className="text-lg px-8 py-4"
          >
            Get Started
          </Button>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Emergency Planning</h3>
              <p className="text-gray-600">
                Create comprehensive emergency plans with risk assessments and procedures
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Set up Emergency Planning Committees and Emergency Control Organizations
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance</h3>
              <p className="text-gray-600">
                Maintain compliance with training, exercises, and regular reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h4 className="font-medium mb-2">Choose Plan</h4>
              <p className="text-sm text-gray-600">Select the right plan for your organization</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h4 className="font-medium mb-2">Setup Account</h4>
              <p className="text-sm text-gray-600">Create your organization profile</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h4 className="font-medium mb-2">Add Facilities</h4>
              <p className="text-sm text-gray-600">Configure your facilities and structures</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                4
              </div>
              <h4 className="font-medium mb-2">Manage Safety</h4>
              <p className="text-sm text-gray-600">
                Create plans, train teams, maintain compliance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
