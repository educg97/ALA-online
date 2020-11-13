import { Injectable } from '@angular/core';

declare let gtag_report_conversion_contactform: any;
declare let gtag_report_conversion: any;
declare let gtag_report_conversion_prueba_nivel: any;
declare let gtag_report_conversion_empresas: any;
declare let ga: any

@Injectable({
    providedIn: "root"
})

export class Google {
    constructor() {  }

    public contactForm(){
       return gtag_report_conversion_contactform();
    }

    public phoneBtn(){
        return gtag_report_conversion();
    }

    public pruebaNivel(){
        return gtag_report_conversion_prueba_nivel();
    }

    public companiesGForm(){
        return gtag_report_conversion_empresas();
    }

    public notFound(){
        return ga('send', 'event', 'Error', window.location.href);
    }
}