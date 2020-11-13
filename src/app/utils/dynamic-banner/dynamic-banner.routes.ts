import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicBannerComponent } from './dynamic-banner.component';

const routes: Routes = [
    {
        path: '', component: DynamicBannerComponent
    },
    // { path: '/cursos-ingles-madrid', redirectTo: '/cursos-ingles-madrid' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamicBannerRoutingModule { }