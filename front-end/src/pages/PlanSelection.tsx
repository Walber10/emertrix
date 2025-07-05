import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Building2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const PlanSelection = () => {
  const navigate = useNavigate();
  const { setPlan } = useOnboardingState();
  const [selectedPlan, setSelectedPlanLocal] = useState<string | null>(null);

  const plans = [
    {
      id: 'tier1',
      name: 'Tier 1',
      price: '$1899',
      period: ' (annual) / $190 (monthly)',
      description: 'Perfect for small facilities',
      inclusions: ['1 x facility', '50 x occupants'],
      addOns: 'No ability to add extra facilities or occupants',
      popular: false,
    },
    {
      id: 'tier2',
      name: 'Tier 2',
      price: '$2999',
      period: ' (annual) / $299 (monthly)',
      description: 'Ideal for growing organizations',
      inclusions: ['1 x facility', '100 x occupants'],
      addOns: 'Can add additional facilities or occupants at set prices',
      popular: true,
    },
    {
      id: 'tier3',
      name: 'Tier 3',
      price: '$4999',
      period: ' (annual) / $499 (monthly)',
      description: 'For larger organizations',
      inclusions: ['2 x facility', '300 x occupants'],
      addOns: 'Can add additional facilities or occupants at set prices',
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Call Us',
      price: 'Custom',
      period: ' Invoiced Pricing',
      description: 'For clients wanting more than 5 facilities and/or 500 occupants',
      inclusions: ['5+ facilities', '500+ occupants', 'Custom configuration', 'Dedicated support'],
      addOns: 'Fully customizable pricing structure',
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanLocal(planId);
  };

  const handleProceedToCheckout = () => {
    if (selectedPlan === 'enterprise') {
      // For enterprise, redirect to contact
      window.open('mailto:sales@emertrix.com', '_blank');
      return;
    }

    if (selectedPlan) {
      // Set the plan in onboarding state
      setPlan(selectedPlan);
      navigate('/account-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 mb-6">
            Emertrix uses a tiered SaaS pricing model with three standard tiers and a 'Call Us'
            option for larger clients.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 max-w-4xl mx-auto">
            <p className="mb-2">
              <strong>Key Definitions:</strong>
            </p>
            <p className="mb-2">
              <strong>Facility</strong> = A physical site/building. Each facility can be configured
              with its own emergency plan, risk assessment, procedures, and ECO/Warden and EPC
              structure.
            </p>
            <p>
              <strong>Occupant</strong> = A person who regularly works or resides at a facility (not
              casual visitors). They're granted access to online emergency training and, in future
              versions, emergency alerts/monitoring.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-600 shadow-lg' : 'hover:shadow-md'
              } ${plan.popular ? 'border-blue-600' : ''} ${
                plan.id === 'enterprise'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
                  : ''
              }`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`p-3 rounded-lg mx-auto mb-3 w-fit ${
                    plan.id === 'enterprise' ? 'bg-gray-700' : 'bg-amber-600'
                  }`}
                >
                  {plan.id === 'enterprise' ? (
                    <Phone className="h-6 w-6 text-white" />
                  ) : (
                    <Building2 className="h-6 w-6 text-white" />
                  )}
                </div>
                <CardTitle className={`text-xl ${plan.id === 'enterprise' ? 'text-white' : ''}`}>
                  {plan.name}
                </CardTitle>
                <div
                  className={`text-2xl font-bold ${plan.id === 'enterprise' ? 'text-white' : 'text-blue-600'}`}
                >
                  {plan.price}
                  <span
                    className={`text-sm font-normal ${plan.id === 'enterprise' ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    {plan.period}
                  </span>
                </div>
                <CardDescription
                  className={`text-sm ${plan.id === 'enterprise' ? 'text-gray-300' : ''}`}
                >
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4
                    className={`font-semibold text-sm mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-gray-900'}`}
                  >
                    INCLUSIONS
                  </h4>
                  <ul className="space-y-2">
                    {plan.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check
                          className={`h-4 w-4 mr-2 flex-shrink-0 ${plan.id === 'enterprise' ? 'text-green-400' : 'text-green-500'}`}
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

                <div>
                  <h4
                    className={`font-semibold text-sm mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-gray-900'}`}
                  >
                    ADD-ONS
                  </h4>
                  <p
                    className={`text-sm ${plan.id === 'enterprise' ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {plan.addOns}
                  </p>
                </div>

                <Button
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : plan.id === 'enterprise'
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
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

        {/* Checkout Button */}
        {selectedPlan && (
          <div className="text-center">
            <Button size="lg" onClick={handleProceedToCheckout} className="px-8 py-4 text-lg">
              {selectedPlan === 'enterprise' ? 'Contact Sales' : 'Proceed to Checkout'}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>All plans include emergency management tools • No setup fees • Cancel anytime</p>
          <p className="text-sm mt-2">
            Occupants are managed at the organisational level, meaning the total purchased can be
            distributed across facilities as needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
