import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperadminDashboardComponent } from './superadmin/superadmin-dashboard.component';
const routes: Routes = [
    {
        path: '',
        component: SuperadminDashboardComponent,
        data: {
            title: 'Dashboard ',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }
