import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderOpinionsComponent } from './slider-opinions.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  SliderOpinionsComponent
  ],
  exports: [
    SliderOpinionsComponent
  ]
})

export class SliderOpinionsModule { }