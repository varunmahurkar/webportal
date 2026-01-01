/**
 * Nurav AI Header Component
 * Top navigation bar with logo, navigation, and authentication button
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, User, Settings, ChevronDown, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Flex } from '@/app/core/Grid';
import { Text } from '@/app/core/Typography';
import { AuthModal } from '@/components/auth';
import { supabase, signOut } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Header - Main navigation header with auth controls
 */
export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultAuthTab, setDefaultAuthTab] = useState<'signin' | 'signup'>('signin');

  /**
   * Initialize auth state and listen for changes
   */
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        // Supabase not configured, silently fail
        console.warn('Auth not available:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.warn('Auth listener not available:', error);
      setIsLoading(false);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  /**
   * Open auth modal with specific tab
   */
  const openAuthModal = (tab: 'signin' | 'signup') => {
    setDefaultAuthTab(tab);
    setAuthModalOpen(true);
  };

  /**
   * Handle auth success
   */
  const handleAuthSuccess = () => {
    router.refresh();
  };

  /**
   * Get user display name
   */
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  /**
   * Get user avatar initials
   */
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-[var(--banner-height,0px)] z-40 w-full border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Text className="text-primary-foreground font-bold text-lg">N</Text>
            </div>
            <Text className="font-semibold text-lg hidden sm:block">Nurav AI</Text>
          </Link>

          {/* Navigation (can be expanded later) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/core/typography" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Typography
            </Link>
            <Link href="/core/icons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Icons
            </Link>
            <Link href="/core/color" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Colors
            </Link>
          </nav>

          {/* Auth Section */}
          <Flex alignItems="center" gap={2}>
            {isLoading ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : user ? (
              /* Logged in state */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Text className="text-primary text-sm font-medium">
                        {getUserInitials()}
                      </Text>
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <Text className="text-sm font-medium">{getUserDisplayName()}</Text>
                    <Text className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </Text>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Logged out state */
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('signin')}
                  className="hidden sm:flex"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal('signup')}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </>
            )}
          </Flex>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={defaultAuthTab}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;
