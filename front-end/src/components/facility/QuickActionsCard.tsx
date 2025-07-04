
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          className="w-full bg-black hover:bg-gray-800 text-white"
          onClick={() => navigate("/emergency-plan-setup")}
        >
          View Emergency Plan
        </Button>
        <Button variant="outline" className="w-full">
          Edit Facility
        </Button>
        <Button variant="outline" className="w-full">
          View People
        </Button>
        <Button variant="outline" className="w-full">
          Generate QR Codes
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
