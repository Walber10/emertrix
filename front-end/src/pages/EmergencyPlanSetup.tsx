
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, AlertTriangle, Users, Building2, Plus, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

const EmergencyPlanSetup = () => {
  const navigate = useNavigate();
  const { appData } = useApp();
  const { facilityId } = useParams();
  
  // Find current facility if we're in facility context
  const facility = facilityId ? appData.facilities.find(f => f._id === facilityId) : null;
  const hasFacility = appData.facilities.length > 0;

  // Dynamic step management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  if (!hasFacility) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/organization-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Plan Setup</h1>
          <p className="text-gray-600 mt-2">Create comprehensive emergency plans for your facility</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facility Created</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a facility first before setting up emergency plans.
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
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(facilityId ? `/facility/${facilityId}` : "/organization-dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {facilityId ? "Facility" : "Dashboard"}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Plan Setup</h1>
        <p className="text-gray-600 mt-2">
          {facility ? `Create emergency plans for ${facility.name}` : "Create comprehensive emergency plans for your facility"}
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Guided Setup Process</CardTitle>
          <CardDescription className="text-blue-700">
            Follow these steps to create compliant emergency documentation with minimal effort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1: Emergency Plan */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${currentStep === 1 ? 'bg-blue-600 text-white' : completedSteps.includes('emergency-plan') ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                completedSteps.includes('emergency-plan') 
                  ? 'bg-green-600 text-white' 
                  : currentStep === 1 
                    ? 'bg-white text-blue-600' 
                    : 'bg-gray-400 text-white'
              }`}>
                {completedSteps.includes('emergency-plan') ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${currentStep === 1 ? 'text-white' : completedSteps.includes('emergency-plan') ? 'text-green-900' : 'text-gray-900'}`}>
                  Emergency Plan
                </h4>
                <p className={`text-sm ${currentStep === 1 ? 'text-blue-100' : completedSteps.includes('emergency-plan') ? 'text-green-700' : 'text-gray-600'}`}>
                  Create your facility's emergency action plan
                </p>
              </div>
              {currentStep === 1 && (
                <Button variant="secondary" size="sm">
                  Current Step
                </Button>
              )}
            </div>

            {/* Step 2: Risk Assessment */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${currentStep === 2 ? 'bg-blue-600 text-white' : completedSteps.includes('risk-assessment') ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                completedSteps.includes('risk-assessment') 
                  ? 'bg-green-600 text-white' 
                  : currentStep === 2 
                    ? 'bg-white text-blue-600' 
                    : 'bg-gray-400 text-white'
              }`}>
                {completedSteps.includes('risk-assessment') ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${currentStep === 2 ? 'text-white' : completedSteps.includes('risk-assessment') ? 'text-green-900' : 'text-gray-900'}`}>
                  Risk Assessment
                </h4>
                <p className={`text-sm ${currentStep === 2 ? 'text-blue-100' : completedSteps.includes('risk-assessment') ? 'text-green-700' : 'text-gray-600'}`}>
                  Identify and evaluate potential hazards
                </p>
              </div>
              {currentStep < 2 && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Complete Step 1 first
                </span>
              )}
            </div>

            {/* Step 3: Emergency Procedures */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${currentStep === 3 ? 'bg-blue-600 text-white' : completedSteps.includes('emergency-procedures') ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                completedSteps.includes('emergency-procedures') 
                  ? 'bg-green-600 text-white' 
                  : currentStep === 3 
                    ? 'bg-white text-blue-600' 
                    : 'bg-gray-400 text-white'
              }`}>
                {completedSteps.includes('emergency-procedures') ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${currentStep === 3 ? 'text-white' : completedSteps.includes('emergency-procedures') ? 'text-green-900' : 'text-gray-900'}`}>
                  Emergency Procedures
                </h4>
                <p className={`text-sm ${currentStep === 3 ? 'text-blue-100' : completedSteps.includes('emergency-procedures') ? 'text-green-700' : 'text-gray-600'}`}>
                  Define step-by-step response procedures
                </p>
              </div>
              {currentStep < 3 && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Complete previous steps first
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Create Emergency Plan
            </CardTitle>
            <CardDescription>
              Generate a comprehensive emergency action plan through our automated, guided process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What you'll create:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Complete emergency action plan document</li>
                <li>• Evacuation procedures and routes</li>
                <li>• Emergency contact information</li>
                <li>• Roles and responsibilities</li>
                <li>• Communication protocols</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Simple Method</CardTitle>
                  <CardDescription className="text-sm">
                    Fillable PDF in browser with guided text prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => navigate("/create-emergency-plan")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Start Simple Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed opacity-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Advanced Method</CardTitle>
                  <CardDescription className="text-sm">
                    AI-powered document generation (Coming Soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <Shield className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Don't have time right now? You can always come back to complete this later.
              </p>
              <Button variant="outline" onClick={() => navigate(facilityId ? `/facility/${facilityId}` : "/organization-dashboard")}>
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Components (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Components (Optional)</CardTitle>
          <CardDescription>
            These can be set up later to enhance your emergency planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h4 className="font-medium">Emergency Planning Committee</h4>
                <p className="text-sm text-gray-600">Set up committee structure and roles</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/epc-setup")}>
                Setup
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h4 className="font-medium">Emergency Control Organisation</h4>
                <p className="text-sm text-gray-600">Configure control hierarchy</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/eco-setup")}>
                Setup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPlanSetup;
