import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser.userId) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser({
            userId: data.userId,
            email: data.email,
            name: data.name,
            profileImageUrl: data.profileImageUrl,
        });
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
        setUser({
            userId: data.userId,
            email: data.email,
            name: data.name,
            profileImageUrl: data.profileImageUrl,
        });
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfileImage = (imageUrl) => {
        authService.updateProfileImage(imageUrl);
        setUser(prev => ({ ...prev, profileImageUrl: imageUrl }));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfileImage,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
