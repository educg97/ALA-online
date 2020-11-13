import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})

export class Filters {

    constructor() { }

    courseFilters: object = {
        objetivo_ingles: false,
        objetivo_certificar: false,
        objetivo_empresa: false,

        modalidad_grupo: false,
        modalidad_individual: false,
        modalidad_online: false,

        alumno_adulto: false,
        alumno_joven: false,
        alumno_empresas: false
    };

    public setFilter(filter: string){
        this.courseFilters[filter] = !this.courseFilters[filter];
    }

    public setFilters(filters: object) {
        this.courseFilters = filters;
    }

    public clearFilters(){
        this.courseFilters = {
            objetivo_ingles: false,
            objetivo_certificar: false,
            objetivo_empresa: false,
    
            modalidad_grupo: false,
            modalidad_individual: false,
            modalidad_online: false,
    
            alumno_adulto: false,
            alumno_joven: false,
            alumno_empresas: false
        };
    }
} 