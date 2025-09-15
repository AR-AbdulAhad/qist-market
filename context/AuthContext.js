// "use client";
// import React, { createContext, useState, useEffect } from "react";
// import jwtDecode from "jwt-decode";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     // Check sessionStorage for token
//     const storedToken = sessionStorage.getItem("token");
//     if (storedToken) {
//       try {
//         setToken(storedToken);
//         // Decode token to get user data
//         const decoded = jwtDecode(storedToken);
//         setUser({
//           customerId: decoded.customerId,
//           email: decoded.email,
//           // Add other fields if included in token payload
//         });
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         sessionStorage.removeItem("token");
//       }
//     }
//   }, []);

//   const login = (newToken) => {
//     try {
//       // Decode token to extract user data
//       const decoded = jwtDecode(newToken);
//       sessionStorage.setItem("token", newToken);
//       setToken(newToken);
//       setUser({
//         customerId: decoded.customerId,
//         email: decoded.email,
//         // Add other fields if included in token
//       });
//     } catch (error) {
//       console.error("Invalid token:", error);
//       throw new Error("Invalid token");
//     }
//   };

//   const logout = () => {
//     sessionStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };