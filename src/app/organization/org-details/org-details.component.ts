import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
 
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const portUsermgmt = environment.portUsermgmt;
const portOrgmgmt = environment.portOrgs;

@Component({
  selector: 'app-org-details',
  templateUrl: './org-details.component.html',
  styleUrls: ['./org-details.component.css']
})
export class OrgDetailsComponent implements OnInit {
  editMode = false;
  isLoading= false;
  dataAvailable = false;
  menuContent;
  menuList=[];
  active:boolean = true;
  isVisible: boolean = false;
  menuForm: FormGroup;
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



  constructor(private fb: FormBuilder, private http: HttpClient, private route: Router, 
    private message: NzMessageService) { }

  ngOnInit() {
    this.menuForm = this.fb.group({
      MenuName: [ null, [ Validators.required ] ],
      menuLink: [ null, [ Validators.required ] ],
      menuDescription: [ null, [ Validators.required ] ],
      status:  [ null, [ Validators.required ] ]
  });
   this.getMenuList();
  }

getMenuList() {
  this.http.get(`${apiUrl}:${portOrgmgmt}/orgmgmt/orgMenu/`).subscribe(
    (resp: any) =>{
        if (resp.status === 'Success') {
            this.menuList = resp.orgMenus;
            this.dataAvailable = true;
            this.menuList.forEach((menu) => {
              menu.submenu = [];
            })
            this.message.success(resp.message);
        }
    },
    err => {
        console.log(err);
    }
);
}
  editMenu(menuData) {
    this.menuForm.controls['MenuName'].setValue(menuData.menuName);
    this.menuForm.controls['menuLink'].setValue(menuData.menuLink);
    this.menuForm.controls['menuDescription'].setValue(menuData.menuDescription);
    this.menuForm.controls['status'].setValue(menuData.menuStatus);
    this.editMode = true;
    this.isVisible = true;
  }

  openMenuPopup() {
    this.isVisible = true;
  }
  

  addMenu() {
    if (this.editMode) {
        this.isLoading = true;
        const menu = {
          menuName: this.menuForm.value.MenuName,
          menuLink: this.menuForm.value.menuLink,
          menuDescription: this.menuForm.value.menuDescription,
          menuStatus: this.menuForm.value.status,
          id: 0,
          menuParentId: 0,
        }
        this.http.put(`${apiUrl}:${portOrgmgmt}/orgmgmt/orgMenu/`, menu).subscribe(
        (resp: any) =>{
            this.isLoading = false;
            if (resp.status === 'Success') {
                this.message.success(resp.message);
                this.handleCancel();
                this.editMode = false;
                this.getMenuList();
            }
        },
        err => {
            console.log(err);
        }
    );
    } else {
        this.isLoading = true;
        const menu = {
          menuName: this.menuForm.value.MenuName,
          menuLink: this.menuForm.value.menuLink,
          menuDescription: this.menuForm.value.menuDescription,
          menuStatus: this.menuForm.value.status,
          id: 0,
          menuParentId: 0,
          menuLevel: 0
        }
        this.http.post(`${apiUrl}:${portOrgmgmt}/orgmgmt/orgMenu/`, menu).subscribe(
        (resp: any) =>{
            this.isLoading = false;
            if (resp.status === 'Success') {
                this.message.success(resp.message);
                this.handleCancel();
                this.getMenuList();
            }
            if (resp.status === 'Error') {
                this.message.error(resp.message);
                this.handleCancel();
            }
        },
        err => {
            console.log(err);
        }
    )
    }
}


  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  
  deleteMenu(menuData) {
    this.http.delete(`${apiUrl}:${portOrgmgmt}/orgmgmt/orgMenu/${menuData.id}`).subscribe(
      (resp: any) =>{
          this.isLoading = false;
          if (resp.status === 'Success') {
              this.message.success(resp.message);
          }
          if (resp.status === 'Error') {
              this.message.error(resp.message);
          }
      },
      err => {
          console.log(err);
      }
  )
  }
}
