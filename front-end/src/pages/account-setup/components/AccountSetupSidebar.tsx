import { Building2, User, UserPlus, Check, ChevronRight } from 'lucide-react';
import { EmertrixLogo } from '@/components/EmertrixLogo';
import { AccountSetupStep } from '@/utils/account-setup.utils';

interface AccountSetupSidebarProps {
  currentStep: AccountSetupStep;
}

const steps = [
  {
    number: AccountSetupStep.ORGANIZATION_DETAILS,
    title: 'Organisation Details',
    icon: Building2,
  },
  { number: AccountSetupStep.USER_DETAILS, title: 'User Details', icon: User },
  { number: AccountSetupStep.INVITE_ADMINS, title: 'Invite Additional Admins', icon: UserPlus },
  { number: AccountSetupStep.PLAN_SELECTION, title: 'Plan Selection', icon: Building2 },
  { number: AccountSetupStep.REVIEW_CONFIRM, title: 'Review & Confirm', icon: Check },
];

export const AccountSetupSidebar = ({ currentStep }: AccountSetupSidebarProps) => {
  return (
    <div className="w-80 bg-[#0E093D] p-8 flex flex-col">
      <div className="mb-12">
        <EmertrixLogo size="lg" className="text-white" variant="white" />
      </div>

      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-8">Account Setup</h2>
        <nav className="space-y-4">
          {steps.map(stepItem => (
            <div
              key={stepItem.number}
              className={`flex items-center p-4 rounded-lg transition-all ${
                currentStep === stepItem.number
                  ? 'bg-[#FF6500] text-white'
                  : currentStep > stepItem.number
                    ? 'bg-white/10 text-white'
                    : 'text-white/60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                  currentStep === stepItem.number
                    ? 'bg-white text-[#FF6500]'
                    : currentStep > stepItem.number
                      ? 'bg-[#FF6500] text-white'
                      : 'bg-white/20 text-white/60'
                }`}
              >
                {currentStep > stepItem.number ? <Check className="h-4 w-4" /> : stepItem.number}
              </div>
              <div className="flex-1">
                <div className="font-medium">{stepItem.title}</div>
              </div>
              {currentStep === stepItem.number && <ChevronRight className="h-4 w-4" />}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};
