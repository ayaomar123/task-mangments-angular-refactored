import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const loggedToken = localStorage.getItem("AngularUserToken");

  if (loggedToken !== null) {
     return true;
    }else{
      router.navigateByUrl("login");
      return false;
    }
};
