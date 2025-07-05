import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EmergencyPlan = () => {
  const [planStatus, setPlanStatus] = useState<'draft' | 'approved' | 'archived'>('draft');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReviewPlan = () => {
    toast({
      title: 'Opening Plan Review',
      description: 'Emergency plan opened for review in a new window',
    });
    // In a real app, this would open the plan document in review mode
    console.log('Opening plan for review');
  };

  const handleGenerateReport = () => {
    toast({
      title: 'Generating Report',
      description: 'Emergency plan compliance report is being generated',
    });
    // In a real app, this would generate and download a PDF report
    console.log('Generating emergency plan report');
  };

  const handleViewPlan = (planVersion: string) => {
    toast({
      title: 'Viewing Plan',
      description: `Opening ${planVersion} for viewing`,
    });
    // In a real app, this would open the plan document in view mode
    console.log(`Viewing plan: ${planVersion}`);
  };

  const handleDownloadPlan = (planVersion: string) => {
    toast({
      title: 'Downloading Plan',
      description: `${planVersion} is being downloaded`,
    });
    // In a real app, this would trigger the download of the plan PDF
    console.log(`Downloading plan: ${planVersion}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-sm font-medium text-blue-900">SIDEBAR MENU</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Emergency Plan
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Risk Assessment
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Emergency Procedures
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    EPC Setup
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    ECO Setup
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6" />
                    <div>
                      <CardTitle>Emergency Plan</CardTitle>
                      <CardDescription className="text-blue-100">
                        Facility: Select Facility | Compliance Status:{' '}
                        {planStatus === 'approved' ? 'Compliant' : 'Partially Compliant'} | Not
                        Compliant
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">Admin User</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Current Emergency Plan</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Approval Date:</span>
                          <span className="font-medium">2024-01-15</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Review Date:</span>
                          <span className="font-medium">2024-12-15</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            In-page header allowing users to scroll and view the Emergency Plan
                            document without needing to download a copy.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Archived Emergency Plans</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Emergency Plan v2.1</span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPlan('Emergency Plan v2.1')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPlan('Emergency Plan v2.1')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Emergency Plan v2.0</span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPlan('Emergency Plan v2.0')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPlan('Emergency Plan v2.0')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t">
                    <Button onClick={() => navigate('/create-emergency-plan')}>
                      Create New Plan
                    </Button>
                    <Button variant="outline" onClick={handleReviewPlan}>
                      Review Plan
                    </Button>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Creation Methods */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Plan Creation Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Simple Method</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Fillable PDF in browser. User manually fills empty sections, text guided, basic
                    experience.
                  </p>
                  <Button onClick={() => navigate('/create-emergency-plan')}>
                    Start Simple Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPlan;
