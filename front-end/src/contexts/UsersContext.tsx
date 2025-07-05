import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'point-of-contact' | 'occupant';
  createdAt: Date;
}

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  removeUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: User['role']) => User[];
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  // Remove localStorage persistence - this will come from API in the future
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    // TODO: Replace with API call to create user
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setUsers(prev => prev.map(user => (user.id === id ? { ...user, ...updates } : user)));
    // TODO: Replace with API call to update user
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    // TODO: Replace with API call to delete user
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: User['role']): User[] => {
    return users.filter(user => user.role === role);
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        removeUser,
        getUserById,
        getUsersByRole,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
