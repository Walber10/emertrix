import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Edit,
  Trash2,
  Building2,
  Map,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { AddPersonModal } from '@/components/AddPersonModal';
import { EditPersonModal } from '@/components/EditPersonModal';

const People = () => {
  const navigate = useNavigate();
  const { appData, removeUser, getAvailableSeats } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all-roles');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>(null);

  useEffect(() => {
    if (!appData.isInitialized || !appData.organization || appData.planLimits.seats === 0) {
      navigate('/account-setup');
      return;
    }
  }, [appData.isInitialized, appData.organization, appData.planLimits.seats, navigate]);

  const { users, facilities } = appData;
  const availableSeats = getAvailableSeats();

  const getUserAssignments = (userId: string) => {
    const userFacilities = facilities.filter(facility =>
      facility.assignedOccupantIds.includes(userId),
    );

    const assignments = userFacilities.map(facility => {
      const userMicrosites =
        facility.microsites?.filter(microsite => microsite.occupants?.includes(userId)) || [];

      return {
        facility,
        microsites: userMicrosites,
      };
    });

    return assignments;
  };

  const filteredPeople = users
    .filter(person => {
      const matchesSearch =
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterRole === 'all-roles' || person.role === filterRole;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      if (sortBy === 'date')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const getStatusColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-green-100 text-green-800';
      case 'point-of-contact':
        return 'bg-blue-100 text-blue-800';
      case 'occupant':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = (id: string) => {
    removeUser(id);
  };

  const handleEditUser = (person: any) => {
    setEditingPerson(person);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPerson(null);
  };

  const metrics = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    pointsOfContact: users.filter(u => u.role === 'point-of-contact').length,
    occupants: users.filter(u => u.role === 'occupant').length,
    availableSeats: availableSeats,
  };

  const EmptyPeopleState = () => (
    <Card className="text-center py-16">
      <CardContent>
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No People Added Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start building your emergency management team by adding people to your organization. You
          can assign roles and manage emergency responsibilities.
        </p>
        <Button
          size="lg"
          className="flex items-center gap-2 mx-auto bg-black hover:bg-gray-800 text-white"
          onClick={() => setIsAddModalOpen(true)}
          disabled={availableSeats <= 0}
        >
          <UserPlus className="h-5 w-5" />
          Add Your First Person
        </Button>
        {availableSeats <= 0 && (
          <p className="text-sm text-red-600 mt-2">No available seats. Please upgrade your plan.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">People Overview</h1>
          <p className="text-gray-600 mt-2">
            Organisational-level overview of all occupants and their assignments
          </p>
        </div>
        {users.length > 0 && (
          <Button
            className="bg-black hover:bg-gray-800 text-white"
            onClick={() => setIsAddModalOpen(true)}
            disabled={availableSeats <= 0}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Person ({availableSeats} seats available)
          </Button>
        )}
      </div>

      {users.length === 0 ? (
        <EmptyPeopleState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.total}</p>
                    <p className="text-sm text-gray-600">Total People</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">A</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.admins}</p>
                    <p className="text-sm text-gray-600">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">P</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.pointsOfContact}</p>
                    <p className="text-sm text-gray-600">Points of Contact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">O</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.occupants}</p>
                    <p className="text-sm text-gray-600">Occupants</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-8 w-8 text-emertrix-orange" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.availableSeats}</p>
                    <p className="text-sm text-gray-600">Available Seats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search people by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-roles">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="point-of-contact">Point of Contact</SelectItem>
                      <SelectItem value="occupant">Occupant</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="date">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>People Directory</CardTitle>
              <CardDescription>
                View all occupants with their contact info, assigned facilities, microsites, and
                roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPeople.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No people found matching your criteria</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredPeople.map(person => {
                    const assignments = getUserAssignments(person._id);

                    return (
                      <div
                        key={person._id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">
                                {person.name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900">{person.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{person.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{person.phone}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getStatusColor(person.role)}>
                                  {person.role.charAt(0).toUpperCase() +
                                    person.role.slice(1).replace('-', ' ')}
                                </Badge>
                              </div>

                              {assignments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm font-medium text-gray-700">Assignments:</p>
                                  {assignments.map(assignment => (
                                    <div
                                      key={assignment.facility._id}
                                      className="pl-2 border-l-2 border-blue-200"
                                    >
                                      <div className="flex items-center space-x-2 text-sm">
                                        <Building2 className="h-3 w-3 text-blue-600" />
                                        <span className="font-medium text-blue-600">
                                          {assignment.facility.name}
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <MapPin className="h-3 w-3 text-gray-500" />
                                        <span className="text-gray-600 truncate">
                                          {assignment.facility.address}
                                        </span>
                                      </div>
                                      {assignment.microsites.length > 0 && (
                                        <div className="ml-4 mt-1">
                                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                                            <Map className="h-3 w-3" />
                                            <span>
                                              Microsites:{' '}
                                              {assignment.microsites.map(m => m.name).join(', ')}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditUser(person)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(person._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Added: {person.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <AddPersonModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditPersonModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        person={editingPerson}
      />
    </div>
  );
};

export default People;
