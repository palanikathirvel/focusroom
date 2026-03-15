import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export const useUserCache = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserCache must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userCache, setUserCache] = useState({});
    const [loading, setLoading] = useState(false);

    const loadUser = async (userId) => {
        if (!userId) return null;

        // Return cached user if available
        if (userCache[userId]) {
            return userCache[userId];
        }

        try {
            setLoading(true);
            const user = await userService.getUserById(userId);
            if (user) {
                setUserCache(prev => ({ ...prev, [userId]: user }));
            }
            return user;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async (userIds) => {
        if (!userIds || userIds.length === 0) return [];

        // Filter out already cached users
        const uncachedIds = userIds.filter(id => !userCache[id]);

        if (uncachedIds.length === 0) {
            return userIds.map(id => userCache[id]);
        }

        try {
            setLoading(true);
            const promises = uncachedIds.map(id => userService.getUserById(id));
            const users = await Promise.all(promises);

            const newCache = {};
            users.forEach((user, index) => {
                if (user) {
                    newCache[uncachedIds[index]] = user;
                }
            });

            setUserCache(prev => ({ ...prev, ...newCache }));
            return userIds.map(id => userCache[id] || newCache[id]).filter(Boolean);
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getUserName = (userId) => {
        if (userCache[userId]) {
            return userCache[userId].name;
        }
        return userId?.substring(0, 8) || 'Unknown';
    };

    const value = {
        userCache,
        loadUser,
        loadUsers,
        getUserName,
        loading,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
