import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Failed</h1>
        <p className="text-lg text-gray-700 mb-8">
          Your payment was not successful. You can try again, or continue with the free plan for
          now.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            className="w-full bg-[#FF6500] hover:bg-[#FF6500]/90 text-white"
            onClick={() => navigate('/account-setup')}
          >
            Try Payment Again
          </Button>
          <Button
            className="w-full bg-[#0E093D] hover:bg-[#0E093D]/90 text-white"
            onClick={() => navigate('/organization-dashboard')}
          >
            Continue with Free Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
