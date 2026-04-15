import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  authState,
  User,
} from '@angular/fire/auth';
import type { IAuthService, AuthUser } from '../../core/interfaces';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService implements IAuthService {
  private readonly auth = inject(Auth);

  currentUser$: Observable<AuthUser | null> = authState(this.auth).pipe(
    switchMap((user) => (user ? from(this.mapUser(user)) : of(null)))
  );

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return this.mapUser(cred.user);
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName });
    return this.mapUser(cred.user);
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    return this.mapUser(cred.user);
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.getIdToken() : null;
  }

  private async mapUser(user: User): Promise<AuthUser> {
    const token = await user.getIdTokenResult();
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      tier: (token.claims['tier'] as 'free' | 'pro') ?? 'free',
    };
  }
}
