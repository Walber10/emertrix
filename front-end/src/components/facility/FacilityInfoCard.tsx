
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacilityInfoCardProps {
  facilityType: string;
  occupantCount: number;
}

const FacilityInfoCard = ({ facilityType, occupantCount }: FacilityInfoCardProps) => {
  const getFacilityDescription = (type: string) => {
    switch (type) {
      case 'office': return 'Office building with multiple departments';
      case 'warehouse': return 'Storage and distribution facility';
      default: return 'Commercial facility';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900">Facility Description</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getFacilityDescription(facilityType)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Occupants</span>
            <p className="text-lg font-bold">{occupantCount} people</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Site Contact</span>
            <p className="text-sm text-gray-600">Safety Manager</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityInfoCard;
