import { createContext, useContext, useRef, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const isLoggingOut = useRef(false);

    const login = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    /**
     * forceLogout — called by the Axios interceptor on auth errors.
     * The `isLoggingOut` guard prevents multiple simultaneous in-flight
     * requests from triggering several logout cycles at once.
     * Returns true if this call actually triggered the logout,
     * false if one was already in progress.
     */
    const forceLogout = () => {
        if (isLoggingOut.current) return false;
        isLoggingOut.current = true;
        localStorage.removeItem("token");
        setToken(null);
        // Reset the guard after a short delay so a fresh login can work.
        setTimeout(() => {
            isLoggingOut.current = false;
        }, 2000);
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                forceLogout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);