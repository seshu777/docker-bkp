import { Component } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portJournalmgmt = environment.portJournalmgmt;

@Component({
    templateUrl: './article-details.component.html'
})

export class ArticleDetailsComponent {
    avatarUrl: string = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
    journalid;
    journalDetails;
    uploadUrl;
    rolesList =[];
    selectedUser = [];
    selectedSubject = [];
    adminsList = [];
    subjectsList = [];
    isLoading = false;
    skeletonLoading = false;
    dataAvailable = false;
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
        private route: ActivatedRoute) {
            this.route.params.subscribe( params => {
               this.journalid = params.id;
            } );
    }

    ngOnInit(): void {
         //get user by id
        this.http.get(`${apiUrl}${portJournalmgmt}/cmsjournalmgmt/journal/${this.journalid}`).subscribe(
            (resp: any) =>{
                if (resp.status === 'Success') {
                    console.log(resp.journal);
                    this.journalDetails = resp.journal;
                    this.selectedUser = this.journalDetails.journalPrimaryAdmin.split(',');
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
    onHtmlEditorKeyUpForAboutJornal(e) {
        this.journalDetails.aboutJournal = e;
    }
    onHtmlEditorKeyUpForAimScope(e) {
        this.journalDetails.aimAndScope = e;
    }
    onHtmlEditorKeyUpArticleInpress(e) {
        this.journalDetails.articleInPressText = e;
    }
    onHtmlEditorKeyUpCurrentIssue(e) {
        this.journalDetails.currentIssueText = e;
    }
    onHtmlEditorKeyUpArchivePage(e) {
        this.journalDetails.archievePageText = e;
    }
    onHtmlEditorKeyUpGuidlines(e) {
        this.journalDetails.guidlines = e;
    }
    
}    