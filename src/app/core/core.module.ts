import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [
    CommonModule, RouterModule, FormsModule
  ],
  declarations: [],
  providers: [
    AuthGuard   ]
})
export class CoreModule { }
