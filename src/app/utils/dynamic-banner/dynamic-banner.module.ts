import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

// import { RouterModule } from '@angular/router';
// import { DynamicBannerRoutes } from './dynamic-banner.routes';
// import { DynamicBannerRoutingModule } from './dynamic-banner.routes';

import { DynamicBannerComponent } from './dynamic-banner.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    DynamicBannerComponent
  ],
  exports: [
    DynamicBannerComponent
  ]
})

export class DynamicBannerModule { }