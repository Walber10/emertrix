import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  User,
  Facility,
  Microsite,
  EmergencyPlan,
  EmergencyProcedure,
  TrainingCourse,
  Exercise,
  ExerciseReview,
  EmergencyCommittee,
  EmergencyControlOrganization,
} from '@/types';

interface AppContextData {
  organization: Organization | null;
  users: User[];
  facilities: Facility[];
  emergencyPlans: EmergencyPlan[];
  emergencyProcedures: EmergencyProcedure[];
  trainingCourses: TrainingCourse[];
  exercises: Exercise[];
  exerciseReviews: ExerciseReview[];
  committees: EmergencyCommittee[];
  controlOrganizations: EmergencyControlOrganization[];
  isInitialized: boolean;
  planLimits: {
    seats: number;
    facilities: number;
  };
}

interface AppContextType {
  appData: AppContextData;
  hasCompleted: (step: string) => boolean;
  completeStep: (step: string) => void;
  setOrganization: (organization: Organization) => void;
  addUser: (user: Omit<User, '_id' | 'createdAt'>) => User;
  updateUser: (userId: string, userData: Partial<User>) => void;
  removeUser: (userId: string) => void;
  addFacility: (facilityData: Omit<Facility, '_id' | 'createdAt'>) => Facility;
  updateFacility: (facility: Facility) => void;
  removeFacility: (facilityId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
  getFacilityById: (facilityId: string) => Facility | undefined;
  assignOccupantToFacility: (facilityId: string, userId: string) => void;
  removeOccupantFromFacility: (facilityId: string, userId: string) => void;
  canCreateMoreFacilities: () => boolean;
  getMaxFacilities: () => number;
  getTotalSeats: () => number;
  getUsedSeats: () => number;
  getAvailableSeats: () => number;
  canCreateNewOccupant: () => boolean;
  addTrainingCourse: (trainingCourse: Omit<TrainingCourse, '_id' | 'createdAt'>) => void;
  updateTrainingCourse: (trainingCourse: TrainingCourse) => void;
  getTrainingCoursesByFacility: (facilityId: string) => TrainingCourse[];
  addEmergencyPlan: (plan: Omit<EmergencyPlan, '_id' | 'createdAt'>) => void;
  updateEmergencyPlan: (plan: EmergencyPlan) => void;
  getEmergencyPlanByFacilityId: (facilityId: string) => EmergencyPlan | undefined;
  addEmergencyProcedure: (procedure: Omit<EmergencyProcedure, '_id' | 'createdAt'>) => void;
  updateEmergencyProcedure: (procedure: EmergencyProcedure) => void;
  addExercise: (exercise: Omit<Exercise, '_id' | 'createdAt'>) => void;
  updateExercise: (exercise: Exercise) => void;
  getExercisesByFacility: (facilityId: string) => Exercise[];
  addExerciseReview: (review: Omit<ExerciseReview, '_id' | 'createdAt'>) => void;
  updateExerciseReview: (review: ExerciseReview) => void;
  getExerciseReviewByExerciseId: (exerciseId: string) => ExerciseReview | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export useApp as an alias for useAppContext for backward compatibility
export const useApp = useAppContext;

// Get plan limits from localStorage onboarding data
const getPlanLimitsFromStorage = () => {
  try {
    const stored = localStorage.getItem('emertrix-onboarding-v1');
    if (stored) {
      const onboarding = JSON.parse(stored);
      if (onboarding.plan) {
        return {
          seats: onboarding.plan.seats,
          facilities: onboarding.plan.facilities,
        };
      }
    }
  } catch (error) {
    console.error('Error getting plan limits:', error);
  }
  return { seats: 0, facilities: 0 };
};

// Initialize organization data from onboarding localStorage
const getInitialOrganizationFromStorage = () => {
  try {
    const stored = localStorage.getItem('emertrix-onboarding-v1');
    if (stored) {
      const onboarding = JSON.parse(stored);
      if (onboarding.organization) {
        return {
          _id: Date.now().toString(),
          ...onboarding.organization,
          createdAt: new Date(),
        } as Organization;
      }
    }
  } catch (error) {
    console.error('Error getting organization from storage:', error);
  }
  return null;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppContextData>(() => {
    const planLimits = getPlanLimitsFromStorage();
    const organization = getInitialOrganizationFromStorage();

    return {
      organization,
      users: [],
      facilities: [],
      emergencyPlans: [],
      emergencyProcedures: [],
      trainingCourses: [],
      exercises: [],
      exerciseReviews: [],
      committees: [],
      controlOrganizations: [],
      isInitialized: !!organization,
      planLimits,
    };
  });

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Update plan limits when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newPlanLimits = getPlanLimitsFromStorage();
      const newOrganization = getInitialOrganizationFromStorage();

      setAppData(prev => ({
        ...prev,
        planLimits: newPlanLimits,
        organization: newOrganization || prev.organization,
        isInitialized: !!(newOrganization || prev.organization),
      }));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasCompleted = (step: string) => completedSteps.includes(step);
  const completeStep = (step: string) => {
    if (!hasCompleted(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const setOrganization = (organization: Organization) => {
    setAppData(prev => ({ ...prev, organization: organization, isInitialized: true }));
  };

  const addUser = (userData: Omit<User, '_id' | 'createdAt'>) => {
    const newUser: User = {
      _id: Date.now().toString(),
      organizationId: appData.organization?._id || '',
      facilityIds: userData.facilityIds || [],
      createdAt: new Date(),
      ...userData,
    };
    setAppData(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return newUser;
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setAppData(prev => ({
      ...prev,
      users: prev.users.map(u => (u._id === userId ? { ...u, ...userData } : u)),
    }));
  };

  const removeUser = (userId: string) => {
    setAppData(prev => ({
      ...prev,
      users: prev.users.filter(user => user._id !== userId),
      facilities: prev.facilities.map(facility => ({
        ...facility,
        assignedOccupantIds: facility.assignedOccupantIds.filter(id => id !== userId),
      })),
    }));
  };

  const addFacility = (facilityData: Omit<Facility, '_id' | 'createdAt'>) => {
    const newFacility: Facility = {
      _id: Date.now().toString(),
      organizationId: appData.organization?._id || '',
      pointOfContactId: facilityData.pointOfContactId || '',
      assignedOccupantIds: facilityData.assignedOccupantIds || [],
      maxOccupancy: facilityData.maxOccupancy || 0,
      microsites: facilityData.microsites || [],
      createdAt: new Date(),
      ...facilityData,
    };

    setAppData(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));

    return newFacility;
  };

  const updateFacility = (facility: Facility) => {
    setAppData(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => (f._id === facility._id ? facility : f)),
    }));
  };

  const removeFacility = (facilityId: string) => {
    setAppData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility._id !== facilityId),
    }));
  };

  const getUserById = (userId: string) => {
    return appData.users.find(user => user._id === userId);
  };

  const getUsersByRole = (role: string) => {
    return appData.users.filter(user => user.role === role);
  };

  const getFacilityById = (facilityId: string) => {
    return appData.facilities.find(facility => facility._id === facilityId);
  };

  const assignOccupantToFacility = (facilityId: string, userId: string) => {
    setAppData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility =>
        facility._id === facilityId
          ? { ...facility, assignedOccupantIds: [...facility.assignedOccupantIds, userId] }
          : facility,
      ),
    }));
  };

  const removeOccupantFromFacility = (facilityId: string, userId: string) => {
    setAppData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility =>
        facility._id === facilityId
          ? {
              ...facility,
              assignedOccupantIds: facility.assignedOccupantIds.filter(id => id !== userId),
            }
          : facility,
      ),
    }));
  };

  const canCreateMoreFacilities = () => {
    return appData.facilities.length < appData.planLimits.facilities;
  };

  const getTotalSeats = () => {
    return appData.planLimits.seats;
  };

  // Fixed the seat counting logic - only count occupants and point-of-contact users
  const getUsedSeats = () => {
    return appData.users.filter(
      user => user.role === 'occupant' || user.role === 'point-of-contact',
    ).length;
  };

  const getAvailableSeats = () => {
    const totalSeats = getTotalSeats();
    const usedSeats = getUsedSeats();
    console.log('Seat calculation:', { totalSeats, usedSeats, available: totalSeats - usedSeats });
    return Math.max(0, totalSeats - usedSeats);
  };

  const canCreateNewOccupant = () => {
    const available = getAvailableSeats();
    console.log('Can create new occupant?', available > 0, 'Available seats:', available);
    return available > 0;
  };

  const addTrainingCourse = (trainingCourse: Omit<TrainingCourse, '_id' | 'createdAt'>) => {
    const newTrainingCourse: TrainingCourse = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      ...trainingCourse,
    };
    setAppData(prev => ({
      ...prev,
      trainingCourses: [...prev.trainingCourses, newTrainingCourse],
    }));
  };

  const updateTrainingCourse = (trainingCourse: TrainingCourse) => {
    setAppData(prev => ({
      ...prev,
      trainingCourses: prev.trainingCourses.map(t =>
        t._id === trainingCourse._id ? trainingCourse : t,
      ),
    }));
  };

  const getTrainingCoursesByFacility = (facilityId: string) => {
    return appData.trainingCourses.filter(course => course.facilityId === facilityId);
  };

  const addEmergencyPlan = (plan: Omit<EmergencyPlan, '_id' | 'createdAt'>) => {
    const newPlan: EmergencyPlan = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      ...plan,
    };
    setAppData(prev => ({ ...prev, emergencyPlans: [...prev.emergencyPlans, newPlan] }));
  };

  const updateEmergencyPlan = (plan: EmergencyPlan) => {
    setAppData(prev => ({
      ...prev,
      emergencyPlans: prev.emergencyPlans.map(p => (p._id === plan._id ? plan : p)),
    }));
  };

  const getEmergencyPlanByFacilityId = (facilityId: string) => {
    return appData.emergencyPlans.find(plan => plan.facilityId === facilityId);
  };

  const addEmergencyProcedure = (procedure: Omit<EmergencyProcedure, '_id' | 'createdAt'>) => {
    const newProcedure: EmergencyProcedure = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      ...procedure,
    };
    setAppData(prev => ({
      ...prev,
      emergencyProcedures: [...prev.emergencyProcedures, newProcedure],
    }));
  };

  const updateEmergencyProcedure = (procedure: EmergencyProcedure) => {
    setAppData(prev => ({
      ...prev,
      emergencyProcedures: prev.emergencyProcedures.map(p =>
        p._id === procedure._id ? procedure : p,
      ),
    }));
  };

  const addExercise = (exercise: Omit<Exercise, '_id' | 'createdAt'>) => {
    const newExercise: Exercise = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      ...exercise,
    };
    setAppData(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
  };

  const updateExercise = (exercise: Exercise) => {
    setAppData(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => (e._id === exercise._id ? exercise : e)),
    }));
  };

  const getExercisesByFacility = (facilityId: string) => {
    return appData.exercises.filter(exercise => exercise.facilityId === facilityId);
  };

  const addExerciseReview = (review: Omit<ExerciseReview, '_id' | 'createdAt'>) => {
    const newReview: ExerciseReview = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      ...review,
    };
    setAppData(prev => ({ ...prev, exerciseReviews: [...prev.exerciseReviews, newReview] }));
  };

  const updateExerciseReview = (review: ExerciseReview) => {
    setAppData(prev => ({
      ...prev,
      exerciseReviews: prev.exerciseReviews.map(r => (r._id === review._id ? review : r)),
    }));
  };

  const getExerciseReviewByExerciseId = (exerciseId: string) => {
    return appData.exerciseReviews.find(review => review.exerciseId === exerciseId);
  };

  return (
    <AppContext.Provider
      value={{
        appData,
        hasCompleted,
        completeStep,
        setOrganization,
        addUser,
        updateUser,
        removeUser,
        addFacility,
        updateFacility,
        removeFacility,
        getUserById,
        getUsersByRole,
        getFacilityById,
        assignOccupantToFacility,
        removeOccupantFromFacility,
        canCreateMoreFacilities,
        getMaxFacilities: () => appData.planLimits.facilities,
        getTotalSeats,
        getUsedSeats,
        getAvailableSeats,
        canCreateNewOccupant,
        addTrainingCourse,
        updateTrainingCourse,
        getTrainingCoursesByFacility,
        addEmergencyPlan,
        updateEmergencyPlan,
        getEmergencyPlanByFacilityId,
        addEmergencyProcedure,
        updateEmergencyProcedure,
        addExercise,
        updateExercise,
        getExercisesByFacility,
        addExerciseReview,
        updateExerciseReview,
        getExerciseReviewByExerciseId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
export type { User };
