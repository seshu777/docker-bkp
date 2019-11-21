import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgDetailsComponent } from './org-details/org-details.component';


 const routes: Routes = [
    {
        path: '',
        component: OrgDetailsComponent,
        data: {
            title: 'Organization'
        }
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrganizationRoutingModule { }
