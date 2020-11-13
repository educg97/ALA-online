import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LevelTestModalComponent } from './level-test-modal.component';
import { LevelTestModalRoutes } from './level-test-modal.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LevelTestModalComponent],
  exports: [LevelTestModalComponent],
  imports: [
    CommonModule, 
    FormsModule
    // RouterModule.forChild(LevelTestModalRoutes)
  ]
})
export class LevelTestModalModule {}