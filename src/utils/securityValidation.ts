
import DOMPurify from 'dompurify';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and encode special characters
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim();
};

export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeInput(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Format d\'email invalide');
  }
  
  return sanitized.toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  const sanitized = sanitizeInput(phone);
  // Allow only digits, spaces, +, -, (, )
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  
  if (!phoneRegex.test(sanitized)) {
    throw new Error('Format de téléphone invalide');
  }
  
  return sanitized;
};

export const sanitizeOrderToken = (token: string): string => {
  const sanitized = sanitizeInput(token);
  // Order tokens should be alphanumeric only
  const tokenRegex = /^[A-Z0-9]{8}$/;
  
  if (!tokenRegex.test(sanitized)) {
    throw new Error('Token de commande invalide');
  }
  
  return sanitized;
};

export const validateNumericAmount = (amount: string): number => {
  const sanitized = sanitizeInput(amount);
  const numericAmount = parseFloat(sanitized);
  
  if (isNaN(numericAmount) || numericAmount < 0) {
    throw new Error('Montant invalide');
  }
  
  return numericAmount;
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 300000) { // 5 attempts per 5 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return false;
    }

    // Increment attempt count
    record.count++;
    record.lastAttempt = now;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || record.count < this.maxAttempts) {
      return 0;
    }

    const elapsed = Date.now() - record.lastAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }
}

export const authRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes
export const adminRateLimiter = new RateLimiter(3, 600000); // 3 attempts per 10 minutes
