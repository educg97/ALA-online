import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormTutoriaComponent } from './form-tutoria.component';

const routes: Routes = [
  { path: '', component: FormTutoriaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormTutoriaRoutingModule { }