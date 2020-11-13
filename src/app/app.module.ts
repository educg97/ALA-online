import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav-desktop/nav.component';
import { ContactModule } from './nav/contact/contact.module';
import { FooterComponent } from './nav/footer/footer.component';
import { NavBannerComponent } from './nav/nav-banner/nav-banner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwitchToggleComponent } from './utils/switch-toggle/switch-toggle.component';
import { NavMobileComponent } from './nav/nav-mobile/nav-mobile.component';
import { ErrorComponent } from './views/error/error.component';
import { CountDrawComponent } from './utils/count-draw/count-draw.component';
import { FormularioViajesComponent } from './views/forms/formulario-viajes/formulario-viajes.component';
import { MaintenanceComponent } from './views/error/maintenance/maintenance.component';
import { CuriositiesComponent } from './utils/curiosities/curiosities.component';
import { ExamInscriptionModule } from './utils/exam-inscription/exam-inscription.module';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    NavBannerComponent,
    HomeComponent,
    SwitchToggleComponent,
    NavMobileComponent,
    ErrorComponent,
    CountDrawComponent,
    FormularioViajesComponent,
    MaintenanceComponent,
    CuriositiesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ContactModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
