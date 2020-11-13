import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LevelTestComponent } from './level-test.component';
import { LevelTestRoutes } from './level-test.routes';
import { CountdownModule} from 'src/app/utils/countdown/countdown.module';
import { LevelTestModalModule} from 'src/app/utils/level-test-modal/level-test-modal.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LevelTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    CountdownModule,
    LevelTestModalModule,
    RouterModule.forChild(LevelTestRoutes)
  ]
})
export class LevelTestModule { }