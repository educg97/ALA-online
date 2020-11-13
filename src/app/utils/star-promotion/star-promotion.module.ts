import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarPromotionComponent } from './star-promotion.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    StarPromotionComponent
  ],
  exports: [
    StarPromotionComponent
  ]
})

export class StarPromotionModule { }