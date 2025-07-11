import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Trash2 } from 'lucide-react';
import { InvitedAdmin } from '@/types';
import { InviteFormData } from '@/utils/account-setup.utils';

interface InviteAdminsStepProps {
  invitedAdmins: InvitedAdmin[];
  currentInvite: InviteFormData;
  updateCurrentInvite: (field: string, value: string) => void;
  addInvitedAdmin: () => void;
  removeInvitedAdmin: (id: string) => void;
}

export const InviteAdminsStep = ({
  invitedAdmins,
  currentInvite,
  updateCurrentInvite,
  addInvitedAdmin,
  removeInvitedAdmin,
}: InviteAdminsStepProps) => {
  return (
    <div className="space-y-8">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 space-y-6 bg-gray-50">
        <h4 className="font-semibold text-lg text-[#0E093D]">Add New Admin</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="inviteFirstName" className="text-[#0E093D] font-light text-lg">
              First Name
            </Label>
            <Input
              id="inviteFirstName"
              value={currentInvite.firstName}
              onChange={e => updateCurrentInvite('firstName', e.target.value)}
              placeholder="First name"
              className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
            />
          </div>
          <div>
            <Label htmlFor="inviteLastName" className="text-[#0E093D] font-light text-lg">
              Last Name
            </Label>
            <Input
              id="inviteLastName"
              value={currentInvite.lastName}
              onChange={e => updateCurrentInvite('lastName', e.target.value)}
              placeholder="Last name"
              className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="inviteEmail" className="text-[#0E093D] font-light text-lg">
              Email Address
            </Label>
            <Input
              id="inviteEmail"
              type="email"
              value={currentInvite.email}
              onChange={e => updateCurrentInvite('email', e.target.value)}
              placeholder="email@example.com"
              className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="inviteJobTitle" className="text-[#0E093D] font-light text-lg">
              Job Title
            </Label>
            <Input
              id="inviteJobTitle"
              value={currentInvite.jobTitle}
              onChange={e => updateCurrentInvite('jobTitle', e.target.value)}
              placeholder="e.g., Emergency Coordinator"
              className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
            />
          </div>
        </div>
        <Button
          onClick={addInvitedAdmin}
          className="w-full h-12 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Admin
        </Button>
      </div>

      {invitedAdmins.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg text-[#0E093D] mb-6">
            Invited Admins ({invitedAdmins.length})
          </h4>
          <div className="space-y-4">
            {invitedAdmins.map(admin => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm"
              >
                <div>
                  <p className="font-semibold text-[#0E093D]">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  {admin.jobTitle && <p className="text-sm text-gray-500">{admin.jobTitle}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInvitedAdmin(admin.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            Each invited admin will receive an email invitation with a unique registration link and
            will occupy one occupant seat.
          </p>
        </div>
      )}

      {invitedAdmins.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No additional admins invited yet</p>
          <p className="text-sm">You can skip this step and invite admins later</p>
        </div>
      )}
    </div>
  );
};
