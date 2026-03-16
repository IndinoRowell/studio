'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { errorEmitter } from './error-emitter';

interface FirebaseContextProps {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider = ({
  children,
  app,
  firestore,
  auth,
}: {
  children: ReactNode;
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}) => {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In a real environment, this might trigger a dev overlay
      console.warn('Firebase Permission Error detected:', error.context);
    };

    errorEmitter.on('permission-error', handlePermissionError);
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, firestore, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;

export const getFirebaseApp = () => useFirebase().app;
export const getFirestore = () => useFirebase().firestore;
export const getAuth = () => useFirebase().auth;
