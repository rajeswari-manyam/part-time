import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type AccountType = 'user' | 'worker';

interface AccountContextType {
    accountType: AccountType;
    setAccountType: (type: AccountType) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Initialize from localStorage or user role
    const [accountType, setAccountTypeState] = useState<AccountType>(() => {
        const stored = localStorage.getItem('accountType');
        if (stored === 'user' || stored === 'worker') {
            return stored;
        }
        return user?.role || 'user';
    });

    // Sync with localStorage and update when changed
    const setAccountType = (type: AccountType) => {
        setAccountTypeState(type);
        localStorage.setItem('accountType', type);
    };

    // Update account type when user changes (login/logout)
    useEffect(() => {
        if (user?.role) {
            const stored = localStorage.getItem('accountType');
            // Only update if no stored preference or if user just logged in
            if (!stored) {
                setAccountType(user.role);
            }
        }
    }, [user]);

    return (
        <AccountContext.Provider value={{ accountType, setAccountType }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within AccountProvider');
    }
    return context;
};
