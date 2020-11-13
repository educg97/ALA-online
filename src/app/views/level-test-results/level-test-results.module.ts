import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LevelTestResultsComponent } from './level-test-results.component';
import { LevelTestResultsRoutes } from './level-test-results.routes';
import { CountdownModule} from 'src/app/utils/countdown/countdown.module';
import { LevelTestModalModule} from 'src/app/utils/level-test-modal/level-test-modal.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LevelTestResultsComponent],
  imports: [
    CommonModule,
    FormsModule,
    CountdownModule,
    LevelTestModalModule,
    RouterModule.forChild(LevelTestResultsRoutes)
  ]
})
export class LevelTestResultsModule { }