import { describe, it, expect } from 'vitest';
import type { IAuthService, AuthUser } from './auth.interface';

describe('IAuthService Interface Contract', () => {
  it('should define an AuthUser with required fields', () => {
    const user: AuthUser = {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: true,
      tier: 'free',
    };
    expect(user.uid).toBe('user-123');
    expect(user.tier).toBe('free');
  });

  it('should support pro tier', () => {
    const proUser: AuthUser = {
      uid: 'pro-user',
      email: 'pro@example.com',
      displayName: 'Pro User',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true,
      tier: 'pro',
    };
    expect(proUser.tier).toBe('pro');
  });

  it('should allow null email and displayName', () => {
    const anonUser: AuthUser = {
      uid: 'anon-1',
      email: null,
      displayName: null,
      photoURL: null,
      emailVerified: false,
      tier: 'free',
    };
    expect(anonUser.email).toBeNull();
    expect(anonUser.displayName).toBeNull();
  });

  it('IAuthService should have all required method signatures', () => {
    const mockService: IAuthService = {
      currentUser$: {} as IAuthService['currentUser$'],
      signInWithEmail: async () => ({} as AuthUser),
      signUpWithEmail: async () => ({} as AuthUser),
      signInWithGoogle: async () => ({} as AuthUser),
      signOut: async () => {},
      sendPasswordResetEmail: async () => {},
      getIdToken: async () => null,
    };
    expect(typeof mockService.signInWithEmail).toBe('function');
    expect(typeof mockService.signOut).toBe('function');
    expect(typeof mockService.getIdToken).toBe('function');
  });
});
