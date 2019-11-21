import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticlesRoutingModule } from './articles.routing.module';
import { CoreModule } from '../core/core.module';
import { ArticleListComponent } from './articles-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { QuillModule } from 'ngx-quill';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        ReactiveFormsModule,
        ArticlesRoutingModule,
        QuillModule
    ],
    declarations: [
        ArticleListComponent,
        ArticleDetailsComponent,
        ArticleViewComponent
    ],
    providers: [
    ]
})

export class ArticlesModule {}