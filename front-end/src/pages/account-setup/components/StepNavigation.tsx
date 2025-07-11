import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { AccountSetupStep } from '@/utils/account-setup.utils';
import { isLastStep, canGoBack } from '@/utils/account-setup.utils';

interface StepNavigationProps {
  currentStep: AccountSetupStep;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  loading: boolean;
  canSkip?: boolean;
  onSkip?: () => void;
}

export const StepNavigation = ({
  currentStep,
  onPrevious,
  onNext,
  onComplete,
  loading,
  canSkip,
  onSkip,
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={!canGoBack(currentStep)}
        className="px-8 h-12 text-gray-600 hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Go Back
      </Button>
      <div className="flex gap-4">
        {canSkip && onSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="px-8 h-12 text-gray-600 hover:bg-gray-100"
          >
            Skip
          </Button>
        )}
        <Button
          onClick={isLastStep(currentStep) ? onComplete : onNext}
          disabled={loading}
          className="px-8 h-12 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
        >
          {isLastStep(currentStep) ? (
            loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Complete Setup'
            )
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
};
