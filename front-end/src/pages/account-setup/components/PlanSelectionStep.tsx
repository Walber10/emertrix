import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { plans } from '@/utils/account-setup.utils';

interface PlanSelectionStepProps {
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

export const PlanSelectionStep = ({ selectedPlan, onSelectPlan }: PlanSelectionStepProps) => {
  return (
    <div className="grid grid-cols-4 gap-6 max-w-5xl mx-auto">
      {plans.map(plan => (
        <Card
          key={plan.id}
          className={`relative cursor-pointer transition-all duration-300 hover:scale-105 h-full flex flex-col ${
            selectedPlan === plan.id
              ? 'ring-2 ring-[#FF6500] shadow-2xl'
              : 'hover:shadow-xl border-gray-200'
          } ${plan.popular ? 'border-[#FF6500] border-2' : ''} ${
            plan.id === 'enterprise' ? 'bg-[#0E093D] text-white' : 'bg-white'
          }`}
          onClick={() => onSelectPlan(plan.id)}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-[#FF6500] text-white px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </span>
            </div>
          )}

          <CardHeader className="text-center pb-4 flex-shrink-0">
            <CardTitle
              className={`text-lg font-bold mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-[#0E093D]'}`}
            >
              {plan.name}
            </CardTitle>
            <div className={`mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-[#FF6500]'}`}>
              <span className="text-2xl font-bold">{plan.price}</span>
              <div
                className={`text-xs ${plan.id === 'enterprise' ? 'text-gray-300' : 'text-gray-500'}`}
              >
                {plan.period}
              </div>
            </div>
            <CardDescription
              className={`text-xs ${plan.id === 'enterprise' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
            <div className="space-y-4">
              <div>
                <h4
                  className={`font-semibold text-xs mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-[#0E093D]'}`}
                >
                  INCLUSIONS
                </h4>
                <ul className="space-y-1">
                  {plan.inclusions.map((inclusion, index) => (
                    <li key={index} className="flex items-center text-xs">
                      <Check
                        className={`h-3 w-3 mr-2 flex-shrink-0 ${plan.id === 'enterprise' ? 'text-green-400' : 'text-green-500'}`}
                      />
                      <span
                        className={plan.id === 'enterprise' ? 'text-gray-200' : 'text-gray-700'}
                      >
                        {inclusion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              className={`w-full mt-4 text-xs ${
                selectedPlan === plan.id
                  ? 'bg-[#FF6500] hover:bg-[#FF6500]/90 text-white'
                  : plan.id === 'enterprise'
                    ? 'bg-white text-[#0E093D] hover:bg-gray-100'
                    : 'bg-[#0E093D] hover:bg-[#0E093D]/90 text-white'
              }`}
              onClick={e => {
                e.stopPropagation();
                onSelectPlan(plan.id);
              }}
            >
              {selectedPlan === plan.id
                ? 'Selected'
                : plan.id === 'enterprise'
                  ? 'Contact Sales'
                  : 'Select Plan'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
