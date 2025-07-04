
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft, Trash2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface InvitedAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

const InviteAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitedAdmins, setInvitedAdmins] = useState<InvitedAdmin[]>([]);
  const [currentInvite, setCurrentInvite] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: ""
  });

  const updateCurrentInvite = (field: string, value: string) => {
    setCurrentInvite(prev => ({ ...prev, [field]: value }));
  };

  const addInvitedAdmin = () => {
    if (!currentInvite.firstName || !currentInvite.lastName || !currentInvite.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in first name, last name, and email for the admin",
        variant: "destructive"
      });
      return;
    }

    // Check if email already exists
    if (invitedAdmins.some(admin => admin.email === currentInvite.email)) {
      toast({
        title: "Duplicate Email",
        description: "An admin with this email has already been invited",
        variant: "destructive"
      });
      return;
    }

    const newAdmin: InvitedAdmin = {
      id: Date.now().toString(),
      ...currentInvite
    };

    setInvitedAdmins(prev => [...prev, newAdmin]);
    setCurrentInvite({
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: ""
    });

    toast({
      title: "Admin Added",
      description: `${newAdmin.firstName} ${newAdmin.lastName} will be invited upon sending invitations`
    });
  };

  const removeInvitedAdmin = (id: string) => {
    setInvitedAdmins(prev => prev.filter(admin => admin.id !== id));
    toast({
      title: "Admin Removed",
      description: "Admin invitation removed"
    });
  };

  const sendInvitations = () => {
    if (invitedAdmins.length === 0) {
      toast({
        title: "No Invitations to Send",
        description: "Please add at least one admin to invite",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invitations Sent",
      description: `${invitedAdmins.length} admin invitation(s) have been sent via email`
    });

    // Clear the list after sending
    setInvitedAdmins([]);
    navigate("/organization-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/organization-dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invite Additional Admins</h1>
            <p className="text-gray-600 mt-2">Add organizational administrators to your account</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Additional Admins
            </CardTitle>
            <CardDescription>
              Invite other organizational admins. Each will occupy one occupant seat and receive full access to your organization's account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Admin Form */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New Admin</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inviteFirstName">First Name</Label>
                  <Input
                    id="inviteFirstName"
                    value={currentInvite.firstName}
                    onChange={(e) => updateCurrentInvite("firstName", e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="inviteLastName">Last Name</Label>
                  <Input
                    id="inviteLastName"
                    value={currentInvite.lastName}
                    onChange={(e) => updateCurrentInvite("lastName", e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={currentInvite.email}
                  onChange={(e) => updateCurrentInvite("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="inviteJobTitle">Job Title</Label>
                <Input
                  id="inviteJobTitle"
                  value={currentInvite.jobTitle}
                  onChange={(e) => updateCurrentInvite("jobTitle", e.target.value)}
                  placeholder="e.g., Emergency Coordinator"
                />
              </div>
              <Button onClick={addInvitedAdmin} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>

            {/* List of Invited Admins */}
            {invitedAdmins.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Invited Admins ({invitedAdmins.length})</h4>
                <div className="space-y-2">
                  {invitedAdmins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{admin.firstName} {admin.lastName}</p>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        {admin.jobTitle && <p className="text-sm text-gray-500">{admin.jobTitle}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvitedAdmin(admin.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Each invited admin will receive an email invitation with a unique registration link and will occupy one occupant seat.
                </p>
              </div>
            )}

            {invitedAdmins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No additional admins added yet</p>
                <p className="text-sm">Add administrators using the form above</p>
              </div>
            )}
          </CardContent>

          <div className="flex justify-between p-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate("/organization-dashboard")}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendInvitations}
              disabled={invitedAdmins.length === 0}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invitations ({invitedAdmins.length})
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InviteAdmin;
