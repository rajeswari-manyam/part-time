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
}

/* =======================
   Context Interface
======================= */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

/* =======================
   Context
======================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   Provider
======================= */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // 🔄 Restore auth + user on refresh
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      console.log("🔄 Auth & user restored");
    }
  }, []);

  // ✅ Login (store user)
  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ User authenticated:", userData);
  };

  // ❌ Logout (clear everything)
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    console.log("❌ User logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   Hook
======================= */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
