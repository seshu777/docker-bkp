import { Component } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portJournalmgmt = environment.portJournalmgmt;

@Component({
    templateUrl: './journal-details.component.html'
})

export class JournalDetailsComponent {
    avatarUrl: string = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
    journalid;
    journalDetails;
    uploadUrl;
    isLoadingBanner = false;
    isLoadingFlyer = false;
    isLoadingPdf = false;
    isLoadingLogo = false;
    rolesList =[];
    selectedUser = [];
    selectedSubject = [];
    adminsList = [];
    subjectsList = [];
    imageToShowBanner: any;
    imageToShowFlyer: any;
    imageToFlyerLogo: any;
    FlyerPdf: any;
    pdfFile;
    isLoading = false;
    skeletonLoading = false;
    dataAvailable = false;
    upoadBannerUrl;
    upoadFlyerUrl;
    uploadPdfFlyer;
    uploadFlyerLogo;
    editorConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],  
            [{ 'align': [] }],
            ['link', 'image']                        
        ]
    };
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

    constructor(private fb: FormBuilder, private modalService: NzModalService, private message: NzMessageService,
        private http: HttpClient,
        private sanitizer : DomSanitizer,
        private route: ActivatedRoute) {
            this.route.params.subscribe( params => {
               this.journalid = params.id;
            } );
    }

    ngOnInit(): void {
         //get user by id
        this.upoadBannerUrl = `${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalBanner/${this.journalid}`;
        this.upoadFlyerUrl = `${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalFlyer/${this.journalid}`;
        this.uploadPdfFlyer = `${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalPDF/${this.journalid}`;
        this.uploadFlyerLogo = `${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalLogo/${this.journalid}`;

        this.http.get(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journal/${this.journalid}`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    this.journalDetails = resp.journal;
                    if (this.journalDetails.journalPrimaryAdmin) {
                        this.selectedUser = this.journalDetails.journalPrimaryAdmin.split(',');
                    }         
                    this.imageToShowBanner = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
                    this.imageToShowFlyer = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
                    this.FlyerPdf = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
                    this.imageToFlyerLogo = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
                    this.getImageFromService(this.upoadBannerUrl);
                    this.getImageFromService(this.upoadFlyerUrl);
                    this.getPdfFromService(this.uploadPdfFlyer);
                    this.getImageFromService(this.uploadFlyerLogo)
                    this.dataAvailable = true;
                }
            },
            err => {
                 console.log(err);
            }
        );
        this.http.get(`${apiUrl}${portUsermgmt}/cmsusermgmt/userMgmt/users/Admin`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                   this.adminsList = resp.userIds;
                }
            },
            err => {
                console.log(err);
            }
        );
        this.http.get(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/subject`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    resp.subjects.forEach(element => {
                        this.subjectsList.push(element.subjectName);
                    });
                    
                }
            },
            err => {
                 console.log(err);
            }
        );

        this.http.get(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalSubjects/${this.journalid}`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    resp.journalSubjects.forEach(element => {
                        this.selectedSubject.push(element.subjectName);
                    });
                    
                }
            },
            err => {
                 console.log(err);
            }
        );
    }

    updateJournal() {
        this.isLoading= true;
        //console.log(this.journalDetails.journalUpdatedDate);
        if (this.selectedUser.length !== 0 ) {
            this.journalDetails.journalPrimaryAdmin = this.selectedUser.join().toString();
        }
        this.http.put(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journal`, this.journalDetails).subscribe(
            (resp: any) =>{
                this.isLoading= false;
                if (resp.status === 'Success') {
                    this.message.success(resp.message);
                }
            },
            err => {
                 console.log(err);
            }
        );
        if (this.subjectsList.length !== 0) {
            const data = this.subjectsList.join().toString();
            this.http.post(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journalSubjects/${this.journalid}/${data}`, {}).subscribe(
                (resp: any) =>{
                    if (resp.status === 'Success') {
                        this.message.success(resp.message);
                    }
                },
                err => {
                     console.log(err);
                }
            );
        }
    }

    getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
      }
      getPdf(imageUrl: string): Observable<ArrayBuffer> {
        return this.http.get(imageUrl, { responseType: 'arraybuffer' });
      }
    createImageFromBlob(image: Blob, url) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        if (url = this.upoadBannerUrl){
            reader.addEventListener("load", () => {
                this.imageToShowBanner = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());  
             }, false);
        } else if (url = this.upoadFlyerUrl) {
            reader.addEventListener("load", () => {
                this.imageToShowFlyer = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());  
             }, false);
        } else  {
          reader.addEventListener("load", () => {
            this.imageToFlyerLogo = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());  
         }, false);
        }
     }
     getImageFromService(url) {
         this.getImage(url).subscribe(data => {
           this.createImageFromBlob(data, url);
         }, error => {
           console.log(error);
         });
     }

     getPdfFromService(url) {
        this.getPdf(url).subscribe(data => {
            var file = new Blob([data], {type: 'application/pdf'});
            this.pdfFile = URL.createObjectURL(file);
            this.pdfFile = this.sanitizer.bypassSecurityTrustUrl(this.pdfFile.toString()); 
            this.FlyerPdf = '/assets/images/pdf.png';
        }, error => {
          console.log(error);
        });
    }
     customReqBanner = (item: UploadXHRArgs) => {
         this.isLoadingBanner = true;
        // Create a FormData here to store files and other parameters.
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);
        formData.append('journalShortName', this.journalid);
        const req = new HttpRequest('POST', this.upoadBannerUrl, formData, {
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
              this.getImageFromService(this.upoadBannerUrl);
              this.isLoadingBanner = false;
            }
          },
          err => {
            item.onError!(err, item.file!);
            this.isLoadingBanner = false;
          }
        );
      };
      customReqFlyer = (item: UploadXHRArgs) => {
          this.isLoadingFlyer = true;
        // Create a FormData here to store files and other parameters.
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);
        formData.append('journalShortName', this.journalid);
        const req = new HttpRequest('POST', this.upoadFlyerUrl, formData, {
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
              this.getImageFromService(this.upoadFlyerUrl);
            }
            this.isLoadingFlyer = false;
          },
          err => {
            item.onError!(err, item.file!);
            this.isLoadingFlyer = false;
          }
        );
      };
      customReqFlyerLogo = (item: UploadXHRArgs) => {
        this.isLoadingLogo = true;
      // Create a FormData here to store files and other parameters.
      const formData = new FormData();
      // tslint:disable-next-line:no-any
      formData.append('file', item.file as any);
      formData.append('journalShortName', this.journalid);
      const req = new HttpRequest('POST', this.uploadFlyerLogo, formData, {
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
            this.getImageFromService(this.uploadFlyerLogo);
          }
          this.isLoadingLogo = false;
        },
        err => {
          item.onError!(err, item.file!);
          this.isLoadingLogo = false;
        }
      );
    };
      customReqPdfFlyer = (item: UploadXHRArgs) => {
          this.isLoadingPdf = true;
        // Create a FormData here to store files and other parameters.
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);
        formData.append('journalShortName', this.journalid);
        const req = new HttpRequest('POST', this.uploadPdfFlyer, formData, {
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
              this.getPdfFromService(this.uploadPdfFlyer);
              this.isLoadingPdf = false;
            }
          },
          err => {
            item.onError!(err, item.file!);
            this.isLoadingPdf = false;
          }
        );
      };
}    
