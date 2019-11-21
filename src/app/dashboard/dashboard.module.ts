import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { NgChartjsModule } from 'ng-chartjs';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ThemeConstantService } from '../shared/services/theme-constant.service';

import { SuperadminDashboardComponent } from './superadmin/superadmin-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { EditorDashboardComponent } from './editor/editor-dashboard.component';
import { ReviewerDashboardComponent } from './reviewer/reviewer-dashboard.component';
import { AuthorDashboardComponent } from './author/author-dashboard.component';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        NgChartjsModule
    ],
    exports: [],
    declarations: [
        AdminDashboardComponent,
        SuperadminDashboardComponent,
        AuthorDashboardComponent,
        EditorDashboardComponent,
        ReviewerDashboardComponent
    ],
    providers: [
        ThemeConstantService
    ],
})
export class DashboardModule { }
