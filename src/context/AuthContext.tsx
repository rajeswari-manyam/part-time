import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* =======================
   User Interface
======================= */
interface User {
  _id: string;
  phone: string;
  name?: string;
  latitude?: string;
  longitude?: string;
  isVerified: boolean;
  role?: 'user' | 'worker'; // Add this line
}
/* =======================
   Context Interface
======================= */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

/* =======================
   Context
======================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   Provider
======================= */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore auth on refresh / reopen
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log("🔄 User restored:", parsedUser);
      }
    } catch (error) {
      console.error("❌ Failed to restore auth:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("✅ User logged in");
  };

  // ❌ Logout (ONLY when user clicks logout)
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    console.log("❌ User logged out");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* =======================
   Hook
======================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
