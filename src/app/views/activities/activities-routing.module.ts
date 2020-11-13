import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesComponent } from './activities.component';
// import { CalendarModule } from 'src/app/utils/calendar/calendar.module';
// import { GameLetterModule } from 'src/app/utils/game-letter/game-letter.module';

const routes: Routes = [
  { path: '', component: ActivitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }