import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FacilityHeaderProps {
  facilityName: string;
  facilityAddress: string;
  facilityEmail?: string;
  facilityPhone?: string;
}

const FacilityHeader = ({
  facilityName,
  facilityAddress,
  facilityEmail,
  facilityPhone,
}: FacilityHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="items-center gap-4">
      <Button variant="ghost" onClick={() => navigate('/facilities')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">{facilityName}</h1>
        <p className="text-gray-600">{facilityAddress}</p>
        <div className="flex items-center gap-4 mt-2">
          {facilityEmail && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{facilityEmail}</span>
            </div>
          )}
          {facilityPhone && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{facilityPhone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityHeader;
