
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Plus, Trash2, Edit } from "lucide-react";

interface Procedure {
  id: string;
  title: string;
  type: string;
  steps: string[];
  assignedRole: string;
}

const EmergencyProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [newProcedure, setNewProcedure] = useState({
    title: "",
    type: "Evacuation",
    steps: [""],
    assignedRole: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const procedureTypes = ["Evacuation", "Fire", "Medical Emergency", "Chemical Spill", "Lockdown", "Severe Weather"];

  const addStep = () => {
    setNewProcedure({
      ...newProcedure,
      steps: [...newProcedure.steps, ""]
    });
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...newProcedure.steps];
    updatedSteps[index] = value;
    setNewProcedure({ ...newProcedure, steps: updatedSteps });
  };

  const removeStep = (index: number) => {
    const updatedSteps = newProcedure.steps.filter((_, i) => i !== index);
    setNewProcedure({ ...newProcedure, steps: updatedSteps });
  };

  const saveProcedure = () => {
    if (newProcedure.title.trim() && newProcedure.steps.some(step => step.trim())) {
      const procedure: Procedure = {
        id: editingId || Date.now().toString(),
        ...newProcedure,
        steps: newProcedure.steps.filter(step => step.trim())
      };
      
      if (editingId) {
        setProcedures(procedures.map(p => p.id === editingId ? procedure : p));
        setEditingId(null);
      } else {
        setProcedures([...procedures, procedure]);
      }
      
      setNewProcedure({ title: "", type: "Evacuation", steps: [""], assignedRole: "" });
    }
  };

  const editProcedure = (procedure: Procedure) => {
    setNewProcedure({
      title: procedure.title,
      type: procedure.type,
      steps: [...procedure.steps, ""],
      assignedRole: procedure.assignedRole
    });
    setEditingId(procedure.id);
  };

  const deleteProcedure = (id: string) => {
    setProcedures(procedures.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Procedures</h1>
          <p className="text-gray-600">Define step-by-step emergency procedures and protocols</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Create New"} Emergency Procedure</CardTitle>
          <CardDescription>
            Define clear, step-by-step procedures for emergency scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Procedure Title</Label>
              <Input
                id="title"
                placeholder="e.g., Fire Evacuation Protocol"
                value={newProcedure.title}
                onChange={(e) => setNewProcedure({ ...newProcedure, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Emergency Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newProcedure.type}
                onChange={(e) => setNewProcedure({ ...newProcedure, type: e.target.value })}
              >
                {procedureTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="assignedRole">Assigned Role/Responsible Person</Label>
              <Input
                id="assignedRole"
                placeholder="e.g., Floor Warden, Safety Officer"
                value={newProcedure.assignedRole}
                onChange={(e) => setNewProcedure({ ...newProcedure, assignedRole: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Procedure Steps</Label>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {newProcedure.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <Input
                    placeholder={`Step ${index + 1}...`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                  />
                  {newProcedure.steps.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveProcedure}>
              {editingId ? "Update Procedure" : "Save Procedure"}
            </Button>
            {editingId && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setNewProcedure({ title: "", type: "Evacuation", steps: [""], assignedRole: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {procedures.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Emergency Procedures</h2>
          {procedures.map((procedure) => (
            <Card key={procedure.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{procedure.title}</CardTitle>
                    <CardDescription>
                      Type: {procedure.type} | Assigned to: {procedure.assignedRole}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => editProcedure(procedure)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteProcedure(procedure.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {procedure.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyProcedures;
