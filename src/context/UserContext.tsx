"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface User {
    uid: string;
    username: string;
    photoURL: string;
    displayName: string;
    email: string;
    isAdmin: number;
    isModerator: number;
}

interface UserContextType {
    user: User | null;
    setUser: (u: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

interface Props {
    children: ReactNode;
    initialUser?: User;
}

export function UserProvider({ children, initialUser }: Readonly<Props>) {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const contextValue = useMemo(
        () => ({ user, setUser }),
        [user]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}