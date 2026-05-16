import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp, 
  where,
  or,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Project, Activity, WorkspaceStats } from '../types';
import { useAuthStore } from '../store/authStore';

interface WorkspaceContextType {
  projects: Project[];
  activities: Activity[];
  stats: WorkspaceStats;
  isLoading: boolean;
  user: any;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const queryClient = useQueryClient();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  // Fetch Projects using TanStack Query
  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, 'projects'),
        or(
          where('ownerId', '==', user.uid),
          where('members', 'array-contains', user.uid)
        ),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
    },
    enabled: !!user,
  });

  // Real-time Activities Listener
  useEffect(() => {
    if (!user) {
      setActivities([]);
      setIsActivitiesLoading(false);
      return;
    }

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(15)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        const ts = data.timestamp;
        return {
          id: doc.id,
          title: data.title,
          type: data.type,
          time: ts ? `${Math.floor((Date.now() - (ts.toMillis ? ts.toMillis() : Date.now())) / 60000)}m ago` : 'Just now'
        };
      }) as Activity[];
      setActivities(items);
      setIsActivitiesLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activities');
      setIsActivitiesLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activityMutation = useMutation({
    mutationFn: async (activity: Omit<Activity, 'id' | 'time'>) => {
      if (!user) return;
      await addDoc(collection(db, 'activities'), {
        ...activity,
        userId: user.uid,
        timestamp: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', user?.uid] });
    },
    onError: (error) => {
      handleFirestoreError(error, OperationType.CREATE, 'activities');
    }
  });

  const stats = useMemo<WorkspaceStats>(() => ({
    activeProjects: projects.length,
    openIssues: 0,
  }), [projects.length]);

  const isLoading = isAuthLoading || isProjectsLoading || isActivitiesLoading;

  const value = useMemo(() => ({ 
    projects, 
    activities, 
    stats, 
    isLoading, 
    user, 
    addActivity: (activity: any) => activityMutation.mutateAsync(activity)
  }), [projects, activities, stats, isLoading, user, activityMutation]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
