import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundListComponent } from './not-found-list.component';

const routes: Routes = [
  { path: '', component: NotFoundListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotFoundListRoutingModule { }