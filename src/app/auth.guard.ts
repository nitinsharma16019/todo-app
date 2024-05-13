import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from './global.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const globalService = inject(GlobalService);
  const router = inject(Router);
  console.log(globalService.isUserLoggedIn)
  if(globalService.isUserLoggedIn){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
