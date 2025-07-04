
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateEmergencyPlan = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState({
    title: "",
    facility: "",
    description: "",
    emergencyContacts: "",
    evacuationProcedures: "",
    communicationPlan: "",
    riskAssessment: "",
    emergencySupplies: "",
    trainingRequirements: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setPlanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // For now, just log the data - in a real app this would save to backend
    console.log("Saving emergency plan:", planData);
    // Navigate back to emergency plan page
    navigate("/emergency-plan");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate("/emergency-plan")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Emergency Plan
        </Button>
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Emergency Plan - Simple Method</h1>
            <p className="text-gray-600">Fill out the sections below to create your emergency plan</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
          <CardDescription>
            Basic information about your emergency plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Plan Title</Label>
              <Input
                id="title"
                placeholder="e.g., Main Facility Emergency Response Plan"
                value={planData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="facility">Facility Name</Label>
              <Input
                id="facility"
                placeholder="e.g., Manufacturing Plant A"
                value={planData.facility}
                onChange={(e) => handleInputChange("facility", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Plan Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the emergency plan scope and purpose"
              value={planData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Plan Sections</CardTitle>
          <CardDescription>
            Complete each section to build your comprehensive emergency plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="emergencyContacts">Emergency Contacts</Label>
            <Textarea
              id="emergencyContacts"
              placeholder="List key emergency contacts including fire department, police, medical services, facility management, etc."
              rows={4}
              value={planData.emergencyContacts}
              onChange={(e) => handleInputChange("emergencyContacts", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="evacuationProcedures">Evacuation Procedures</Label>
            <Textarea
              id="evacuationProcedures"
              placeholder="Describe evacuation routes, assembly points, procedures for different areas of the facility, etc."
              rows={4}
              value={planData.evacuationProcedures}
              onChange={(e) => handleInputChange("evacuationProcedures", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="communicationPlan">Communication Plan</Label>
            <Textarea
              id="communicationPlan"
              placeholder="Describe how emergency information will be communicated to staff, authorities, and stakeholders"
              rows={4}
              value={planData.communicationPlan}
              onChange={(e) => handleInputChange("communicationPlan", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="riskAssessment">Risk Assessment Summary</Label>
            <Textarea
              id="riskAssessment"
              placeholder="Summarize key risks identified for this facility and their mitigation strategies"
              rows={4}
              value={planData.riskAssessment}
              onChange={(e) => handleInputChange("riskAssessment", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="emergencySupplies">Emergency Supplies & Equipment</Label>
            <Textarea
              id="emergencySupplies"
              placeholder="List emergency supplies, equipment locations, maintenance schedules, etc."
              rows={4}
              value={planData.emergencySupplies}
              onChange={(e) => handleInputChange("emergencySupplies", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="trainingRequirements">Training Requirements</Label>
            <Textarea
              id="trainingRequirements"
              placeholder="Describe required training for staff, drill schedules, competency requirements, etc."
              rows={4}
              value={planData.trainingRequirements}
              onChange={(e) => handleInputChange("trainingRequirements", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate("/emergency-plan")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Emergency Plan
        </Button>
      </div>
    </div>
  );
};

export default CreateEmergencyPlan;
