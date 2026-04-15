import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { FirebaseAuthService } from '../../data/firebase';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);
  return authService.currentUser$.pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/auth/login'])))
  );
};

export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);
  return authService.currentUser$.pipe(
    take(1),
    map((user) => (!user ? true : router.createUrlTree(['/dashboard'])))
  );
};
