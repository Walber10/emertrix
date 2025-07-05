import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2,
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  UserPlus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { EmertrixLogo } from '@/components/EmertrixLogo';
import { useOnboarding } from '@/hooks/useOnboarding';

interface InvitedAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

interface AccountSetupData {
  // Organization details
  organizationName: string;
  organizationType: string;
  industry: string;
  natureOfWork: string;
  abn: string;
  organizationSize: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;

  // User details
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle: string;
  userPhone: string;
  profilePicture?: string;
  username: string;
}

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

const industries = [
  'Aged Care & Disability Services',
  'Childcare & Early Learning',
  'Education & Training',
  'Retail & Hospitality',
  'Healthcare & Medical',
  'Construction & Trades',
  'Manufacturing & Warehousing',
  'Transport & Logistics',
  'Government & Public Services',
  'Emergency Services & Defence',
  'Corporate & Professional Services',
  'Real Estate & Property Management',
  'Community & Not-for-Profit',
  'Mining, Resources & Energy',
  'Technology & Software',
  'Finance & Insurance',
  'Agriculture & Farming',
  'Utilities & Infrastructure',
  'Tourism & Events',
  'Cleaning & Facility Services',
  'Other',
];

const organizationSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const getPlanLimits = (tier: string): { seats: number; facilities: number } => {
  switch (tier) {
    case 'tier1':
      return { seats: 50, facilities: 1 };
    case 'tier2':
      return { seats: 100, facilities: 1 };
    case 'tier3':
      return { seats: 300, facilities: 2 };
    case 'enterprise':
      return { seats: 500, facilities: 5 };
    default:
      return { seats: 0, facilities: 0 };
  }
};

const AccountSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appData } = useApp();
  const { onboarding, updateState } = useOnboardingState();
  const [step, setStep] = useState(1);
  const [selectedPlanLocal, setSelectedPlanLocal] = useState<string | null>(
    onboarding.plan?.tier || null,
  );
  const [invitedAdmins, setInvitedAdmins] = useState<InvitedAdmin[]>([]);
  const [currentInvite, setCurrentInvite] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
  });
  const [formData, setFormData] = useState<AccountSetupData>({
    // Organization details
    organizationName: '',
    organizationType: '',
    industry: '',
    natureOfWork: '',
    abn: '',
    organizationSize: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',

    // User details
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    userPhone: '',
    profilePicture: '',
    username: '',
  });

  const { submitOnboarding, loading, error, success } = useOnboarding();

  const updateFormData = (field: keyof AccountSetupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCurrentInvite = (field: string, value: string) => {
    setCurrentInvite(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      window.open('mailto:sales@emertrix.com', '_blank');
      return;
    }
    setSelectedPlanLocal(planId);
  };

  const addInvitedAdmin = () => {
    if (!currentInvite.firstName || !currentInvite.lastName || !currentInvite.email) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in first name, last name, and email for the admin',
        variant: 'destructive',
      });
      return;
    }

    if (invitedAdmins.some(admin => admin.email === currentInvite.email)) {
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
    setCurrentInvite({
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
    });

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

  const handleNextStep = () => {
    if (step === 1) {
      // Organization Setup validation
      const requiredFields = [
        { field: formData.organizationName, name: 'Organization Name' },
        { field: formData.address, name: 'Address' },
        { field: formData.phone, name: 'Phone Number' },
        { field: formData.industry, name: 'Industry' },
        { field: formData.organizationSize, name: 'Organization Size' },
      ];

      const missingFields = requiredFields.filter(
        field => !field.field || field.field.trim() === '',
      );

      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(field => field.name).join(', ');
        toast({
          title: 'Missing Information',
          description: `Please fill in all required fields: ${missingFieldNames}`,
          variant: 'destructive',
        });
        return;
      }
    } else if (step === 2) {
      // User Setup validation
      const requiredUserFields = [
        { field: formData.firstName, name: 'First Name' },
        { field: formData.lastName, name: 'Last Name' },
        { field: formData.email, name: 'Email' },
        { field: formData.password, name: 'Password' },
      ];

      const missingUserFields = requiredUserFields.filter(
        field => !field.field || field.field.trim() === '',
      );

      if (missingUserFields.length > 0) {
        const missingFieldNames = missingUserFields.map(field => field.name).join(', ');
        toast({
          title: 'Missing Information',
          description: `Please fill in all required fields: ${missingFieldNames}`,
          variant: 'destructive',
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
    } else if (step === 4) {
      // Plan Selection validation
      if (!selectedPlanLocal) {
        toast({
          title: 'Plan Required',
          description: 'Please select a plan to continue',
          variant: 'destructive',
        });
        return;
      }
      // Update onboarding state with selected plan
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

    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Prepare onboarding data for backend
      const onboardingData = {
        organization: {
          name: formData.organizationName,
          address: formData.address,
          phoneNumber: formData.phone,
          industry: formData.industry,
          natureOfWork: formData.natureOfWork,
          abn: formData.abn,
          organizationSize: formData.organizationSize,
          selectedPlan: selectedPlanLocal as 'free' | 'tier1' | 'tier2' | 'tier3' | 'enterprise',
          maxFacilities: getPlanLimits(selectedPlanLocal || 'tier1').facilities,
          totalSeats: getPlanLimits(selectedPlanLocal || 'tier1').seats,
        },
        owner: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phone: formData.userPhone,
        },
        invitedAdmins: invitedAdmins.map(admin => ({
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          phone: '', // Add phone field if needed
        })),
      };

      // Submit to backend
      await submitOnboarding(onboardingData);

      // Save to local state for navigation
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

      if (invitedAdmins.length > 0) {
        toast({
          title: 'Invitations Sent',
          description: `${invitedAdmins.length} admin invitation(s) will be sent via email`,
        });
      }

      toast({
        title: 'Account Created Successfully',
        description: 'Welcome to the Emergency Planning System!',
      });

      navigate('/facility-setup');
    } catch (err) {
      toast({
        title: 'Error Creating Account',
        description: error || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const steps = [
    { number: 1, title: 'Organisation Details', icon: Building2 },
    { number: 2, title: 'User Details', icon: User },
    { number: 3, title: 'Invite Additional Admins', icon: UserPlus },
    { number: 4, title: 'Plan Selection', icon: Building2 },
    { number: 5, title: 'Review & Confirm', icon: Check },
  ];

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Organisation Details';
      case 2:
        return 'User Details';
      case 3:
        return 'Invite Additional Admins';
      case 4:
        return 'Select Your Plan';
      case 5:
        return 'Review & Confirm';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Provide your organisation's details to set up its primary account.";
      case 2:
        return 'User setup captures the details of the primary account holder and assigns them as the default admin for the organisation.';
      case 3:
        return 'Optional functionality to add and invite additional admin users during setup.';
      case 4:
        return "Choose the plan that best fits your organization's needs";
      case 5:
        return 'Please review your information before completing setup.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#0E093D] p-8 flex flex-col">
        {/* Logo */}
        <div className="mb-12">
          <EmertrixLogo size="lg" showText={false} className="text-white" />
        </div>

        {/* Steps Navigation */}
        <div className="flex-1">
          <h2 className="text-white text-xl font-semibold mb-8">Account Setup</h2>
          <nav className="space-y-4">
            {steps.map(stepItem => (
              <div
                key={stepItem.number}
                className={`flex items-center p-4 rounded-lg transition-all ${
                  step === stepItem.number
                    ? 'bg-[#FF6500] text-white'
                    : step > stepItem.number
                      ? 'bg-white/10 text-white'
                      : 'text-white/60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                    step === stepItem.number
                      ? 'bg-white text-[#FF6500]'
                      : step > stepItem.number
                        ? 'bg-[#FF6500] text-white'
                        : 'bg-white/20 text-white/60'
                  }`}
                >
                  {step > stepItem.number ? <Check className="h-4 w-4" /> : stepItem.number}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{stepItem.title}</div>
                </div>
                {step === stepItem.number && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl text-[#0E093D] mb-2">{getStepTitle()}</h1>
            <p className="text-lg text-slate-600">{getStepDescription()}</p>
          </div>

          {/* Content Card */}
          <Card className="border-0">
            <CardContent className="p-8">
              {/* Step 1: Organisation Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="orgName" className="text-[#0E093D] font-light text-lg">
                        Organisation Name *
                      </Label>
                      <Input
                        id="orgName"
                        value={formData.organizationName}
                        onChange={e => updateFormData('organizationName', e.target.value)}
                        placeholder="Organisation Name"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-[#0E093D] font-light text-lg">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={e => updateFormData('address', e.target.value)}
                        placeholder="Address"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#0E093D] font-light text-lg">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e => updateFormData('phone', e.target.value)}
                        placeholder="Phone number"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry" className="text-[#0E093D] font-light text-lg">
                        Industry *
                      </Label>
                      <select
                        id="industry"
                        className="flex h-12 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm mt-2 focus:border-[#FF6500] focus:ring-[#FF6500]"
                        value={formData.industry}
                        onChange={e => updateFormData('industry', e.target.value)}
                      >
                        <option value="">Select your industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="natureOfWork" className="text-[#0E093D] font-light text-lg">
                        Nature of Work
                      </Label>
                      <Input
                        id="natureOfWork"
                        value={formData.natureOfWork}
                        onChange={e => updateFormData('natureOfWork', e.target.value)}
                        placeholder="Nature of work"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="orgSize" className="text-[#0E093D] font-light text-lg">
                        Organisation Size *
                      </Label>
                      <select
                        id="orgSize"
                        className="flex h-12 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm mt-2 focus:border-[#FF6500] focus:ring-[#FF6500]"
                        value={formData.organizationSize}
                        onChange={e => updateFormData('organizationSize', e.target.value)}
                      >
                        <option value="">Select organisation size</option>
                        {organizationSizes.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="abn" className="text-[#0E093D] font-light text-lg">
                        ABN
                      </Label>
                      <Input
                        id="abn"
                        value={formData.abn}
                        onChange={e => updateFormData('abn', e.target.value)}
                        placeholder="ABN"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: User Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-[#0E093D] font-light text-lg">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={e => updateFormData('firstName', e.target.value)}
                        placeholder="First Name"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-[#0E093D] font-light text-lg">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={e => updateFormData('lastName', e.target.value)}
                        placeholder="Last Name"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-[#0E093D] font-light text-lg">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={e => updateFormData('password', e.target.value)}
                        placeholder="Password"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-[#0E093D] font-light text-lg"
                      >
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={e => updateFormData('confirmPassword', e.target.value)}
                        placeholder="Confirm Password"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userPhone" className="text-[#0E093D] font-light text-lg">
                        Phone Number
                      </Label>
                      <Input
                        id="userPhone"
                        value={formData.userPhone}
                        onChange={e => updateFormData('userPhone', e.target.value)}
                        placeholder="Phone Number"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#0E093D] font-light text-lg">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => updateFormData('email', e.target.value)}
                        placeholder="Email"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="jobTitle" className="text-[#0E093D] font-light text-lg">
                        Role / Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={e => updateFormData('jobTitle', e.target.value)}
                        placeholder="Role / Job Title"
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="profilePicture" className="text-[#0E093D] font-light text-lg">
                        Profile Picture <span className="text-gray-500">(optional)</span>
                      </Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={e => updateFormData('profilePicture', e.target.value)}
                        className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Invite Admins */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 space-y-6 bg-gray-50">
                    <h4 className="font-semibold text-lg text-[#0E093D]">Add New Admin</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="inviteFirstName"
                          className="text-[#0E093D] font-light text-lg"
                        >
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
                        <Label
                          htmlFor="inviteLastName"
                          className="text-[#0E093D] font-light text-lg"
                        >
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
                        <Label
                          htmlFor="inviteJobTitle"
                          className="text-[#0E093D] font-light text-lg"
                        >
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
                              {admin.jobTitle && (
                                <p className="text-sm text-gray-500">{admin.jobTitle}</p>
                              )}
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
                        Each invited admin will receive an email invitation with a unique
                        registration link and will occupy one occupant seat.
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
              )}

              {/* Step 4: Plan Selection */}
              {step === 4 && (
                <div className="grid grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {plans.map(plan => (
                    <Card
                      key={plan.id}
                      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 h-full flex flex-col ${
                        selectedPlanLocal === plan.id
                          ? 'ring-2 ring-[#FF6500] shadow-2xl'
                          : 'hover:shadow-xl border-gray-200'
                      } ${plan.popular ? 'border-[#FF6500] border-2' : ''} ${
                        plan.id === 'enterprise' ? 'bg-[#0E093D] text-white' : 'bg-white'
                      }`}
                      onClick={() => handleSelectPlan(plan.id)}
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
                        <div
                          className={`mb-2 ${plan.id === 'enterprise' ? 'text-white' : 'text-[#FF6500]'}`}
                        >
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
                                    className={
                                      plan.id === 'enterprise' ? 'text-gray-200' : 'text-gray-700'
                                    }
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
                            selectedPlanLocal === plan.id
                              ? 'bg-[#FF6500] hover:bg-[#FF6500]/90 text-white'
                              : plan.id === 'enterprise'
                                ? 'bg-white text-[#0E093D] hover:bg-gray-100'
                                : 'bg-[#0E093D] hover:bg-[#0E093D]/90 text-white'
                          }`}
                          onClick={e => {
                            e.stopPropagation();
                            handleSelectPlan(plan.id);
                          }}
                        >
                          {selectedPlanLocal === plan.id
                            ? 'Selected'
                            : plan.id === 'enterprise'
                              ? 'Contact Sales'
                              : 'Select Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 5: Review & Confirm */}
              {step === 5 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                      <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Selected Plan</h4>
                      <p className="text-gray-700 font-medium">
                        {plans.find(p => p.id === selectedPlanLocal)?.name} -{' '}
                        {plans.find(p => p.id === selectedPlanLocal)?.price}
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Organization</h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-medium">{formData.organizationName}</p>
                        <p>{formData.organizationType}</p>
                        <p>
                          {formData.address}, {formData.city}, {formData.state} {formData.postcode}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-lg text-[#0E093D] mb-4">Administrator</h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.email}</p>
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
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-4">
                          Email invitations will be sent upon account creation
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePreviousStep}
              disabled={step === 1}
              className="px-8 h-12 text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <div className="flex gap-4">
              {step === 3 && (
                <Button
                  variant="ghost"
                  onClick={handleNextStep}
                  className="px-8 h-12 text-gray-600 hover:bg-gray-100"
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={step === 5 ? handleComplete : handleNextStep}
                disabled={loading}
                className="px-8 h-12 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
              >
                {step === 5 ? (loading ? 'Creating Account...' : 'Complete Setup') : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;
