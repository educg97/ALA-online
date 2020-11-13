import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactFormComponent } from './contact-form.component';
import { FormsModule } from '@angular/forms';

import { CaptchaModule } from 'src/app/utils/captcha/captcha.module';

@NgModule({
  imports: [
      FormsModule,
      CommonModule,
      CaptchaModule,
  ],
  declarations: [
  ContactFormComponent
  ],
  exports: [
    ContactFormComponent
  ]
})

export class ContactFormModule { }