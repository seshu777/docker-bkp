import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileViewComponent } from './profile/profile-view.component';


const routes: Routes = [
    {
        path: '',
        component: UsersListComponent,
        data: {
            title: 'UsersList'
        }
    },
    {
        path: 'profile/:id',
        component: ProfileComponent,
        data: {
            title: 'Profile'
        }
    },
    {
        path: 'profile-preview/:id',
        component: ProfileViewComponent,
        data: {
            title: 'Profile View'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UsersRoutingModule { }
