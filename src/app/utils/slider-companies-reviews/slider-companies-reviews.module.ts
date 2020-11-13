import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SliderCompaniesReviewsComponent } from './slider-companies-reviews.component';
import { SliderCompaniesReviewsRoutes } from './slider-companies-review.routes';

@NgModule({
  declarations: [SliderCompaniesReviewsComponent],
  exports: [SliderCompaniesReviewsComponent],
  imports: [
    CommonModule, 
    // RouterModule.forChild(SliderTeachersRoutes)
  ]
})
export class SliderCompaniesReviewModule {}