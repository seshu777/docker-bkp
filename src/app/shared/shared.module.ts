import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { HighlightModule } from 'ngx-highlightjs';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { CodeBoxComponent } from './directives/code-box.component'
import { SearchPipe } from './pipes/search.pipe';
import { EditorDirective } from './directives/editor.directive';
@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgZorroAntdModule,
        PerfectScrollbarModule,
        CodeBoxComponent,
        HighlightModule,
        SearchPipe,
        EditorDirective
        ],
    imports: [
        RouterModule,
        CommonModule,
        HighlightModule.forRoot({ theme: 'atom-one-light'}),
        NgZorroAntdModule,
        PerfectScrollbarModule
    ],
    declarations: [
        CodeBoxComponent,
        SearchPipe,
        EditorDirective
        ],
    providers: [
        ThemeConstantService,
    ]
})

export class SharedModule { }
