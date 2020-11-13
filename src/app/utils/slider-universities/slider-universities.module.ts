import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderUniversitiesComponent } from './slider-universities.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  SliderUniversitiesComponent
  ],
  exports: [
    SliderUniversitiesComponent
  ]
})

export class SliderUniversitiesModule { }