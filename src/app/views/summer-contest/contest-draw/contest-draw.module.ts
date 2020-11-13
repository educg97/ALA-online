import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContestDrawComponent } from './contest-draw.component';
import { ContestDrawRoutes } from './contest-draw.routes';

@NgModule({
  declarations: [ContestDrawComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ContestDrawRoutes)
  ]
})
export class ContestDrawModule { }