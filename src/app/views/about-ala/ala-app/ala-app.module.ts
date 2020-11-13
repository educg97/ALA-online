import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlaAppComponent } from './ala-app.component';
import { AlaAppRoutingModule } from './ala-app-routing.module';
import { FormsModule } from '@angular/forms';
import { SliderCompaniesModule } from 'src/app/utils/slider-companies/slider-companies.module';
import { SliderTeachersModule } from 'src/app/utils/slider-teachers/slider-teachers.module';
import { SliderOpinionsModule } from 'src/app/utils/slider-opinions/slider-opinions.module';
import { StarPromotionModule } from 'src/app/utils/star-promotion/star-promotion.module';

@NgModule({
  declarations: [AlaAppComponent],
  exports: [AlaAppComponent],
  imports: [
    CommonModule,
    FormsModule,
    SliderCompaniesModule,
    SliderTeachersModule,
    SliderOpinionsModule,
    StarPromotionModule,
    AlaAppRoutingModule
  ]
})
export class AlaAppModule { }