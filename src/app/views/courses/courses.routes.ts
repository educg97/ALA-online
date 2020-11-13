import { Route } from '@angular/router';
// import { UsaFlagModule } from 'src/app/utils/usa-flag/usa-flag.module';
import { CoursesComponent } from './courses.component'
import { UsaFlagModule } from 'src/app/utils/usa-flag/usa-flag.module';
export const CoursesRoutes: Route[]=[
    {
        path: '',
        component: CoursesComponent
    }
]