import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms-routing.module';
import { StarPromotionModule } from 'src/app/utils/star-promotion/star-promotion.module';

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    StarPromotionModule,
    TermsRoutingModule
  ]
})
export class TermsModule { }