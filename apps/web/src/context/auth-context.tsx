"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ROLE_DISPLAY_NAME } from "@nusakerja/auth";

export type UserRole =
  | "employee"
  | "manager"
  | "hr_admin"
  | "client_admin"
  | "reseller_admin"
  | "super_admin";

/** UI mode — does NOT change authorization role. */
export type ShellMode = "my_work" | "manage";

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
  /** Login / session restore only — not for privilege switching. */
  loginAs: (role: UserRole, email?: string) => void;
  shellMode: ShellMode;
  setShellMode: (mode: ShellMode) => void;
  canManage: boolean;
  /** True when My Work shell is active (pure employee, or Admin/HR/Manager in self-service). */
  isEmployee: boolean;
  isManager: boolean;
  /** True when session role is HR or Company Admin (capability hint — still gate with shellMode for nav). */
  isHrAdmin: boolean;
  isCompanyAdmin: boolean;
  isSuperAdmin: boolean;
  isCa: boolean;
  roleLabel: string;
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
  manager: {
    id: "usr-mgr",
    name: "Rina Manager",
    email: "manager@nusantara.co.id",
    role: "manager",
    designation: "Team Manager",
    department: "Operations",
    companyName: "PT Nusantara Utama",
    avatarText: "RM",
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
    designation: "Company Admin",
    department: "Executive & Admin",
    companyName: "PT Nusantara Utama",
    avatarText: "CA",
    isFirstLogin: false,
  },
  reseller_admin: {
    id: "usr-ca",
    name: "CA Demo Operator",
    email: "ca@nusakerja.id",
    role: "reseller_admin",
    designation: "Chartered Accountant",
    department: "KAP Portfolio",
    companyName: "KAP Demo NusaKerja",
    avatarText: "CA",
    isFirstLogin: false,
  },
  super_admin: {
    id: "usr-004",
    name: "Sourabh (Platform SuperAdmin)",
    email: "srksourabh@gmail.com",
    role: "super_admin",
    designation: "NusaKerja Global SaaS Admin",
    department: "Platform Engineering",
    companyName: "NusaKerja Global",
    avatarText: "SA",
    isFirstLogin: false,
  },
};

const ALL_ROLES: UserRole[] = [
  "employee",
  "manager",
  "hr_admin",
  "client_admin",
  "reseller_admin",
  "super_admin",
];

function canUseManagePortal(role: UserRole): boolean {
  return role === "client_admin" || role === "hr_admin" || role === "manager";
}

const AuthContext = createContext<AuthContextType>({
  role: "employee",
  user: defaultProfiles.employee,
  loginAs: () => {},
  shellMode: "my_work",
  setShellMode: () => {},
  canManage: false,
  isEmployee: true,
  isManager: false,
  isHrAdmin: false,
  isCompanyAdmin: false,
  isSuperAdmin: false,
  isCa: false,
  roleLabel: "Employee",
  mustChangePassword: false,
  completeFirstTimePasswordChange: async () => true,
  sendPasswordResetEmail: async () => ({ success: true, message: "" }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("employee");
  const [shellMode, setShellModeState] = useState<ShellMode>("my_work");
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(defaultProfiles.employee);

  useEffect(() => {
    localStorage.removeItem("nusakerja_user_role");

    const savedRole = localStorage.getItem("nusakerja_session_role") as UserRole | null;
    if (savedRole && ALL_ROLES.includes(savedRole)) {
      setRoleState(savedRole);
      setActiveProfile(defaultProfiles[savedRole]);
      const savedMode = localStorage.getItem("nusakerja_shell_mode") as ShellMode | null;
      if (canUseManagePortal(savedRole) && (savedMode === "my_work" || savedMode === "manage")) {
        setShellModeState(savedMode);
      } else {
        setShellModeState(canUseManagePortal(savedRole) ? "manage" : "my_work");
      }
    }

    if (localStorage.getItem("nusakerja_first_login") === "true") {
      setMustChangePassword(true);
    }
  }, []);

  const loginAs = (newRole: UserRole, email?: string) => {
    setRoleState(newRole);
    localStorage.setItem("nusakerja_session_role", newRole);
    setActiveProfile({
      ...defaultProfiles[newRole],
      email: email || defaultProfiles[newRole].email,
      role: newRole,
    });
    const nextMode: ShellMode = canUseManagePortal(newRole) ? "manage" : "my_work";
    setShellModeState(nextMode);
    localStorage.setItem("nusakerja_shell_mode", nextMode);
  };

  const setShellMode = (mode: ShellMode) => {
    if (!canUseManagePortal(role)) return;
    setShellModeState(mode);
    localStorage.setItem("nusakerja_shell_mode", mode);
  };

  const completeFirstTimePasswordChange = async (_newPassword: string): Promise<boolean> => {
    localStorage.setItem("nusakerja_first_login", "false");
    setMustChangePassword(false);
    setActiveProfile((prev) => ({ ...prev, isFirstLogin: false }));
    return true;
  };

  const sendPasswordResetEmail = async (email: string) => ({
    success: true,
    message: `Password reset instructions were sent to ${email}.`,
  });

  const canManage = canUseManagePortal(role);
  const isEmployee = role === "employee" || (canManage && shellMode === "my_work");
  const isManager = role === "manager";
  const isHrAdmin = role === "hr_admin" || role === "client_admin";
  const isCompanyAdmin = role === "client_admin";
  const isSuperAdmin = role === "super_admin";
  const isCa = role === "reseller_admin";
  const roleLabel = ROLE_DISPLAY_NAME[role] ?? role;

  return (
    <AuthContext.Provider
      value={{
        role,
        user: activeProfile,
        loginAs,
        shellMode,
        setShellMode,
        canManage,
        isEmployee,
        isManager,
        isHrAdmin,
        isCompanyAdmin,
        isSuperAdmin,
        isCa,
        roleLabel,
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
