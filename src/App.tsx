import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Shell } from './components/layout/Shell.tsx';
import { WorkspaceProvider } from './hooks/useWorkspace.tsx';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

// Lazy load pages for better bundle performance
const LandingPage = lazy(() => import('./pages/LandingPage.tsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.tsx'));
const MainWorkspace = lazy(() => import('./pages/MainWorkspace.tsx'));
const RealtimeChat = lazy(() => import('./pages/RealtimeChat.tsx'));
const AICollabWorkspace = lazy(() => import('./pages/AICollabWorkspace.tsx'));
const CommandCenter = lazy(() => import('./pages/CommandCenter.tsx'));
const SpatialThreads = lazy(() => import('./pages/SpatialThreads.tsx'));
const UserProfile = lazy(() => import('./pages/UserProfile.tsx'));
const MobileWorkspace = lazy(() => import('./pages/MobileWorkspace.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#020306]">
    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
  </div>
);

import { useAuthStore } from './store/authStore.ts';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* App Shell Routes (Protected) */}
                <Route path="/workspace" element={<ProtectedRoute><Shell><MainWorkspace /></Shell></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Shell><RealtimeChat /></Shell></ProtectedRoute>} />
                <Route path="/ai-collab" element={<ProtectedRoute><Shell><AICollabWorkspace /></Shell></ProtectedRoute>} />
                <Route path="/command" element={<ProtectedRoute><Shell><CommandCenter /></Shell></ProtectedRoute>} />
                <Route path="/threads" element={<ProtectedRoute><Shell><SpatialThreads /></Shell></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Shell><UserProfile /></Shell></ProtectedRoute>} />
                
                {/* Specialized Views */}
                <Route path="/mobile" element={<ProtectedRoute><MobileWorkspace /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </WorkspaceProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
