
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user roles
export type UserRole = "officer" | "admin" | "driver" | null;

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber?: string; // For officers
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
  isDriver: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "officer@finexpress.com",
    password: "officer123",
    name: "John Officer",
    role: "officer" as UserRole,
    badgeNumber: "OFF-12345",
  },
  {
    id: "2",
    email: "admin@finexpress.com",
    password: "admin123",
    name: "Sarah Admin",
    role: "admin" as UserRole,
  },
  {
    id: "3",
    email: "driver@example.com",
    password: "driver123",
    name: "Mike Driver",
    role: "driver" as UserRole,
  },
];

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if there's a saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("finexpress_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem("finexpress_user", JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("finexpress_user");
  };

  // Derived state
  const isAuthenticated = !!user;
  const isOfficer = user?.role === "officer";
  const isAdmin = user?.role === "admin";
  const isDriver = user?.role === "driver";

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isOfficer,
    isAdmin,
    isDriver,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
