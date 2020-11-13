import { Injectable } from '@angular/core';
import { DrawComponent } from './draws';

@Injectable({
  providedIn: "root"
})

export class ModalComponent {

  modals: string = '';
  toasts: object[] = [];
  toastActive: boolean = false;

  constructor(
    public draws: DrawComponent
  ) { }

   // PUBLIC METHODS
   public openModal(modalType: string){
    this.modals = modalType;
  }

  public closeModal(){
    this.modals = '';
    this.draws.showStar = false;
  }

  public newToast(content: object){
    this.toasts.push(content);
    setTimeout(() => {
      this.toasts.shift();
    }, 2000);
  }
}
