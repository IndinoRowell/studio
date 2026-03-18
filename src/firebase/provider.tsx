'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication and authorization
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
    isAdmin: false,
    isAdminLoading: true,
  });

  // Hardcoded Admin Emails
  const ADMIN_EMAILS = ["jcesperanza@neu.edu.ph"];

  useEffect(() => {
    if (!auth) {
      setUserAuthState(prev => ({ ...prev, isUserLoading: false, userError: new Error("Auth service not provided.") }));
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        // Anonymous users are never admins in this system
        const isHardcodedAdmin = firebaseUser && !firebaseUser.isAnonymous && ADMIN_EMAILS.includes(firebaseUser.email || '');
        
        setUserAuthState(prev => ({ 
          ...prev, 
          user: firebaseUser, 
          isUserLoading: false, 
          userError: null,
          isAdmin: isHardcodedAdmin || false, 
          // If they aren't hardcoded and not anonymous, we need to check Firestore
          isAdminLoading: firebaseUser && !isHardcodedAdmin && !firebaseUser.isAnonymous ? true : false
        }));
      },
      (error) => {
        setUserAuthState(prev => ({ ...prev, user: null, isUserLoading: false, userError: error, isAdminLoading: false }));
      }
    );
    return () => unsubscribeAuth();
  }, [auth]);

  // Effect to check admin status in Firestore
  useEffect(() => {
    if (!firestore || !userAuthState.user || userAuthState.user.isAnonymous) {
      // Anonymous users or missing users don't need a Firestore check
      if (userAuthState.user?.isAnonymous) {
        setUserAuthState(prev => ({ ...prev, isAdmin: false, isAdminLoading: false }));
      }
      return;
    }

    const isHardcodedAdmin = ADMIN_EMAILS.includes(userAuthState.user.email || '');
    if (isHardcodedAdmin) {
      setUserAuthState(prev => ({ ...prev, isAdmin: true, isAdminLoading: false }));
      return;
    }

    const adminDocRef = doc(firestore, 'roles_admin', userAuthState.user.uid);
    const unsubscribeAdmin = onSnapshot(adminDocRef, (docSnap) => {
      setUserAuthState(prev => ({
        ...prev,
        isAdmin: docSnap.exists(),
        isAdminLoading: false
      }));
    }, (error) => {
      // Permission denied usually means they aren't an admin
      setUserAuthState(prev => ({
        ...prev,
        isAdmin: false,
        isAdminLoading: false
      }));
    });

    return () => unsubscribeAdmin();
  }, [firestore, userAuthState.user]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      isAdmin: userAuthState.isAdmin,
      isAdminLoading: userAuthState.isAdminLoading,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    isAdmin: context.isAdmin,
    isAdminLoading: context.isAdminLoading,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, isAdmin, isAdminLoading } = useFirebase();
  return { user, isUserLoading, userError, isAdmin, isAdminLoading };
};