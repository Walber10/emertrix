import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank you for your payment!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Your subscription is now active. You can continue onboarding by creating your first
          facility, or skip to your dashboard.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            className="w-full bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
            onClick={() => navigate('/facility-setup')}
          >
            Create Facility
          </Button>
          <Button
            className="w-full bg-[#0E093D] hover:bg-[#0E093D]/90 text-white"
            onClick={() => navigate('/organization-dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
