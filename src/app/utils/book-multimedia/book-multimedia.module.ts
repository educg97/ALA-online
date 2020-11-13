import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookMultimediaComponent } from './book-multimedia.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from '../calendar/calendar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
  BookMultimediaComponent
  ],
  exports: [
    BookMultimediaComponent
  ]
})

export class BookMultimediaModule { }