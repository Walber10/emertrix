import { Card, CardContent } from '@/components/ui/card';
import { AccountSetupSidebar } from '@/pages/account-setup/components/AccountSetupSidebar';
import { OrganizationDetailsStep } from '@/pages/account-setup/components/OrganizationDetailsStep';
import { UserDetailsStep } from '@/pages/account-setup/components/UserDetailsStep';
import { InviteAdminsStep } from '@/pages/account-setup/components/InviteAdminsStep';
import { PlanSelectionStep } from '@/pages/account-setup/components/PlanSelectionStep';
import { ReviewConfirmStep } from '@/pages/account-setup/components/ReviewConfirmStep';
import { StepNavigation } from '@/pages/account-setup/components/StepNavigation';
import { useAccountSetupForm } from '@/pages/account-setup/hooks/useAccountSetupForm';
import { AccountSetupStep } from '@/utils/account-setup.utils';
import { getStepTitle, getStepDescription } from '@/utils/account-setup.utils';

const AccountSetup = () => {
  const {
    step,
    selectedPlanLocal,
    invitedAdmins,
    currentInvite,
    formData,
    billingInterval,
    loading,
    updateFormData,
    updateCurrentInvite,
    setBillingInterval,
    handleSelectPlan,
    handleFileChange,
    addInvitedAdmin,
    removeInvitedAdmin,
    handleNextStep,
    handlePreviousStep,
    handleComplete,
  } = useAccountSetupForm();

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <AccountSetupSidebar currentStep={step} />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-[#0E093D] mb-2">{getStepTitle(step)}</h1>
            <p className="text-lg text-slate-600">{getStepDescription(step)}</p>
          </div>
          <Card className="border-0">
            <CardContent className="p-8">
              {step === AccountSetupStep.ORGANIZATION_DETAILS && (
                <OrganizationDetailsStep formData={formData} updateFormData={updateFormData} />
              )}
              {step === AccountSetupStep.USER_DETAILS && (
                <UserDetailsStep
                  formData={formData}
                  updateFormData={updateFormData}
                  handleFileChange={handleFileChange}
                />
              )}
              {step === AccountSetupStep.INVITE_ADMINS && (
                <InviteAdminsStep
                  invitedAdmins={invitedAdmins}
                  currentInvite={currentInvite}
                  updateCurrentInvite={updateCurrentInvite}
                  addInvitedAdmin={addInvitedAdmin}
                  removeInvitedAdmin={removeInvitedAdmin}
                />
              )}
              {step === AccountSetupStep.PLAN_SELECTION && (
                <PlanSelectionStep
                  selectedPlan={selectedPlanLocal}
                  onSelectPlan={handleSelectPlan}
                />
              )}
              {step === AccountSetupStep.REVIEW_CONFIRM && (
                <ReviewConfirmStep
                  formData={formData}
                  selectedPlan={selectedPlanLocal}
                  invitedAdmins={invitedAdmins}
                  billingInterval={billingInterval}
                />
              )}
            </CardContent>
          </Card>
          <StepNavigation
            currentStep={step}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onComplete={handleComplete}
            loading={loading}
            canSkip={step === AccountSetupStep.INVITE_ADMINS}
            onSkip={handleNextStep}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;
