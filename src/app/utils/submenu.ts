import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})

export class SubmenuComponent {

    submenu: string = '';

    constructor() { }

    // PUBLIC METHODS
    public openSubmenu(modalType: string) {
        this.submenu = modalType;
    }

    public closeSubmenu() {
        this.submenu = '';
    }
}
