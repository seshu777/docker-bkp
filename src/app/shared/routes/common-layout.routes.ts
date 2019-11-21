import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';


export const CommonLayout_ROUTES: Routes = [

    //Dashboard
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    
    //Users

    {
        path: 'users',
        canActivate: [AuthGuard],
        data: {
            title: 'Users '
        },
        loadChildren: () => import('../../users/users.module').then(m => m.UsersModule)  
    },
    

    // Journals

    {
        path: 'journals',
        canActivate: [AuthGuard],
        data: {
            title: 'Journals'
        },
        loadChildren: () => import('../../journals/journals.module').then(m => m.JournalsModule)   
    },

    // Articles
    {
        path: 'articles',
        canActivate: [AuthGuard],
        data: {
            title: 'Articles'
        },
        loadChildren: () => import('../../articles/articles.module').then(m => m.ArticlesModule)   
    },
    {
        path: 'organization',
        canActivate: [AuthGuard],
        data: {
            title: 'Organization'
        },
        loadChildren: () => import('../../organization/organization.module').then(m => m.OrganizationModule)   
    }


];