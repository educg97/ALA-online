import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContestRulesComponent } from './contest-rules.component';
import { ContestRulesRoutes } from './contest-rules.routes';

@NgModule({
  declarations: [ContestRulesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ContestRulesRoutes)
  ]
})
export class ContestRulesModule { }