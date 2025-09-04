import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode"; // fixed import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            try {
                return jwtDecode(savedToken);
            } catch {
                localStorage.removeItem("token");
            }
        }
        return null;
    });
    const [hasScore, setHasScore] = useState(
        localStorage.getItem("hasScore") === "true"
    );

    const login = (newToken, scoreFlag) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(jwtDecode(newToken));
        setHasScore(scoreFlag);
        localStorage.setItem("hasScore", scoreFlag); // persist
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("hasScore");
        setToken(null);
        setUser(null);
        setHasScore(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, hasScore, setHasScore }}>
            {children}
        </AuthContext.Provider>
    );
};
