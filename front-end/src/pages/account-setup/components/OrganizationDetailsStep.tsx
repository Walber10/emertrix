import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccountSetupData } from '@/types';
import { industries, organizationSizes } from '@/utils/account-setup.utils';

interface OrganizationDetailsStepProps {
  formData: AccountSetupData;
  updateFormData: (field: keyof AccountSetupData, value: string) => void;
}

export const OrganizationDetailsStep = ({
  formData,
  updateFormData,
}: OrganizationDetailsStepProps) => {
  return (
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
  );
};
