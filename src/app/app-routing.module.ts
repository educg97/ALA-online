import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import { ErrorComponent } from './views/error/error.component';
import { FormularioViajesComponent } from './views/forms/formulario-viajes/formulario-viajes.component';
import { HomeComponent } from './views/home/home.component';
// import { HomeModule } from './views/home/home.module';
import { MaintenanceComponent } from './views/error/maintenance/maintenance.component';

const routes: Routes = [
    // Maintenance - Uncomment only when the web is broken
    // { path: '**', component: MaintenanceComponent },
    // Home
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: 'home', loadChildren: './views/home/home.module#HomeModule' },

    // App To Learn English
    { path: 'app-aprender-ingles', loadChildren: './views/about-ala/ala-app/ala-app.module#AlaAppModule' },
    //About us
    { path: 'sobre-nosotros', loadChildren: './views/about-ala/about-us/about-us.module#AboutUsModule' },
    
    // Activities
    // { path: 'actividades-en-ingles-madrid', loadChildren: './views/activities/activities.module#ActivitiesModule' },
    
    // Pricing
    { path: 'tipos-de-formacion', loadChildren: './views/courses/pricing/pricing.module#PricingModule' },

    // Courses
    { path: 'examen-ingles-online', loadChildren: './views/courses/course/course.module#CourseModule' },
    { path: 'curso-ingles-online/:link', loadChildren: './views/courses/course/course.module#CourseModule' },
    
    // Terms & Conditions
    { path: 'terminos-y-condiciones', loadChildren: './views/terms/terms.module#TermsModule' },
    
    // Summer Contest 2020
    { path: 'summer-draw', loadChildren: './views/summer-contest/contest-draw/contest-draw.module#ContestDrawModule' },
    { path: 'summer-challenge', loadChildren: './views/summer-contest/contest-rules/contest-rules.module#ContestRulesModule' },

    // Form for tutorias
    { path: 'solicita-tutoria', loadChildren: './views/forms/form-tutoria/form-tutoria.module#FormTutoriaModule' },

    // Level Test
    { path: 'level-test', loadChildren: './views/level-test/level-test.module#LevelTestModule' },
    { path: 'level-test-results', loadChildren: './views/level-test-results/level-test-results.module#LevelTestResultsModule' },
    
    // List of 404 errors
    { path: 'not-found-list', loadChildren: './views/error/not-found-list/not-found-list.module#NotFoundListModule' },

    // Error Handling
    { path: 'error', component: ErrorComponent },
    { path: '**', component: ErrorComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            scrollOffset: [0, 64], // [x, y]
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
