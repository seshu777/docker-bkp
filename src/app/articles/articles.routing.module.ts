import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleListComponent } from './articles-list/article-list.component';
 import { ArticleDetailsComponent } from './article-details/article-details.component';
 import { ArticleViewComponent } from './article-view/article-view.component';

 const routes: Routes = [
    {
        path: '',
        component: ArticleListComponent,
        data: {
            title: 'Articles'
        }
    },
    {
        path: 'article-details/:id',
        component: ArticleDetailsComponent,
        data: {
            title: 'Article Details'
        }
    },
    {
        path: 'article-view/:id',
        component: ArticleViewComponent,
        data: {
            title: 'Article Preview'
        }
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ArticlesRoutingModule { }
