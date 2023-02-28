import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, setAuth } from "../helpers/auth";


const AuthContext = createContext({ isAuthenticated: false, user: null, token: null });


const lsItem = getAuth();
const defaultData = lsItem ? JSON.parse(lsItem) : { isAuthenticated: false, user: null, token: null };

export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState(defaultData);
  const [customLoading, setLoading] = useState({ show: false, message: "" });
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", severity: "success" });

  useEffect(() => {
    setAuth(JSON.stringify(authInfo));
  }, [authInfo]);

  return <AuthContext.Provider value={{
    customLoading,
    setLoading,
    user: authInfo.user,
    token: authInfo.token,
    isAuthenticated: authInfo.isAuthenticated,
    setAuthInfo,
    customAlert,
    setCustomAlert
  }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
