import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { CourseRoutes } from './course.routes';
import { FormsModule } from '@angular/forms';
import { UsaFlagModule } from 'src/app/utils/usa-flag/usa-flag.module';
import { LoaderModule } from 'src/app/utils/loader/loader.module';
import { SliderUniversitiesModule } from 'src/app/utils/slider-universities/slider-universities.module';
import { AppointmentsModule } from 'src/app/utils/appointments/appointments.module';
import { BookMultimediaModule } from 'src/app/utils/book-multimedia/book-multimedia.module';
// import { SpanishContestModule } from '../../contests/spanish-contest/spanish-contest.module';
import { ExamInscriptionModule } from 'src/app/utils/exam-inscription/exam-inscription.module';
import { SliderTeachersModule } from 'src/app/utils/slider-teachers/slider-teachers.module';
import { BuyCourseModalModule } from 'src/app/utils/buy-course-modal/buy-course-modal.module';
import { BuyCourseTestModule } from 'src/app/utils/buy-course-test/buy-course-test.module';
import { StarPromotionModule } from 'src/app/utils/star-promotion/star-promotion.module';
import { HorseModule } from 'src/app/utils/horse/horse.module';

@NgModule({
  declarations: [
    CourseComponent
  ],
  exports: [CourseComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    SliderUniversitiesModule,
    AppointmentsModule,
    SliderTeachersModule,
    BookMultimediaModule,
    ExamInscriptionModule,
    BuyCourseModalModule,
    BuyCourseTestModule,
    // SpanishContestModule,
    UsaFlagModule,
    StarPromotionModule,
    HorseModule,
    RouterModule.forChild(CourseRoutes)]
})
export class CourseModule { }