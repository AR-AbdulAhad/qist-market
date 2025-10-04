"use client";
import React, { createContext, useState, useEffect } from "react";
import { decodeJwt } from "jose";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = Cookies.get("token");
      if (storedToken) {
        try {
          const decoded = decodeJwt(storedToken);
            setToken(storedToken);
            setUser({
              customerId: decoded.customerId,
              email: decoded.email,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              phone: decoded.phone,
              alternativePhone: decoded.alternativePhone,
              cnic: decoded.cnic,
            });
        } catch (error) {
          console.error("Error decoding token:", error);
          Cookies.remove("token", { path: "/" });
          setToken(null);
          setUser(null);
        }
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    setToken(null);
    setUser(null);
    toast.success("Logout Successfully!")
    setTimeout(() => {
      window.location.reload();
    }, 2000)
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const updatedUser = await res.json();
          setUser(updatedUser);
        } else {
          console.error("Failed to refresh user");
        }
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};