import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuyCourseTestComponent } from './buy-course-test.component';
import { BuyCourseTestRoutes } from './buy-course-test.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BuyCourseTestComponent],
  exports: [BuyCourseTestComponent],
  imports: [
    CommonModule, 
    FormsModule
    // RouterModule.forChild(BuyCourseTestRoutes)
  ]
})
export class BuyCourseTestModule {}