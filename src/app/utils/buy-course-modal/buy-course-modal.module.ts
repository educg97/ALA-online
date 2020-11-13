import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuyCourseModalComponent } from './buy-course-modal.component';
import { BuyCourseModalRoutes } from './buy-course-modal.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BuyCourseModalComponent],
  exports: [BuyCourseModalComponent],
  imports: [
    CommonModule, 
    FormsModule
    // RouterModule.forChild(BuyCourseModalRoutes)
  ]
})
export class BuyCourseModalModule {}