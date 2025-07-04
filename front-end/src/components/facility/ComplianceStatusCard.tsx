
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComplianceStatusCardProps {
  compliancePercentage: number;
}

const ComplianceStatusCard = ({ compliancePercentage }: ComplianceStatusCardProps) => {
  const getStatusColor = () => {
    if (compliancePercentage >= 80) return 'bg-green-500';
    if (compliancePercentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (compliancePercentage >= 80) return 'Compliant';
    if (compliancePercentage >= 50) return 'At Risk';
    return 'At Risk';
  };

  const getTextColor = () => {
    if (compliancePercentage >= 80) return 'text-green-600';
    if (compliancePercentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg ${getStatusColor()}`}>
            {compliancePercentage}%
          </div>
          <p className={`font-medium ${getTextColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceStatusCard;
