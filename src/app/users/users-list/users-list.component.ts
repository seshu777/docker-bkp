import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portJournalmgmt = environment.portJournalmgmt;


@Component({
    templateUrl: './users-list.component.html'
})



export class UsersListComponent implements OnInit {
    isVisible:boolean = false;
    allChecked: boolean = false;
    indeterminate: boolean = false;
    search : any;
    displayData = [];
    listOfAllData = [];
    mapOfCheckedId: { [key: string]: boolean } = {};
    loading = false;
    pageSize = 5;
    pageIndex = 1;
    numberOfChecked = 0;
    user;
    signUpForm: FormGroup;
    isLoading = false;
    constructor( private fb: FormBuilder, private http: HttpClient, private message: NzMessageService,
        ) { }

    ngOnInit(){
            this.getUsersList();
            this.signUpForm = this.fb.group({
                userId           : [ null, [ Validators.required ] ],
                userName         : [ null, [ Validators.required ] ],
                email            : [ null, [ Validators.email, Validators.required] ],
                password         : [ null, [ Validators.required ] ],
                checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
                agree            : [ false ]
            });
        }
    cancel() {
        //
    }
    getUsersList(){
        this.loading = true;
        this.http.get(`${apiUrl}${portUsermgmt}/cmsusermgmt/userMgmt/users`).subscribe(
        (resp: any) =>{
            if (resp.status === 'Success') {
                let roles = window.localStorage.getItem('role');
               const userroles = roles.split(',');
               if (userroles.includes('SuperAdmin')) {
                  this.listOfAllData = resp.users;
               } else if (userroles.includes('Admin')) {
                //  this.listOfAllData = resp.users.filter(user => user.role !== 'SuperAdmin' && user.role !== 'Admin');
                 this.listOfAllData = resp.users;
               }
            }
            this.loading = false;
        },
        err => {
            console.log(err);
        }
    )
    }
    

    deleteUser(userId){
        this.http.delete(`${apiUrl}${portUsermgmt}/cmsusermgmt/userMgmt/user/${userId}`).subscribe(
            (resp: any) =>{
                
                if(resp.status == 'Success'){
                    this.message.success(resp.message);
                }
                
                this.getUsersList();
             },
            err => {
                this.message.error(err);
                console.log(err);
            }
        )
    }

    sort(sortAttribute: any) {
    }

    currentPageDataChange($event: Array<{ 
        id: number; 
        name: string;
        avatar: string;
        date: string;
        amount: number;
        status: string;
        checked: boolean; 
    }>): void {
        this.displayData = $event;
        this.refreshStatus();
    }

    refreshStatus(): void {
        this.allChecked = this.displayData
          .filter(item => !item.disabled)
          .every(item => this.mapOfCheckedId[item.id]);
        this.indeterminate =
          this.displayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) &&
          !this.allChecked;
        this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
      }

      checkAll(value: boolean): void {
        this.displayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.id] = value));
        this.refreshStatus();
      }

      handleCancel() {
          this.isVisible = false;
          this.signUpForm.reset();
      }
     
    submitForm(): void {
      this.isLoading = true;
        for (const i in this.signUpForm.controls) {
            this.signUpForm.controls[ i ].markAsDirty();
            this.signUpForm.controls[ i ].updateValueAndValidity();
        }
        const userBean = {
            userId:  this.signUpForm.value.userId,
            userName: this.signUpForm.value.userName,
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password,
            status: true
        };
        this.http.post(
            `${apiUrl}${portUsermgmt}/cmsusermgmt/userMgmt/user`, userBean
        ).subscribe(
            (resp: any) =>{
                this.isLoading = false;
                if(resp.status == 'Success'){
                    this.message.success(resp.message);
                    this.isVisible = false;
                    this.getUsersList();
                }
                if(resp.status == 'Error'){
                    this.message.error(resp.errorMessage);
                }
                this.signUpForm.reset()
             },
            err => {
                this.isLoading = false;
                console.log(err);
            }
        )
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.signUpForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }
} 