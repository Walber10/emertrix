import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccountSetupData } from '@/types';

interface UserDetailsStepProps {
  formData: AccountSetupData;
  updateFormData: (field: keyof AccountSetupData, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserDetailsStep = ({
  formData,
  updateFormData,
  handleFileChange,
}: UserDetailsStepProps) => {
  return (
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
          <Label htmlFor="confirmPassword" className="text-[#0E093D] font-light text-lg">
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
            onChange={handleFileChange}
            className="mt-2 h-12 border-gray-300 focus:border-[#FF6500] focus:ring-[#FF6500]"
          />
        </div>
      </div>
    </div>
  );
};
