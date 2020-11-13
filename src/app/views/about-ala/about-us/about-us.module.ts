import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { RouterModule } from '@angular/router';
import { AboutUsRoutes } from './about-us.routes';
import { FormsModule } from '@angular/forms';
import { ContactFormModule } from 'src/app/utils/contact-form/contact-form.module';
import { SliderUniversitiesModule } from 'src/app/utils/slider-universities/slider-universities.module';
import { SliderCompaniesModule } from 'src/app/utils/slider-companies/slider-companies.module';
import { SliderAsociationsModule } from 'src/app/utils/slider-asociations/slider-asociations.module';
import { StarPromotionModule } from 'src/app/utils/star-promotion/star-promotion.module';

@NgModule({
  declarations: [
    AboutUsComponent, 
  ],
  exports: [AboutUsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContactFormModule,
    SliderUniversitiesModule,
    SliderCompaniesModule,
    SliderAsociationsModule,
    StarPromotionModule,
    RouterModule.forChild(AboutUsRoutes)
  ]
})
export class AboutUsModule { }
