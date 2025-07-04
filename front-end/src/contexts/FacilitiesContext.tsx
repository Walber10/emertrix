
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Microsite {
  id: string;
  name: string;
  address: string;
}

export interface FacilityData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phoneNumber: string;
  maxOccupancy: string;
  facilityType: string;
  pointOfContact: string;
  assignedOccupants: string[]; // Array of user IDs
  microsites: Microsite[];
  createdAt: Date;
}

interface FacilitiesContextType {
  facilities: FacilityData[];
  addFacility: (facility: Omit<FacilityData, 'id' | 'createdAt'>) => FacilityData;
  updateFacility: (id: string, updates: Partial<Omit<FacilityData, 'id' | 'createdAt'>>) => void;
  removeFacility: (id: string) => void;
  getFacilityById: (id: string) => FacilityData | undefined;
  assignOccupantToFacility: (facilityId: string, userId: string) => void;
  removeOccupantFromFacility: (facilityId: string, userId: string) => void;
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(undefined);

export const FacilitiesProvider = ({ children }: { children: ReactNode }) => {
  // Remove localStorage persistence - this will come from API in the future
  const [facilities, setFacilities] = useState<FacilityData[]>([]);

  const addFacility = (facilityData: Omit<FacilityData, 'id' | 'createdAt'>): FacilityData => {
    const newFacility: FacilityData = {
      ...facilityData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFacilities(prev => [...prev, newFacility]);
    // TODO: Replace with API call to create facility
    return newFacility;
  };

  const updateFacility = (id: string, updates: Partial<Omit<FacilityData, 'id' | 'createdAt'>>) => {
    setFacilities(prev => prev.map(facility => 
      facility.id === id ? { ...facility, ...updates } : facility
    ));
    // TODO: Replace with API call to update facility
  };

  const removeFacility = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.id !== id));
    // TODO: Replace with API call to delete facility
  };

  const getFacilityById = (id: string): FacilityData | undefined => {
    return facilities.find(facility => facility.id === id);
  };

  const assignOccupantToFacility = (facilityId: string, userId: string) => {
    setFacilities(prev => prev.map(facility => 
      facility.id === facilityId 
        ? { 
            ...facility, 
            assignedOccupants: facility.assignedOccupants.includes(userId) 
              ? facility.assignedOccupants 
              : [...facility.assignedOccupants, userId]
          }
        : facility
    ));
    // TODO: Replace with API call to assign occupant
  };

  const removeOccupantFromFacility = (facilityId: string, userId: string) => {
    setFacilities(prev => prev.map(facility => 
      facility.id === facilityId 
        ? { 
            ...facility, 
            assignedOccupants: facility.assignedOccupants.filter(id => id !== userId)
          }
        : facility
    ));
    // TODO: Replace with API call to remove occupant
  };

  return (
    <FacilitiesContext.Provider value={{
      facilities,
      addFacility,
      updateFacility,
      removeFacility,
      getFacilityById,
      assignOccupantToFacility,
      removeOccupantFromFacility
    }}>
      {children}
    </FacilitiesContext.Provider>
  );
};

export const useFacilities = () => {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilitiesProvider');
  }
  return context;
};
