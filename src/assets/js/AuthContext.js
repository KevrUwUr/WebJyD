import React, { useState, useContext } from "react";

export const AuthContext = React.createContext({
  accessToken: null,
  setAccessToken: null,
  refreshToken: null,
  setRefreshToken: null,
});

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const [refreshToken, setRefreshToken] = useState("");

  
  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
