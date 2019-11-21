import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'signin',
        loadChildren: () => import('../../signin/signin.module').then(m => m.SigninModule)
    }
];