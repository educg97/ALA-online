import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderAsociationsComponent } from './slider-asociations.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  SliderAsociationsComponent
  ],
  exports: [
    SliderAsociationsComponent
  ]
})

export class SliderAsociationsModule { }