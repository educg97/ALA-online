import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SliderCompaniesComponent } from './slider-companies.component';

const routes: Routes = [
  { path: '', component: SliderCompaniesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderCompaniesRoutingModule { }