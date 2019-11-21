import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
 
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portJournalmgmt = environment.portJournalmgmt;
const portLocations = environment.portLocations;
@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent {
    loginForm: FormGroup;
    signupForm: FormGroup;
   isLoading = false;
   invalidId = false;
   duplicateUser = false;
   invlidCaptcha = false;
   listofregions = [];
   listofcountries = [];
   listofroles = [];
   listofsubjects = [];
    submitForm(): void {
        this.isLoading = true;
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }       
        const userBean = {
            password: this.loginForm.value.password,
            userId:  this.loginForm.value.userName,
        };
        this.http.post(
            'http://localhost:8081/cmsusermgmt/userMgmt/login', userBean
        ).subscribe(
            (resp: any) =>{
              this.isLoading = false;
               if (resp.status === 'Error') {
                   this.message.error(resp.message);
               } else if (resp.status === 'Success') {
                   window.localStorage.setItem('is_loggedin', 'true');
                   window.localStorage.setItem('user', resp.user.userName);
                   window.localStorage.setItem('role', resp.user.roles);
                   window.localStorage.setItem('userid', resp.user.userId);
                   let roles = window.localStorage.getItem('role');
                   const userroles = roles.split(',');
                   if (userroles.includes('SuperAdmin')) {
                    this.route.navigate(['/users']);
                   } else if (userroles.includes('Admin')) {
                    this.route.navigate(['/journals']);
                   } else if (userroles.includes('Author')) {
                    this.route.navigate(['/articles']);
                   } else if (userroles.includes('Editor')) {
                    this.route.navigate(['/articles']);
                   } else if (userroles.includes('Reviewer')) {
                    this.route.navigate(['/articles']);
                   }
               }
            },
            err => {
                this.isLoading = false;
               this.message.error(err);
            }
        )
    }

    constructor(private fb: FormBuilder, private http: HttpClient, private route: Router, 
        private message: NzMessageService
        ) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
    
  
}    