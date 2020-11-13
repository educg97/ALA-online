import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from 'src/app/utils/calendar/calendar.component';
import { GameLetterComponent } from 'src/app/utils/game-letter/game-letter.component';
import { CalendarModule } from 'src/app/utils/calendar/calendar.module';
import { DynamicBannerModule } from 'src/app/utils/dynamic-banner/dynamic-banner.module';
import { GameLetterModule } from 'src/app/utils/game-letter/game-letter.module';

@NgModule({
  declarations: [ActivitiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    GameLetterModule,
    DynamicBannerModule,
    ActivitiesRoutingModule
  ]
})
export class ActivitiesModule { }