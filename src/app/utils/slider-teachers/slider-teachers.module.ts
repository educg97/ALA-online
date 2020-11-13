import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SliderTeachersComponent } from './slider-teachers.component';
import { SliderTeachersRoutes } from './slider-teachers.routes';

@NgModule({
  declarations: [SliderTeachersComponent],
  exports: [SliderTeachersComponent],
  imports: [
    CommonModule, 
    // RouterModule.forChild(SliderTeachersRoutes)
  ]
})
export class SliderTeachersModule {}