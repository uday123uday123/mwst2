import { useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { Habit, HabitLog } from '../types';

export function useFirebaseSync() {
  const setHabits = useAppStore(state => state.setHabits);
  const setLogs = useAppStore(state => state.setLogs);
  const user = useAppStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const habitsQuery = query(collection(db, 'habits'), where('userId', '==', user.uid));
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Habit[];
      setHabits(habitsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'habits');
    });

    const logsQuery = query(collection(db, 'habitLogs'), where('userId', '==', user.uid));
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HabitLog[];
      setLogs(logsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'habitLogs');
    });

    return () => {
      unsubscribeHabits();
      unsubscribeLogs();
    };
  }, [user, setHabits, setLogs]);
}
