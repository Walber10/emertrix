import { AccountSetupData, InvitedAdmin } from '@/types';
import { plans } from '@/utils/account-setup.utils';

interface ReviewConfirmStepProps {
  formData: AccountSetupData;
  selectedPlan: string | null;
  invitedAdmins: InvitedAdmin[];
  billingInterval: 'MONTHLY' | 'YEARLY';
}

export const ReviewConfirmStep = ({
  formData,
  selectedPlan,
  invitedAdmins,
  billingInterval,
}: ReviewConfirmStepProps) => {
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Selected Plan</h4>
          <p className="text-gray-700 font-medium">
            {selectedPlanData?.name} - {selectedPlanData?.price}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Billing: {billingInterval === 'YEARLY' ? 'Annual' : 'Monthly'}
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Organization</h4>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">{formData.organizationName}</p>
            <p>{formData.industry}</p>
            <p>{formData.address}</p>
            <p>{formData.phone}</p>
            {formData.abn && <p>ABN: {formData.abn}</p>}
          </div>
        </div>

        <div className="p-6 bg-green-50 rounded-xl border border-green-200">
          <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Administrator</h4>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">
              {formData.firstName} {formData.lastName}
            </p>
            <p>{formData.email}</p>
            {formData.userPhone && <p>{formData.userPhone}</p>}
            {formData.jobTitle && <p>{formData.jobTitle}</p>}
          </div>
        </div>

        {invitedAdmins.length > 0 && (
          <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-lg text-[#0E093D] mb-4">
              Additional Admins ({invitedAdmins.length})
            </h4>
            {invitedAdmins.map(admin => (
              <div key={admin.id} className="text-gray-700 mb-2">
                {admin.firstName} {admin.lastName} - {admin.email}
                {admin.jobTitle && (
                  <span className="text-sm text-gray-500"> ({admin.jobTitle})</span>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-4">
              Email invitations will be sent upon account creation
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Plan Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="font-medium">Plan Features:</p>
            <ul className="text-sm mt-2 space-y-1">
              {selectedPlanData?.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Billing Information:</p>
            <p className="text-sm mt-2">
              {billingInterval === 'YEARLY' ? 'Annual billing' : 'Monthly billing'}
            </p>
            <p className="text-sm text-gray-600">
              {selectedPlanData?.price} per {billingInterval === 'YEARLY' ? 'year' : 'month'}
            </p>
          </div>
          <div>
            <p className="font-medium">Next Steps:</p>
            <p className="text-sm mt-2">
              After account creation, you'll be redirected to set up your first facility and
              complete your emergency planning setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
