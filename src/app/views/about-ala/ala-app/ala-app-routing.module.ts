import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlaAppComponent } from './ala-app.component';
import { SliderCompaniesModule } from 'src/app/utils/slider-companies/slider-companies.module';
import { SliderCompaniesRoutingModule } from 'src/app/utils/slider-companies/slider-companies-routing.module';

const routes: Routes = [
  { path: '', component: AlaAppComponent }
];

@NgModule({
  imports: [
    // SliderCompaniesModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AlaAppRoutingModule { }
