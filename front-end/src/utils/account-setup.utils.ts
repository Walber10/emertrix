import type { AccountSetupData, InvitedAdmin } from '@/types';

export enum AccountSetupStep {
  ORGANIZATION_DETAILS = 1,
  USER_DETAILS = 2,
  INVITE_ADMINS = 3,
  PLAN_SELECTION = 4,
  REVIEW_CONFIRM = 5,
}

export const DEFAULT_ACCOUNT_SETUP_DATA: AccountSetupData = {
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
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  jobTitle: '',
  userPhone: '',
  profilePicture: '',
  username: '',
};

export const DEFAULT_INVITE_DATA: InviteFormData = {
  firstName: '',
  lastName: '',
  email: '',
  jobTitle: '',
};

export const plans = [
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

export const industries = [
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

export const organizationSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export interface ValidationField {
  field: string | undefined;
  name: string;
}

export interface ValidationResult {
  field: string | undefined;
  name: string;
}

export interface InviteFormData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

export const getPlanLimits = (tier: string): { seats: number; facilities: number } => {
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

export const getStepTitle = (step: AccountSetupStep): string => {
  switch (step) {
    case AccountSetupStep.ORGANIZATION_DETAILS:
      return 'Organisation Details';
    case AccountSetupStep.USER_DETAILS:
      return 'User Details';
    case AccountSetupStep.INVITE_ADMINS:
      return 'Invite Additional Admins';
    case AccountSetupStep.PLAN_SELECTION:
      return 'Select Your Plan';
    case AccountSetupStep.REVIEW_CONFIRM:
      return 'Review & Confirm';
    default:
      return '';
  }
};

export const getStepDescription = (step: AccountSetupStep): string => {
  switch (step) {
    case AccountSetupStep.ORGANIZATION_DETAILS:
      return "Provide your organisation's details to set up its primary account.";
    case AccountSetupStep.USER_DETAILS:
      return 'User setup captures the details of the primary account holder and assigns them as the default admin for the organisation.';
    case AccountSetupStep.INVITE_ADMINS:
      return 'Optional functionality to add and invite additional admin users during setup.';
    case AccountSetupStep.PLAN_SELECTION:
      return "Choose the plan that best fits your organization's needs";
    case AccountSetupStep.REVIEW_CONFIRM:
      return 'Please review your information before completing setup.';
    default:
      return '';
  }
};

export const isLastStep = (step: AccountSetupStep): boolean => {
  return step === AccountSetupStep.REVIEW_CONFIRM;
};

export const canGoBack = (step: AccountSetupStep): boolean => {
  return step > AccountSetupStep.ORGANIZATION_DETAILS;
};

export const validateStep1Fields = (formData: AccountSetupData): ValidationResult[] => {
  const requiredFields: ValidationField[] = [
    { field: formData.organizationName, name: 'Organization Name' },
    { field: formData.address, name: 'Address' },
    { field: formData.phone, name: 'Phone Number' },
    { field: formData.industry, name: 'Industry' },
    { field: formData.organizationSize, name: 'Organization Size' },
  ];

  return requiredFields.filter(field => !field.field || field.field.trim() === '');
};

export const validateStep2Fields = (formData: AccountSetupData): ValidationResult[] => {
  const requiredUserFields: ValidationField[] = [
    { field: formData.firstName, name: 'First Name' },
    { field: formData.lastName, name: 'Last Name' },
    { field: formData.email, name: 'Email' },
    { field: formData.password, name: 'Password' },
  ];

  return requiredUserFields.filter(field => !field.field || field.field.trim() === '');
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateInviteFields = (invite: InviteFormData): string | null => {
  if (!invite.firstName || !invite.lastName || !invite.email) {
    return 'Please fill in first name, last name, and email for the admin';
  }
  return null;
};

export const checkDuplicateEmail = (email: string, existingAdmins: InvitedAdmin[]): boolean => {
  return existingAdmins.some(admin => admin.email === email);
};
