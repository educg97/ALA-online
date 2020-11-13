import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorseComponent } from './horse.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    HorseComponent
  ],
  exports: [
    HorseComponent
  ]
})

export class HorseModule { }