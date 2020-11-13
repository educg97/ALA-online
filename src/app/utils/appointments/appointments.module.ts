import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsComponent } from './appointments.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from '../calendar/calendar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
  AppointmentsComponent
  ],
  exports: [
    AppointmentsComponent
  ]
})

export class AppointmentsModule { }