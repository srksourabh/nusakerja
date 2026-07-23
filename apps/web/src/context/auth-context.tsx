"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "employee" | "hr_admin" | "client_admin" | "super_admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  companyName: string;
  avatarText: string;
  isFirstLogin: boolean;
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole, email?: string) => void;
  isEmployee: boolean;
  isHrAdmin: boolean;
  mustChangePassword: boolean;
  completeFirstTimePasswordChange: (newPassword: string) => Promise<boolean>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message: string }>;
}

const defaultProfiles: Record<UserRole, UserProfile> = {
  employee: {
    id: "usr-001",
    name: "Budi Santoso",
    email: "budi.santoso@nusantara.co.id",
    role: "employee",
    designation: "Senior Backend Engineer",
    department: "Technology & Systems",
    companyName: "PT Nusantara Utama",
    avatarText: "BS",
    isFirstLogin: false,
  },
  hr_admin: {
    id: "usr-002",
    name: "Bambang Prasetyo, S.H.",
    email: "bambang.hr@nusantara.co.id",
    role: "hr_admin",
    designation: "Head of HR & Industrial Relations",
    department: "Human Resources",
    companyName: "PT Nusantara Utama",
    avatarText: "BP",
    isFirstLogin: false,
  },
  client_admin: {
    id: "usr-003",
    name: "Administrator HR Master",
    email: "admin@nusantara.co.id",
    role: "client_admin",
    designation: "Client Master Administrator",
    department: "Executive & Admin",
    companyName: "PT Nusantara Utama",
    avatarText: "HR",
    isFirstLogin: false,
  },
  super_admin: {
    id: "usr-004",
    name: "Platform Super Admin",
    email: "superadmin@nusakerja.id",
    role: "super_admin",
    designation: "NusaKerja Global SaaS Admin",
    department: "Platform Engineering",
    companyName: "NusaKerja Global",
    avatarText: "SA",
    isFirstLogin: false,
  },
};

const AuthContext = createContext<AuthContextType>({
  role: "employee",
  user: defaultProfiles.employee,
  setRole: () => {},
  loginAs: () => {},
  isEmployee: true,
  isHrAdmin: false,
  mustChangePassword: false,
  completeFirstTimePasswordChange: async () => true,
  sendPasswordResetEmail: async () => ({ success: true, message: "" }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("employee");
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(defaultProfiles.employee);

  useEffect(() => {
    const savedRole = localStorage.getItem("nusakerja_user_role") as UserRole;
    const savedFirstLogin = localStorage.getItem("nusakerja_first_login");

    if (savedRole && ["employee", "hr_admin", "client_admin", "super_admin"].includes(savedRole)) {
      setRoleState(savedRole);
      setActiveProfile(defaultProfiles[savedRole]);
    } else {
      setRoleState("employee");
      setActiveProfile(defaultProfiles.employee);
    }

    if (savedFirstLogin === "true") {
      setMustChangePassword(true);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("nusakerja_user_role", newRole);
    setActiveProfile(defaultProfiles[newRole]);
  };

  const loginAs = (newRole: UserRole) => {
    setRole(newRole);
  };

  const completeFirstTimePasswordChange = async (newPassword: string): Promise<boolean> => {
    localStorage.setItem("nusakerja_first_login", "false");
    setMustChangePassword(false);
    setActiveProfile((prev) => ({ ...prev, isFirstLogin: false }));
    return true;
  };

  const sendPasswordResetEmail = async (email: string) => {
    return {
      success: true,
      message: `Tautan instruksi reset kata sandi telah dikirimkan ke email ${email}. Silakan periksa kotak masuk/spam Anda.`,
    };
  };

  const isEmployee = role === "employee";
  const isHrAdmin = role === "hr_admin" || role === "client_admin" || role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        role,
        user: activeProfile,
        setRole,
        loginAs,
        isEmployee,
        isHrAdmin,
        mustChangePassword,
        completeFirstTimePasswordChange,
        sendPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
