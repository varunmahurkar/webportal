"use client";

/**
 * Authentication Modal Component
 * Features:
 * - Email/password sign in and sign up
 * - Username validation with Bloom filter availability check
 * - Password strength indicator with validation
 * - Random username generator
 * - OAuth providers (Google, GitHub, Discord)
 * - Phone OTP authentication
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  Phone,
  Chrome,
  Github,
  Check,
  X,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Award } from "../../app/core/icons";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import {
  supabase,
  signInWithOAuth,
  signInWithPhone,
  verifyPhoneOtp,
} from "@/lib/supabase/client";
import {
  validateUsername,
  validatePassword,
  getPasswordStrengthColor,
} from "@/lib/validation";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "signin",
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Validation states
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState<{
    valid: boolean;
    score: number;
    level: "weak" | "fair" | "good" | "strong";
    issues: string[];
  } | null>(null);

  // Loading states for generators
  const [generatingUsername, setGeneratingUsername] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setUsername("");
    setUsernameError(null);
    setUsernameAvailable(null);
    setUsernameSuggestions([]);
    setPasswordValidation(null);
    setFullName("");
    setPhone("");
    setOtp("");
    setError(null);
    setMessage(null);
    setShowOtpInput(false);
  };

  const handleSuccess = () => {
    resetForm();
    onOpenChange(false);
    onSuccess?.();
    router.refresh();
  };

  // Debounced username availability check
  useEffect(() => {
    if (username.length < 6) {
      setUsernameAvailable(null);
      setUsernameSuggestions([]);
      return;
    }

    const localValidation = validateUsername(username);
    if (!localValidation.valid) {
      setUsernameError(localValidation.error || null);
      setUsernameAvailable(null);
      return;
    }

    setUsernameError(null);
    setCheckingUsername(true);

    const timeoutId = setTimeout(async () => {
      try {
        const result = await api.checkUsername(username);
        setUsernameAvailable(result.available);
        if (!result.available && result.suggestions) {
          setUsernameSuggestions(result.suggestions);
        } else {
          setUsernameSuggestions([]);
        }
        if (!result.available) {
          setUsernameError(result.message);
        } else {
          setUsernameError(null);
        }
      } catch (err) {
        // If API fails, assume username is available (backend will validate on signup)
        console.log("Username check failed, assuming available:", err);
        setUsernameAvailable(true);
        setUsernameError(null);
        setUsernameSuggestions([]);
      } finally {
        setCheckingUsername(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Password validation on change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  };

  // Username change handler
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameAvailable(null);
    setUsernameSuggestions([]);
    if (value.length > 0) {
      const result = validateUsername(value);
      setUsernameError(result.valid ? null : result.error || null);
    } else {
      setUsernameError(null);
    }
  };

  // Generate random username
  const handleGenerateUsername = async () => {
    setGeneratingUsername(true);
    try {
      const result = await api.generateUsername();
      setUsername(result.username);
      setUsernameAvailable(true);
      setUsernameError(null);
      setUsernameSuggestions(result.suggestions || []);
    } catch (err) {
      // Fallback: generate locally
      const adjectives = [
        "swift",
        "bright",
        "cosmic",
        "cyber",
        "digital",
        "epic",
      ];
      const nouns = ["coder", "dragon", "eagle", "ninja", "phoenix", "wolf"];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 900) + 100;
      setUsername(`${adj}_${noun}${num}`);
    } finally {
      setGeneratingUsername(false);
    }
  };

  // Select a suggested username
  const handleSelectSuggestion = (suggestion: string) => {
    setUsername(suggestion);
    setUsernameAvailable(true);
    setUsernameError(null);
    setUsernameSuggestions([]);
  };

  // Sign Up via Backend API
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setUsernameError(usernameValidation.error || "Invalid username");
      return;
    }

    // Validate password
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.valid) {
      setError(`Password must have: ${pwdValidation.issues.join(", ")}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.signup({
        email,
        password,
        username,
        full_name: fullName || undefined,
      });
      setMessage("Check your email for a confirmation link!");
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Sign In via Backend API
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.signin({ email, password });
      // Store tokens in Supabase client for session management
      if (result.access_token && result.refresh_token) {
        await supabase.auth.setSession({
          access_token: result.access_token,
          refresh_token: result.refresh_token,
        });
      }
      handleSuccess();
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  // OAuth
  const handleOAuth = async (provider: "google" | "github" | "discord") => {
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (err: any) {
      setError(err.message || "OAuth failed");
      setLoading(false);
    }
  };

  // Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithPhone(phone);
      setShowOtpInput(true);
      setMessage("OTP sent to your phone");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyPhoneOtp(phone, otp);
      handleSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Username is valid if: length >= 6, no format errors, and not explicitly marked as taken
  const isUsernameValid =
    username.length >= 6 && !usernameError && usernameAvailable !== false;

  // Password is valid if all complexity requirements are met
  const isPasswordValid = passwordValidation?.valid ?? false;

  // Form is submittable: valid username (or checking), valid password, not loading
  const canSubmit = isUsernameValid && isPasswordValid && !loading;

  // Password strength bar component
  const PasswordStrengthBar = () => {
    if (!passwordValidation) return null;

    const color = getPasswordStrengthColor(passwordValidation.level);
    const widthPercent = passwordValidation.score;

    return (
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs capitalize" style={{ color }}>
            {passwordValidation.level}
          </span>
          <span className="text-xs text-muted-foreground">
            {passwordValidation.score}/100
          </span>
        </div>
        {passwordValidation.issues.length > 0 && (
          <p className="text-xs text-destructive">
            Need: {passwordValidation.issues.slice(0, 2).join(", ")}
            {passwordValidation.issues.length > 2 && "..."}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center text-xl">
            Welcome to Nurav AI
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={defaultTab}
          className="w-full"
          onValueChange={() => {
            setError(null);
            setMessage(null);
          }}
        >
          <TabsList
            className="grid w-full grid-cols-2 mx-6 mt-4"
            style={{ width: "calc(100% - 48px)" }}
          >
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="p-6 pt-4 space-y-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("google")}
                disabled={loading}
              >
                <Chrome className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("github")}
                disabled={loading}
              >
                <Github className="mr-2 h-4 w-4" /> Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("discord")}
                disabled={loading}
              >
                <Award className="mr-2 h-4 w-4" /> Continue with Discord
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="p-6 pt-4 space-y-4">
            {message ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">{message}</p>
                <Button variant="link" onClick={() => setMessage(null)}>
                  Back to sign up
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuth("google")}
                    disabled={loading}
                  >
                    <Chrome className="mr-2 h-4 w-4" /> Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuth("github")}
                    disabled={loading}
                  >
                    <Github className="mr-2 h-4 w-4" /> Continue with GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signup-username">Username</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={handleGenerateUsername}
                        disabled={generatingUsername}
                      >
                        {generatingUsername ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-3 w-3 mr-1" />
                        )}
                        Generate
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="john_doe123"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`pr-8 ${
                          usernameError
                            ? "border-destructive"
                            : usernameAvailable === true
                            ? "border-green-500"
                            : ""
                        }`}
                        required
                        minLength={6}
                        maxLength={18}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {checkingUsername ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : username.length >= 6 ? (
                          usernameAvailable === true ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : usernameAvailable === false ? (
                            <X className="h-4 w-4 text-destructive" />
                          ) : null
                        ) : null}
                      </div>
                    </div>
                    {usernameError && (
                      <p className="text-xs text-destructive">{usernameError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      6-18 chars, start with letter, use letters/numbers/_/-/.
                    </p>

                    {/* Username Suggestions */}
                    {usernameSuggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Suggestions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {usernameSuggestions.slice(0, 4).map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field with Strength Indicator */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 chars, A-Z, a-z, 0-9, !@#"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        minLength={8}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <PasswordStrengthBar />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                  </Button>
                </form>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Phone Auth Section */}
        <div className="p-6 pt-0">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or use phone
              </span>
            </div>
          </div>

          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="flex gap-2">
              <Input
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" variant="outline" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Code sent to {phone}
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setShowOtpInput(false)}
              >
                Change number
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
