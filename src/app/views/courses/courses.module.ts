import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { RouterModule } from '@angular/router';
import { CoursesRoutes } from './courses.routes';
import { DynamicBannerModule } from 'src/app/utils/dynamic-banner/dynamic-banner.module';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/utils/loader/loader.module';
// import { FreeCoursesComponent } from './free-courses/free-courses.component';


@NgModule({
  declarations: [
    CoursesComponent,
    // FreeCoursesComponent
  ],
  exports: [CoursesComponent],
  imports: [
    CommonModule,
    FormsModule,
    DynamicBannerModule,
    LoaderModule,
    RouterModule.forChild(CoursesRoutes)
  ]
})
export class CoursesModule { }