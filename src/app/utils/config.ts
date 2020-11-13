import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})

export class Config  {

    appointmentsAtSameTime: number;
    header_image: string;
    hooman: number;

    constructor() {}
}