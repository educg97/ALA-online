import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsaFlagComponent } from './usa-flag.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
  UsaFlagComponent
  ],
  exports: [
    UsaFlagComponent
  ]
})

export class UsaFlagModule { }