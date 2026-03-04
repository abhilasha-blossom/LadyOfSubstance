import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    currentUser: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Load auth state from local storage on mount
        const storedToken = localStorage.getItem("ladyofsubstance_token");
        const storedUser = localStorage.getItem("ladyofsubstance_user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem("ladyofsubstance_token");
                localStorage.removeItem("ladyofsubstance_user");
            }
        }
    }, []);

    const login = (newToken: string, user: User) => {
        setToken(newToken);
        setCurrentUser(user);
        localStorage.setItem("ladyofsubstance_token", newToken);
        localStorage.setItem("ladyofsubstance_user", JSON.stringify(user));
    };

    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem("ladyofsubstance_token");
        localStorage.removeItem("ladyofsubstance_user");
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
