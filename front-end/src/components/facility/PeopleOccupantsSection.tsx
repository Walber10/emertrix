
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Phone, Mail, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";

interface PeopleOccupantsSectionProps {
  assignedOccupants: User[];
  occupantCount: number;
  onRemoveOccupant: (userId: string) => void;
}

const PeopleOccupantsSection = ({ 
  assignedOccupants, 
  occupantCount, 
  onRemoveOccupant 
}: PeopleOccupantsSectionProps) => {
  const navigate = useNavigate();

  const getStatusColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-green-100 text-green-800";
      case "point-of-contact": return "bg-blue-100 text-blue-800";
      case "occupant": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>People / Occupants ({occupantCount})</CardTitle>
            <p className="text-sm text-gray-600 mt-1">People assigned to this facility</p>
          </div>
          <Button 
            size="sm" 
            className="bg-black hover:bg-gray-800 text-white"
            onClick={() => navigate('/people')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {assignedOccupants.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No occupants assigned</h3>
            <p className="text-sm text-gray-500 mb-4">Add people to get started with emergency planning</p>
            <Button 
              size="sm" 
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => navigate('/people')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add People
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedOccupants.map((person) => (
              <div key={person._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{person.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{person.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(person.role)}>
                          {person.role.charAt(0).toUpperCase() + person.role.slice(1).replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onRemoveOccupant(person._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Added: {person.createdAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeopleOccupantsSection;
