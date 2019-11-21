import { Component } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { Observable } from 'rxjs';


const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portJournalmgmt = environment.portJournalmgmt;

@Component({
    templateUrl: './profile.component.html'
})

export class ProfileComponent {
    changePWForm: FormGroup;
    uploadUserPath = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
    selectedCountry: any;
    selectedLanguage: any;
    userid;
    userDetails: any;
    uploadUrl;
    rolesList =[];
    selectedRole = [];
    isLoading = false;
    skeletonLoading = false;
    dataAvailable = false;
    isLoadingProfile = false;
    networkList = [
        {
            name: 'Facebook',
            icon: 'facebook',
            avatarColor: '#4267b1',
            avatarBg: 'rgba(66, 103, 177, 0.1)',
            status: true,
            link: 'https://facebook.com'
        },
        {
            name: 'Instagram',
            icon: 'instagram',
            avatarColor: '#fff',
            avatarBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
            status: false,
            link: 'https://instagram.com'
        },
        {
            name: 'Twitter',
            icon: 'twitter',
            avatarColor: '#1ca1f2',
            avatarBg: 'rgba(28, 161, 242, 0.1)',
            status: true,
            link: 'https://twitter.com'
        },
        {
            name: 'Dribbble',
            icon: 'dribbble',
            avatarColor: '#d8487e',
            avatarBg: 'rgba(216, 72, 126, 0.1)',
            status: false,
            link: 'https://dribbble.com'
        },
        {
            name: 'Github',
            icon: 'github',
            avatarColor: '#323131',
            avatarBg: 'rgba(50, 49, 49, 0.1)',
            status: true,
            link: 'https://github.com'
        },
        {
            name: 'Linkedin',
            icon: 'linkedin',
            avatarColor: '#0174af',
            avatarBg: 'rgba(1, 116, 175, 0.1)',
            status: true,
            link: 'https://linkedin.com'
        },
        {
            name: 'Dropbox',
            icon: 'dropbox',
            avatarColor: '#005ef7',
            avatarBg: 'rgba(0, 94, 247, 0.1)',
            status: false,
            link: 'https://dropbox.com'
        }
    ];
    notificationConfigList = [
        {
            title: "Everyone can look me up",
            desc: "Allow people found on your public.",
            icon: "user",
            color: "ant-avatar-blue",
            status: true
        },
        {
            title: "Everyone can contact me",
            desc: "Allow any peole to contact.",
            icon: "mobile",
            color: "ant-avatar-cyan",
            status: true
        },
        {
            title: "Show my location",
            desc: "Turning on Location lets you explore what's around you.",
            icon: "environment",
            color: "ant-avatar-gold",
            status: false
        },
        {
            title: "Email Notifications",
            desc: "Receive daily email notifications.",
            icon: "mail",
            color: "ant-avatar-purple",
            status: true
        },
        {
            title: "Unknow Source ",
            desc: "Allow all downloads from unknow source.",
            icon: "question",
            color: "ant-avatar-red",
            status: false
        },
        {
            title: "Data Synchronization",
            desc: "Allow data synchronize with cloud server",
            icon: "swap",
            color: "ant-avatar-green",
            status: true
        },
        {
            title: "Groups Invitation",
            desc: "Allow any groups invitation",
            icon: "usergroup-add",
            color: "ant-avatar-orange",
            status: true
        },
    ]

    constructor(private fb: FormBuilder, 
        private sanitizer : DomSanitizer,
        private modalService: NzModalService, private message: NzMessageService,
        private http: HttpClient,
        private route: ActivatedRoute) {
            this.route.params.subscribe( params => {
               this.userid = params.id;
            } );
    }

    ngOnInit(): void {
         //get user by id
        this.http.get(`http://localhost:8081/cmsusermgmt/userMgmt/user/${this.userid}`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    //console.log(resp.user);
                   this.userDetails = resp.user;
                   this.http.get(`http://localhost:8081/cmsusermgmt/userMgmt/userRoles/${this.userDetails.userId}`).subscribe(
                    (resp: any) =>{
                        if (resp.status === 'Success') {
                           this.selectedRole = resp.userRoles.roles.split(',');
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
                   this.uploadUrl= `http://localhost:8081/cmsusermgmt/userMgmt/user/profileImage/${this.userDetails.userId}`;
                   this.getImageFromService();
                   this.dataAvailable = true;
                }
            },
            err => {
                 console.log(err);
            }
        );
        this.http.get(`http://localhost:8081/cmsusermgmt/userMgmt/role`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    const userroles = window.localStorage.getItem('role').split(',');
                    resp.roles.forEach(role => {
                        if (userroles.includes('SuperAdmin')) {
                            if (role.roleName !== 'SuperAdmin') {
                                this.rolesList.push(role.roleName);
                            }
                        } else if (userroles.includes('Admin')) {
                            if (role.roleName !== 'SuperAdmin' && role.roleName !== 'Admin') {
                                this.rolesList.push(role.roleName);
                            }
                        }
                        
                    });
                }
            },
            err => {
                console.log(err);
            }
        );

    }


    customReq = (item: UploadXHRArgs) => {
        this.isLoadingProfile = true;
        // Create a FormData here to store files and other parameters.
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);
        formData.append('userId', this.userDetails.userId);
        const req = new HttpRequest('POST', this.uploadUrl, formData, {
          reportProgress: false,
          withCredentials: false
        });
        // Always returns a `Subscription` object. nz-upload would automatically unsubscribe it at correct time.
        return this.http.request(req).subscribe(
          // tslint:disable-next-line no-any
          (event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total! > 0) {
                // tslint:disable-next-line:no-any
                (event as any).percent = (event.loaded / event.total!) * 100;
              }
              item.onProgress!(event, item.file!);
            } else if (event instanceof HttpResponse) {
              item.onSuccess!(event.body, item.file!, event);
              this.message.success(event.body.message);
              this.getImageFromService();
              this.isLoadingProfile = false;
            }
          },
          err => {
            item.onError!(err, item.file!);
            this.isLoadingProfile = false;
          }
        );
      };

      getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(this.uploadUrl, { responseType: 'blob' });
      }

      imageToShow: any;

createImageFromBlob(image: Blob) {
   let reader = new FileReader();
   reader.readAsDataURL(image);
   reader.addEventListener("load", () => {
    
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());
      
   }, false);
}
getImageFromService() {
    this.getImage(this.uploadUrl).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      console.log(error);
    });
}
    updateUser() {
        this.isLoading = true;
         const data = {
            userId: this.userDetails.userId,
            userName: this.userDetails.userName,
            email: this.userDetails.email,
            mobile: this.userDetails.mobile,
            address: this.userDetails.address,
            biography: this.userDetails.biography,
            interests: this.userDetails.interests,
            gender: this.userDetails.gender,
            dob:this.userDetails.dob
        }
        this.http.put('http://localhost:8081/cmsusermgmt/userMgmt/user', data).subscribe(
            (resp: any) =>{
                 if (resp.status === 'Success') {
                   this.message.success(resp.message);
                   this.isLoading = false;
                   this.userDetails = data;
                }
            },
            err => {
                 console.log(err);
            }
        );
        const userroles = this.selectedRole.join().toString();
        if (userroles !== '') {
            this.http.post(`http://localhost:8081/cmsusermgmt/userMgmt/userRoles/${this.userDetails.userId}`, userroles).subscribe(
                (resp: any) =>{
                     if (resp.status === 'Success') {
                        this.message.success(resp.message);
                        this.isLoading = false;
                    }
                },
                err => {
                     console.log(err);
                }
            );
        }
       
      }

}    