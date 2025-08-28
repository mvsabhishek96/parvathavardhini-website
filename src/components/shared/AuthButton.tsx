'use client';

import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const AuthButton = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (user) {
    return <Button onClick={handleSignOut}>Sign Out</Button>;
  }

  return <Button onClick={handleSignIn}>Sign In with Google</Button>;
};

export default AuthButton;