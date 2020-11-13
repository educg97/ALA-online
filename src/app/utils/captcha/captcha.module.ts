import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './captcha.component';
import { CaptchaRoutes } from './captcha.routes';

import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [CaptchaComponent],
  exports: [CaptchaComponent],
  imports: [
    CommonModule, 
    // RouterModule.forChild(CaptchaRoutes)
    RecaptchaModule,
    // RecaptchaFormsModule, // if you need forms support
  ]
})
export class CaptchaModule {}