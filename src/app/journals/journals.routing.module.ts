import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

 import { JournalListComponent } from './journals-list/journal-list.component';
 import { JournalDetailsComponent } from './journal-details/journal-details.component';
 import { JournalViewComponent } from './journal-view/journal-view.component';

 const routes: Routes = [
    {
        path: '',
        component: JournalListComponent,
        data: {
            title: 'Journals'
        }
    },
    {
        path: 'journal-details/:id',
        component: JournalDetailsComponent,
        data: {
            title: 'Journal Details'
        }
    },
    {
        path: 'journal-view/:id',
        component: JournalViewComponent,
        data: {
            title: 'Journal Preview'
        }
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class JournalsRoutingModule { }
