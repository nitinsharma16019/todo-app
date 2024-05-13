import { Component } from '@angular/core';
import { GlobalService } from '../../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public _gs:GlobalService,private _router:Router){

  }

  onLogOut(){
    localStorage.removeItem('user_info');
    this._gs.userInfo=undefined;
    this._gs.isUserLoggedIn=false;
    this._router.navigate([''])
  }
}
