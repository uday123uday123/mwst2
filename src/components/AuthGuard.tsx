import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BrainCircuit, LogIn } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore(state => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser(userSnap.data() as any);
          } else {
            // Create user
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Wellness Seeker',
              totalXP: 0,
              currentLevel: 1,
              streakFreezeBalance: 3, // starting freezes
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#f5f5f0] text-[#3a3a2e] font-serif">Loading...</div>;
  }

  const user = useAppStore.getState().user;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f0] text-[#3a3a2e] font-serif">
        <div className="max-w-md w-full p-8 bg-white rounded-[32px] border border-[#e6e6da] shadow-sm space-y-8 text-center">
          <div className="flex justify-center">
            <div className="bg-[#f0ede6] p-4 rounded-3xl">
              <BrainCircuit className="w-12 h-12 text-[#8a9a5b]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-light tracking-tight text-[#5a5a40] mb-2">Project 30</h1>
            <p className="text-sm italic opacity-70">Mental Wellness Gamified</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#8a9a5b] hover:bg-[#7a8a4b] text-white px-6 py-4 rounded-full font-sans font-medium transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
