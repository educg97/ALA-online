import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { RouterModule } from '@angular/router';
import { ContactRoutes } from './contact.routes';
import { FormsModule } from '@angular/forms';
import { ContactFormModule } from 'src/app/utils/contact-form/contact-form.module';


@NgModule({
  declarations: [
    ContactComponent
  ],
  exports: [ContactComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContactFormModule,
    RouterModule.forChild(ContactRoutes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactModule { }