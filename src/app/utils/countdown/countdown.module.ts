import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown.component';
import { CountdownRoutes } from './countdown.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CountdownComponent],
  exports: [CountdownComponent],
  imports: [
    CommonModule, 
    FormsModule
    // RouterModule.forChild(CountdownRoutes)
  ]
})
export class CountdownModule {}