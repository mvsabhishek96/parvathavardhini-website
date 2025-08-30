'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

// Extend the Firebase User type to include our custom fields
export interface AuthUser extends FirebaseUser {
  name?: string;
  mobile?: string;
  isMaster?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        // User is signed in and verified, now fetch the custom data from Firestore
        const userDocRef = doc(db, 'CommitteeMembers', firebaseUser.email!);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const customData = userDoc.data();
          setUser({
            ...firebaseUser,
            name: customData.name,
            mobile: customData.mobile,
            isMaster: customData.isMaster || false,
          });
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setUser(firebaseUser);
        }
      } else {
        // User is signed out or not verified
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);