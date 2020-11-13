import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderCompaniesComponent } from './slider-companies.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  SliderCompaniesComponent
  ],
  exports: [
    SliderCompaniesComponent
  ]
})

export class SliderCompaniesModule { }