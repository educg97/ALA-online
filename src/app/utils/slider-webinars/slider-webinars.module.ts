import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SliderWebinarsComponent } from './slider-webinars.component';
import { SliderWebinarsRoutes } from './slider-webinars.routes';

@NgModule({
  declarations: [SliderWebinarsComponent],
  exports: [SliderWebinarsComponent],
  imports: [
    CommonModule, 
    // RouterModule.forChild(SliderTeachersRoutes)
  ]
})
export class SliderWebinarsModule {}