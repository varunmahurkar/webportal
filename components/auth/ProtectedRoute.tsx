/**
 * Nurav AI Protected Route Component
 * Client-side route protection wrapper for authenticated content
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { Container, Flex } from '@/app/core/Grid';
import type { UserRole } from '@/lib/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required roles to access this route (any of them) */
  allowedRoles?: UserRole[];
  /** Custom redirect path when unauthorized */
  redirectTo?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Fallback component when unauthorized (instead of redirect) */
  fallback?: React.ReactNode;
}

/**
 * Default loading spinner component
 */
function DefaultLoadingComponent() {
  return (
    <Container size="lg" className="min-h-screen">
      <Flex
        justifyContent="center"
        alignItems="center"
        className="h-screen"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Flex>
    </Container>
  );
}

/**
 * ProtectedRoute - Wrapper component for authenticated-only content
 *
 * Usage:
 * ```tsx
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/auth/signin',
  loadingComponent,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  /**
   * Check if user has required role
   */
  const hasRequiredRole = React.useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user?.role) return false;
    return allowedRoles.includes(user.role);
  }, [allowedRoles, user?.role]);

  /**
   * Handle unauthorized access
   */
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    if (!hasRequiredRole && !fallback) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, redirectTo, router, fallback]);

  /** Show loading state */
  if (isLoading) {
    return <>{loadingComponent || <DefaultLoadingComponent />}</>;
  }

  /** Not authenticated - will redirect */
  if (!isAuthenticated) {
    return <>{loadingComponent || <DefaultLoadingComponent />}</>;
  }

  /** User doesn't have required role */
  if (!hasRequiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <>{loadingComponent || <DefaultLoadingComponent />}</>;
  }

  /** Authorized - render children */
  return <>{children}</>;
}

export default ProtectedRoute;
