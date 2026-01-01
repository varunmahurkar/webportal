/**
 * Nurav AI Authentication Modal
 * ChatGPT-style login modal with OAuth, email, and phone authentication
 */

'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stack, Flex } from '@/app/core/Grid';
import { Text } from '@/app/core/Typography';
import {
  signInWithOAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
  verifyPhoneOtp,
  type OAuthProvider,
} from '@/lib/supabase/client';

/**
 * OAuth provider configuration
 */
const OAUTH_PROVIDERS = [
  {
    id: 'google' as OAuthProvider,
    name: 'Google',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  {
    id: 'github' as OAuthProvider,
    name: 'GitHub',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 'apple' as OAuthProvider,
    name: 'Apple',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    id: 'discord' as OAuthProvider,
    name: 'Discord',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

/**
 * Password requirements for signup
 */
const PASSWORD_REQUIREMENTS = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
  { label: 'Contains a letter', test: (p: string) => /[a-zA-Z]/.test(p) },
];

/**
 * Auth method types
 */
type AuthMethod = 'options' | 'email' | 'phone';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup';
  onSuccess?: () => void;
}

/**
 * AuthModal - ChatGPT-style authentication modal
 */
export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'signin',
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone form state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  /**
   * Reset form state
   */
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setError(null);
    setAuthMethod('options');
    setShowPassword(false);
  }, []);

  /**
   * Handle dialog close
   */
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, resetForm]
  );

  /**
   * Handle OAuth sign in
   */
  const handleOAuthSignIn = useCallback(async (provider: OAuthProvider) => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithOAuth(provider);
      // OAuth redirects, so we don't need to do anything here
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth sign in failed';
      setError(message);
      toast.error('Sign in failed', { description: message });
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle email sign in
   */
  const handleEmailSignIn = useCallback(async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      toast.error('Sign in failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, handleOpenChange, onSuccess]);

  /**
   * Handle email sign up
   */
  const handleEmailSignUp = useCallback(async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValid = PASSWORD_REQUIREMENTS.every((req) => req.test(password));
    if (!passwordValid) {
      setError('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUpWithEmail(email, password, fullName || undefined);
      toast.success('Account created!', {
        description: 'Please check your email for verification.',
      });
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      toast.error('Sign up failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, fullName, handleOpenChange, onSuccess]);

  /**
   * Handle phone OTP request
   */
  const handlePhoneOtpRequest = useCallback(async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithPhone(phone);
      setOtpSent(true);
      toast.success('OTP sent!', { description: 'Check your phone for the code.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
      toast.error('Failed to send OTP', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  /**
   * Handle phone OTP verification
   */
  const handlePhoneOtpVerify = useCallback(async () => {
    if (!otp) {
      setError('Please enter the OTP code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyPhoneOtp(phone, otp);
      toast.success('Phone verified!');
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      setError(message);
      toast.error('Verification failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [phone, otp, handleOpenChange, onSuccess]);

  /**
   * Render OAuth buttons
   */
  const renderOAuthButtons = () => (
    <Stack spacing={3}>
      {OAUTH_PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className="w-full h-12 justify-start gap-3 text-base font-normal"
          onClick={() => handleOAuthSignIn(provider.id)}
          disabled={isLoading}
        >
          {provider.icon}
          <span>Continue with {provider.name}</span>
        </Button>
      ))}
    </Stack>
  );

  /**
   * Render email form
   */
  const renderEmailForm = () => (
    <Stack spacing={4}>
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2"
        onClick={() => setAuthMethod('options')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {activeTab === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name (optional)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {activeTab === 'signup' && password.length > 0 && (
          <div className="space-y-1 pt-1">
            {PASSWORD_REQUIREMENTS.map((req, index) => {
              const isMet = req.test(password);
              return (
                <Flex key={index} alignItems="center" gap={2}>
                  {isMet ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <Text className={`text-xs ${isMet ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {req.label}
                  </Text>
                </Flex>
              );
            })}
          </div>
        )}
      </div>

      {activeTab === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {confirmPassword.length > 0 && (
            <Flex alignItems="center" gap={2}>
              {password === confirmPassword ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <Text className="text-xs text-green-500">Passwords match</Text>
                </>
              ) : (
                <>
                  <X className="h-3 w-3 text-destructive" />
                  <Text className="text-xs text-destructive">Passwords do not match</Text>
                </>
              )}
            </Flex>
          )}
        </div>
      )}

      <Button
        className="w-full h-12"
        onClick={activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : activeTab === 'signin' ? (
          'Sign In'
        ) : (
          'Create Account'
        )}
      </Button>
    </Stack>
  );

  /**
   * Render phone form
   */
  const renderPhoneForm = () => (
    <Stack spacing={4}>
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2"
        onClick={() => {
          setAuthMethod('options');
          setOtpSent(false);
          setOtp('');
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!otpSent ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Text className="text-xs text-muted-foreground">
              Enter your phone number with country code
            </Text>
          </div>

          <Button
            className="w-full h-12"
            onClick={handlePhoneOtpRequest}
            disabled={isLoading || !phone}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              'Send verification code'
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              disabled={isLoading}
            />
            <Text className="text-xs text-muted-foreground text-center">
              We sent a code to {phone}
            </Text>
          </div>

          <Button
            className="w-full h-12"
            onClick={handlePhoneOtpVerify}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
            }}
            disabled={isLoading}
          >
            Change phone number
          </Button>
        </>
      )}
    </Stack>
  );

  /**
   * Render auth options
   */
  const renderAuthOptions = () => (
    <Stack spacing={4}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderOAuthButtons()}

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full h-12 justify-start gap-3 text-base font-normal"
        onClick={() => setAuthMethod('email')}
        disabled={isLoading}
      >
        <Mail className="h-5 w-5" />
        <span>Continue with Email</span>
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 justify-start gap-3 text-base font-normal"
        onClick={() => setAuthMethod('phone')}
        disabled={isLoading}
      >
        <Phone className="h-5 w-5" />
        <span>Continue with Phone</span>
      </Button>
    </Stack>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 text-center">
          <DialogTitle className="text-2xl font-semibold">
            {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'signin'
              ? 'Sign in to continue to Nurav AI'
              : 'Sign up to get started with Nurav AI'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as 'signin' | 'signup');
              setError(null);
              if (authMethod !== 'options') {
                setAuthMethod('options');
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              {authMethod === 'options' && renderAuthOptions()}
              {authMethod === 'email' && renderEmailForm()}
              {authMethod === 'phone' && renderPhoneForm()}
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              {authMethod === 'options' && renderAuthOptions()}
              {authMethod === 'email' && renderEmailForm()}
              {authMethod === 'phone' && renderPhoneForm()}
            </TabsContent>
          </Tabs>

          <Text className="text-xs text-center text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </Text>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
