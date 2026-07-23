"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "employee" | "hr_admin" | "client_admin" | "super_admin";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  companyName: string;
  avatarText: string;
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole, email?: string) => void;
  isEmployee: boolean;
  isHrAdmin: boolean;
}

const defaultProfiles: Record<UserRole, UserProfile> = {
  employee: {
    name: "Budi Santoso",
    email: "budi.santoso@nusantara.co.id",
    role: "employee",
    designation: "Senior Backend Engineer",
    department: "Technology & Systems",
    companyName: "PT Nusantara Utama",
    avatarText: "BS",
  },
  hr_admin: {
    name: "Bambang Prasetyo, S.H.",
    email: "bambang.hr@nusantara.co.id",
    role: "hr_admin",
    designation: "Head of HR & Industrial Relations",
    department: "Human Resources",
    companyName: "PT Nusantara Utama",
    avatarText: "BP",
  },
  client_admin: {
    name: "Administrator HR Master",
    email: "admin@nusantara.co.id",
    role: "client_admin",
    designation: "Client Master Administrator",
    department: "Executive & Admin",
    companyName: "PT Nusantara Utama",
    avatarText: "HR",
  },
  super_admin: {
    name: "Platform Super Admin",
    email: "superadmin@nusakerja.id",
    role: "super_admin",
    designation: "NusaKerja Global SaaS Admin",
    department: "Platform Engineering",
    companyName: "NusaKerja Global",
    avatarText: "SA",
  },
};

const AuthContext = createContext<AuthContextType>({
  role: "employee",
  user: defaultProfiles.employee,
  setRole: () => {},
  loginAs: () => {},
  isEmployee: true,
  isHrAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("employee");

  useEffect(() => {
    const savedRole = localStorage.getItem("nusakerja_user_role") as UserRole;
    if (savedRole && ["employee", "hr_admin", "client_admin", "super_admin"].includes(savedRole)) {
      setRoleState(savedRole);
    } else {
      // Default to employee if none specified
      setRoleState("employee");
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("nusakerja_user_role", newRole);
  };

  const loginAs = (newRole: UserRole) => {
    setRole(newRole);
  };

  const isEmployee = role === "employee";
  const isHrAdmin = role === "hr_admin" || role === "client_admin" || role === "super_admin";
  const user = defaultProfiles[role] || defaultProfiles.employee;

  return (
    <AuthContext.Provider value={{ role, user, setRole, loginAs, isEmployee, isHrAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
