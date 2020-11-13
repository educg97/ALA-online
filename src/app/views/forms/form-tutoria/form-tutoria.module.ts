import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTutoriaComponent } from './form-tutoria.component';
import { FormTutoriaRoutingModule } from './form-tutoria-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormTutoriaComponent],
  imports: [
    CommonModule,
    FormsModule,
    FormTutoriaRoutingModule
  ]
})
export class FormTutoriaModule { }