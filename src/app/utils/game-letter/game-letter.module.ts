import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameLetterComponent } from './game-letter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
  GameLetterComponent
  ],
  exports: [
    GameLetterComponent
  ]
})

export class GameLetterModule { }