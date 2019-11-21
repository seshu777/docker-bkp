import { Component } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent{

    searchVisible : boolean = false;
    quickViewVisible : boolean = false;
    isFolded : boolean;
    isExpand : boolean;
    user;
    username;
    userid;
    role;
    changePWForm: FormGroup;
    isVisible:false;
    constructor( private themeService: ThemeConstantService,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,  private modalService: NzModalService,private message: NzMessageService,) {}

    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.changePWForm = this.fb.group({
            oldPassword: [ null, [ Validators.required ] ],
            newPassword: [ null, [ Validators.required ] ],
            confirmPassword: [ null, [ Validators.required, this.confirmationValidator ] ]
        });
     this.username = window.localStorage.getItem('user');
     this.userid = window.localStorage.getItem('userid');
     if (window.localStorage.getItem('role')) {
        this.role = window.localStorage.getItem('role');
     }
    }

    toggleFold() {
        this.isFolded = !this.isFolded;
        this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
    }

    searchToggle(): void {
        this.searchVisible = !this.searchVisible;
    }

    quickViewToggle(): void {
        this.quickViewVisible = !this.quickViewVisible;
    }

    logOutUser() {
        window.localStorage.removeItem('is_loggedin');
        this.router.navigate(['']);
    }
    notificationList = [
        {
            title: 'You received a new message',
            time: '8 min',
            icon: 'mail',
            color: 'ant-avatar-' + 'blue'
        },
        {
            title: 'New user registered',
            time: '7 hours',
            icon: 'user-add',
            color: 'ant-avatar-' + 'cyan'
        },
        {
            title: 'System Alert',
            time: '8 hours',
            icon: 'warning',
            color: 'ant-avatar-' + 'red'
        },
        {
            title: 'You have a new update',
            time: '2 days',
            icon: 'sync',
            color: 'ant-avatar-' + 'gold'
        }
    ];
    submitForm(): void {
        for (const i in this.changePWForm.controls) {
            this.changePWForm.controls[ i ].markAsDirty();
            this.changePWForm.controls[ i ].updateValueAndValidity();
        }

        this.showConfirm();
    }
    showConfirm(): void {
        this.modalService.confirm({
            nzTitle  : '<i>Do you want to change your password?</i>',
            nzOnOk   : () => 
            {
                const data = {
                    cPassword: this.changePWForm.value.oldPassword,
                    nPassword: this.changePWForm.value.newPassword,
                    nPasswordConf: this.changePWForm.value.confirmPassword,
                    userId: window.localStorage.getItem('userid')
                }
                this.http.post('http://localhost:8081/cmsusermgmt/userMgmt/passwordReset', data).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                   this.message.success(resp.message);
                }  else if (resp.status === 'Error') {
                    this.message.error(resp.message);
                }
            },
            err => {
                console.log(err);
            }
        )
            }
        });
    }
    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.changePWForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.changePWForm.controls.newPassword.value) {
            return { confirm: true, error: true };
        }
    }
    handleCancel() {
        this.isVisible = false;
        this.changePWForm.reset();
    }
   
}
