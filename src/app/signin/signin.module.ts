import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninRoutingModule } from './signin.routing.module';
import { CoreModule } from '../core/core.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
// if you need forms support:
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        ReactiveFormsModule,
        SigninRoutingModule,
        RecaptchaModule,
        RecaptchaFormsModule
         // if you need forms support
    ],
    declarations: [
        LoginComponent,
        RegisterComponent
    ]
})

export class SigninModule {}