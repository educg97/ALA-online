import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from './calendar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  CalendarComponent
  ],
  exports: [
    CalendarComponent
  ]
})

export class CalendarModule { }