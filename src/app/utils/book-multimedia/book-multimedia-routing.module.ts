import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookMultimediaComponent } from './book-multimedia.component';

const routes: Routes = [
  { path: '', component: BookMultimediaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookMultimediaRoutingModule { }