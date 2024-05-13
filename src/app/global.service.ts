import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isUserLoggedIn=false;
  userInfo:any;
  userRole!:string;
  constructor() { 
    const userJSON = localStorage.getItem('user_info');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      if (user && Object.keys(user).length) {
        this.userInfo = user;
        this.userRole = user.role;
        this.isUserLoggedIn = true;
      }
    }
  }
}
