
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";

interface Risk {
  id: string;
  hazard: string;
  likelihood: string;
  severity: string;
  riskLevel: string;
  controls: string;
}

const RiskAssessment = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [newRisk, setNewRisk] = useState({
    hazard: "",
    likelihood: "Medium",
    severity: "Medium",
    controls: ""
  });

  const calculateRiskLevel = (likelihood: string, severity: string) => {
    const score = (likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1) * 
                  (severity === "High" ? 3 : severity === "Medium" ? 2 : 1);
    if (score >= 6) return "High";
    if (score >= 3) return "Medium";
    return "Low";
  };

  const addRisk = () => {
    if (newRisk.hazard.trim()) {
      const risk: Risk = {
        id: Date.now().toString(),
        ...newRisk,
        riskLevel: calculateRiskLevel(newRisk.likelihood, newRisk.severity)
      };
      setRisks([...risks, risk]);
      setNewRisk({ hazard: "", likelihood: "Medium", severity: "Medium", controls: "" });
    }
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="text-gray-600">Identify and evaluate potential risks and hazards in your facility</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Risk</CardTitle>
          <CardDescription>
            Identify potential hazards and assess their likelihood and severity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hazard">Hazard/Risk</Label>
              <Input
                id="hazard"
                placeholder="e.g., Fire, Chemical spill, Equipment failure"
                value={newRisk.hazard}
                onChange={(e) => setNewRisk({ ...newRisk, hazard: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="controls">Control Measures</Label>
              <Input
                id="controls"
                placeholder="e.g., Fire extinguishers, Safety protocols"
                value={newRisk.controls}
                onChange={(e) => setNewRisk({ ...newRisk, controls: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="likelihood">Likelihood</Label>
              <select
                id="likelihood"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newRisk.likelihood}
                onChange={(e) => setNewRisk({ ...newRisk, likelihood: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newRisk.severity}
                onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <Button onClick={addRisk} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </CardContent>
      </Card>

      {risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks.map((risk) => (
                <div key={risk.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{risk.hazard}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk.riskLevel)}`}>
                        {risk.riskLevel} Risk
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRisk(risk.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Likelihood:</span> {risk.likelihood}
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span> {risk.severity}
                    </div>
                    <div>
                      <span className="font-medium">Controls:</span> {risk.controls}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskAssessment;
