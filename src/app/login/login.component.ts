import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!:FormGroup;
  signUpForm!:FormGroup;
  displaySignUp=false;

  usersList:any[]=[]
  constructor(private _fb:FormBuilder,private toastr:ToastrService,private _router:Router,private _gs:GlobalService){
    this.loginForm=this._fb.group({
      'email':new FormControl('',[Validators.required,Validators.email]),
      'password':new FormControl('',[Validators.required,Validators.minLength(6)])
    })
    this.signUpForm=this._fb.group({
      'email':new FormControl('',[Validators.required,Validators.email]),
      'role':new FormControl('',Validators.required),
      'password':new FormControl('',[Validators.required,Validators.minLength(6)])
    })
  }

  onSignUpLink(isSignUp:boolean){
    isSignUp?this.displaySignUp = true:this.displaySignUp = false;
  }

  onSignIn(){
    this.usersList=JSON.parse(localStorage.getItem('usersList') || '{}')
    if(!this.usersList?.length){
      this.toastr.error('User not registered,Please Sign Up');
      return
    }
    const user = this.usersList.find(user=> user.email===this.loginForm?.value?.email);
    if(!user){
      this.toastr.error('User not registered,Please Sign Up');
      return
    }
    localStorage.setItem('user_info',JSON.stringify(user));
    this._gs.userInfo=user
    this._gs.isUserLoggedIn=true;
    this._gs.userRole=user.role;
    this.toastr.success('User Sign In Successfully');
    this._router.navigate(['/home']);
    this.resetForm();
  }

  onSignUp(){
    this.usersList=JSON.parse(localStorage.getItem('usersList') || '{}')
    if(this.usersList?.length){
      const user = this.usersList.find(user=> user.email===this.signUpForm?.value?.email)
      if(user)
        {
          this.toastr.error('User already registered,Please Sign In');
          return
        }
    }else{
      this.usersList=[];
    }
    this.usersList.push(this.signUpForm.value)
    localStorage.setItem('usersList',JSON.stringify(this.usersList));
    this.toastr.success('User Sign Up Successfully');
    this.resetForm();
  }

  resetForm(){
    this.displaySignUp?this.signUpForm.reset({role:''}):this.loginForm.reset()
  }
  
}
