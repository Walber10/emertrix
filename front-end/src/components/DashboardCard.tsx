import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onButtonClick: () => void;
  status?: 'complete' | 'incomplete' | 'not-started';
}

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onButtonClick,
  status = 'not-started',
}: DashboardCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'incomplete':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'incomplete':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusDot()}`} />
        </div>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onButtonClick} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
