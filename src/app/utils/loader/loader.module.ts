import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  LoaderComponent
  ],
  exports: [
    LoaderComponent
  ]
})

export class LoaderModule { }