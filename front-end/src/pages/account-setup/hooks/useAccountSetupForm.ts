import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useOnboarding } from '@/hooks/useOnboarding';
import { mapPlanToEnum, UserRole, AccountSetupData, InvitedAdmin } from '@/types';
import {
  AccountSetupStep,
  DEFAULT_ACCOUNT_SETUP_DATA,
  DEFAULT_INVITE_DATA,
  getPlanLimits,
  validateStep1Fields,
  validateStep2Fields,
  validatePasswordMatch,
  validateInviteFields,
  checkDuplicateEmail,
  isLastStep,
  canGoBack,
} from '@/utils/account-setup.utils';

export const useAccountSetupForm = () => {
  const { toast } = useToast();
  const { onboarding, updateState } = useOnboardingState();
  const { submitOnboarding, loading } = useOnboarding();

  // Form state
  const [step, setStep] = useState<AccountSetupStep>(AccountSetupStep.ORGANIZATION_DETAILS);
  const [selectedPlanLocal, setSelectedPlanLocal] = useState<string | null>(
    onboarding.plan?.tier || null,
  );
  const [invitedAdmins, setInvitedAdmins] = useState<InvitedAdmin[]>([]);
  const [currentInvite, setCurrentInvite] = useState(DEFAULT_INVITE_DATA);
  const [formData, setFormData] = useState<AccountSetupData>(DEFAULT_ACCOUNT_SETUP_DATA);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [billingInterval, setBillingInterval] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

  // Form update functions
  const updateFormData = (field: keyof AccountSetupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCurrentInvite = (field: string, value: string) => {
    setCurrentInvite(prev => ({ ...prev, [field]: value }));
  };

  // Plan selection
  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      window.open('mailto:sales@emertrix.com', '_blank');
      return;
    }
    setSelectedPlanLocal(planId);
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
      updateFormData('profilePicture', e.target.files[0].name);
    }
  };

  // Admin invitation management
  const addInvitedAdmin = () => {
    const validationError = validateInviteFields(currentInvite);
    if (validationError) {
      toast({
        title: 'Missing Information',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    if (checkDuplicateEmail(currentInvite.email, invitedAdmins)) {
      toast({
        title: 'Duplicate Email',
        description: 'An admin with this email has already been invited',
        variant: 'destructive',
      });
      return;
    }

    const newAdmin: InvitedAdmin = {
      id: Date.now().toString(),
      ...currentInvite,
    };

    setInvitedAdmins(prev => [...prev, newAdmin]);
    setCurrentInvite(DEFAULT_INVITE_DATA);
    toast({
      title: 'Admin Added',
      description: `${newAdmin.firstName} ${newAdmin.lastName} will be invited upon account creation`,
    });
  };

  const removeInvitedAdmin = (id: string) => {
    setInvitedAdmins(prev => prev.filter(admin => admin.id !== id));
    toast({
      title: 'Admin Removed',
      description: 'Admin invitation removed',
    });
  };

  // Step navigation
  const handleNextStep = () => {
    if (step === AccountSetupStep.ORGANIZATION_DETAILS) {
      const missingFields = validateStep1Fields(formData);
      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(field => field.name).join(', ');
        toast({
          title: 'Missing Information',
          description: `Please fill in all required fields: ${missingFieldNames}`,
          variant: 'destructive',
        });
        return;
      }
    } else if (step === AccountSetupStep.USER_DETAILS) {
      const missingUserFields = validateStep2Fields(formData);
      if (missingUserFields.length > 0) {
        const missingFieldNames = missingUserFields.map(field => field.name).join(', ');
        toast({
          title: 'Missing Information',
          description: `Please fill in all required fields: ${missingFieldNames}`,
          variant: 'destructive',
        });
        return;
      }

      if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
    } else if (step === AccountSetupStep.PLAN_SELECTION) {
      if (!selectedPlanLocal) {
        toast({
          title: 'Plan Required',
          description: 'Please select a plan to continue',
          variant: 'destructive',
        });
        return;
      }
      const limits = getPlanLimits(selectedPlanLocal);
      updateState({
        plan: {
          tier: selectedPlanLocal as 'tier1' | 'tier2' | 'tier3' | 'enterprise',
          seats: limits.seats,
          facilities: limits.facilities,
          billing: 'annual',
        },
      });
    }

    if (!isLastStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (canGoBack(step)) {
      setStep(step - 1);
    }
  };

  // Form submission
  const handleComplete = () => {
    const onboardingData = {
      organization: {
        name: formData.organizationName,
        address: formData.address,
        phoneNumber: formData.phone,
        industry: formData.industry,
        natureOfWork: formData.natureOfWork,
        abn: formData.abn,
        organizationSize: formData.organizationSize,
        selectedPlan: mapPlanToEnum(selectedPlanLocal || 'tier1'),
        billingInterval,
        maxFacilities: getPlanLimits(selectedPlanLocal || 'tier1').facilities,
        totalSeats: getPlanLimits(selectedPlanLocal || 'tier1').seats,
      },
      admin: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.userPhone,
        role: UserRole.ADMIN,
      },
      invitedAdmins: invitedAdmins.map(admin => ({
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        phone: '',
        role: UserRole.ADMIN,
      })),
    };

    submitOnboarding({ ...onboardingData, profilePictureFile });

    updateState({
      organization: {
        name: formData.organizationName,
        address: formData.address,
        phoneNumber: formData.phone,
        industry: formData.industry,
        natureOfWork: formData.natureOfWork,
        abn: formData.abn,
        organizationSize: formData.organizationSize,
      },
      account: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.userPhone,
      },
      currentStep: 'facility-setup',
    });
  };

  return {
    // State
    step,
    selectedPlanLocal,
    invitedAdmins,
    currentInvite,
    formData,
    profilePictureFile,
    billingInterval,
    loading,

    // Actions
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
  };
};
