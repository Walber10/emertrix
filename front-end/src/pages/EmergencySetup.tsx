import { useState } from 'react';
import Header from '@/components/Header';
import DashboardCard from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Users, UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencySetup = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markAsComplete = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
  };

  const getStatus = (stepId: string) => {
    return completedSteps.includes(stepId) ? 'complete' : 'not-started';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Emergency Planning Setup</h1>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-800">
                These components are considered the minimum core functionality for the platform, and
                no facility should be shipped without them. A condensed MVP could consist of only
                these elements.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Setup Emergency Plan"
            description="Create and configure emergency response procedures and protocols for your facility."
            icon={FileText}
            buttonText="Setup Emergency Plan"
            onButtonClick={() => {
              markAsComplete('emergency-plan');
              navigate('/emergency-plan');
            }}
            status={getStatus('emergency-plan')}
          />

          <DashboardCard
            title="Setup Risk Assessment"
            description="Identify and evaluate potential risks and hazards in your facility environment."
            icon={AlertTriangle}
            buttonText="Setup Risk Assessment"
            onButtonClick={() => {
              markAsComplete('risk-assessment');
              navigate('/risk-assessment');
            }}
            status={getStatus('risk-assessment')}
          />

          <DashboardCard
            title="Setup Emergency Procedures"
            description="Define step-by-step emergency procedures and evacuation protocols."
            icon={Shield}
            buttonText="Setup Emergency Procedures"
            onButtonClick={() => {
              markAsComplete('emergency-procedures');
              navigate('/emergency-procedures');
            }}
            status={getStatus('emergency-procedures')}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Setup EPC (Emergency Planning Committee)"
              description="Establish and configure your Emergency Planning Committee structure and roles."
              icon={Users}
              buttonText="Setup EPC"
              onButtonClick={() => {
                markAsComplete('epc');
                navigate('/epc-setup');
              }}
              status={getStatus('epc')}
            />

            <DashboardCard
              title="Setup ECO (Emergency Control Organisation)"
              description="Configure your Emergency Control Organisation hierarchy and responsibilities."
              icon={UserCheck}
              buttonText="Setup ECO"
              onButtonClick={() => {
                markAsComplete('eco');
                navigate('/eco-setup');
              }}
              status={getStatus('eco')}
            />
          </div>
        </div>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">For consideration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Automate these steps via guided template, digital form or Agentic AI to streamline the
              setup process and ensure consistency across all facilities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencySetup;
