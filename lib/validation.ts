/**
 * Validation utilities for username and password
 */

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_.\-]{5,17}$/;

// Password validation constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  issues: string[];
  feedback: string[];
}

/**
 * Validate username format
 * - 6-18 characters
 * - Must start with a letter
 * - Only letters, numbers, _, -, . allowed
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) return { valid: false, error: "Username is required" };
  if (username.length < 6)
    return { valid: false, error: "Username must be at least 6 characters" };
  if (username.length > 18)
    return { valid: false, error: "Username must be at most 18 characters" };
  if (!/^[a-zA-Z]/.test(username))
    return { valid: false, error: "Username must start with a letter" };
  if (!USERNAME_REGEX.test(username))
    return { valid: false, error: "Only letters, numbers, _, -, . allowed" };
  return { valid: true };
}

/**
 * Validate password complexity and calculate strength
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - No sequential or repeated patterns
 */
export function validatePassword(password: string): PasswordValidationResult {
  const issues: string[] = [];
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      valid: false,
      score: 0,
      level: "weak",
      issues: ["Password is required"],
      feedback: [],
    };
  }

  // Length checks
  if (password.length < PASSWORD_MIN_LENGTH) {
    issues.push(`At least ${PASSWORD_MIN_LENGTH} characters`);
  } else {
    score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    issues.push(`Maximum ${PASSWORD_MAX_LENGTH} characters`);
  }

  // Character type checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password);

  if (!hasUppercase) {
    issues.push("One uppercase letter");
  } else {
    score += 10;
  }

  if (!hasLowercase) {
    issues.push("One lowercase letter");
  } else {
    score += 10;
  }

  if (!hasDigit) {
    issues.push("One number");
  } else {
    score += 10;
  }

  if (!hasSpecial) {
    issues.push("One special character (!@#$%^&*...)");
  } else {
    score += 10;
  }

  // Bonus for character variety
  const charTypes = [hasUppercase, hasLowercase, hasDigit, hasSpecial].filter(
    Boolean
  ).length;
  if (charTypes >= 3) score += 10;
  if (charTypes === 4) score += 10;

  // Pattern checks
  const hasRepeated = /(.)\1{2,}/.test(password);
  const hasSequentialNumbers =
    /(012|123|234|345|456|567|678|789|890)/.test(password);
  const hasSequentialLetters =
    /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
      password
    );

  if (hasRepeated || hasSequentialNumbers || hasSequentialLetters) {
    issues.push("No sequential or repeated patterns");
    score -= 10;
    feedback.push("Avoid repeated characters and sequential patterns");
  }

  // Determine strength level
  score = Math.max(0, Math.min(100, score));
  let level: "weak" | "fair" | "good" | "strong";
  if (score >= 80) {
    level = "strong";
  } else if (score >= 60) {
    level = "good";
  } else if (score >= 40) {
    level = "fair";
  } else {
    level = "weak";
  }

  return {
    valid: issues.length === 0,
    score,
    level,
    issues,
    feedback,
  };
}

/**
 * Get color for password strength level
 */
export function getPasswordStrengthColor(
  level: "weak" | "fair" | "good" | "strong"
): string {
  const colors = {
    weak: "#ef4444", // red
    fair: "#f97316", // orange
    good: "#eab308", // yellow
    strong: "#22c55e", // green
  };
  return colors[level];
}
