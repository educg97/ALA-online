import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundListComponent } from './not-found-list.component';
import { NotFoundListRoutingModule } from './not-found-list-routing.module';

@NgModule({
  declarations: [NotFoundListComponent],
  imports: [
    CommonModule,
    NotFoundListRoutingModule
  ]
})
export class NotFoundListModule { }