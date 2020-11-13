import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamInscriptionComponent } from './exam-inscription.component';
import { RouterModule } from '@angular/router';
import { ExamInscriptionRoutes } from './exam-inscription.routes';
import { FormsModule } from '@angular/forms';
import { ContactFormModule } from '../contact-form/contact-form.module';


@NgModule({
  declarations: [ExamInscriptionComponent],
  exports: [ExamInscriptionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContactFormModule
    // RouterModule.forChild(ExamInscriptionRoutes)
  ]
})
export class ExamInscriptionModule { }