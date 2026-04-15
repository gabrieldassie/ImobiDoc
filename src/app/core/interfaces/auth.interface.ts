export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  tier: 'free' | 'pro';
}

export interface IAuthService {
  currentUser$: import('rxjs').Observable<AuthUser | null>;
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser>;
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  getIdToken(): Promise<string | null>;
}
