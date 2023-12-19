import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const initialLoggedIn = localStorage.getItem("loggedIn") === "true";

  const [token, setToken] = useState(initialToken);
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token && loggedIn) {
      localStorage.setItem("token", token);
      localStorage.setItem("loggedIn", loggedIn);
    }
  }, [token, loggedIn]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, isAuthenticated, loggedIn, setLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
