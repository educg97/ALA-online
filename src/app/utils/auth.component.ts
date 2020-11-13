import { Injectable } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from 'src/app/utils/modal';

@Injectable({
  providedIn: "root"
})

export class AuthComponent {

  constructor(
    private data: DataService,
    private modal: ModalComponent
  ) { }

   loginRespond: object;
   isLogged: boolean;
   user: any;

  // Public methods
  public loginAndSave(user){
    let promise = new Promise((resolve, reject) => {
      this.data.loginAulaUser(user)
      .subscribe(res => {
        if(res['data']){
          resolve(res['data'])

          let username = res['data']['username'].split('');
          let code = username.filter((letter) => {
            if(isNaN(parseInt(letter))){
              return letter;
            }
          })
          code = code.join('');
          const aulaUser = {
            ...res['data'],
            realLevel: this.data.formatLevel(res['data']['level']),
            code: code
          }
          
          localStorage.setItem('aulaUser', JSON.stringify(aulaUser));
          const userAula = JSON.parse(localStorage.getItem('aulaUser'));
          const toasts = {
            type: 'success',
            message: 'Sesión iniciada'
          };
          this.modal.newToast(toasts);
            this.user = userAula;
            this.isLogged = true;
        } else {
            const toasts = {
              type: 'error',
              message: 'Usuario o contraseña incorrectos'
            };
            this.modal.newToast(toasts);
        }
      })
    })
    return promise;
  }

  public externalLogin(user){
    this.isLogged = true;
    this.user = {
      username: user.username,
      name: user.name,
      lastName: user.lastname,
      realLevel: user.level
    }
    localStorage.setItem('aulaUser', JSON.stringify(this.user));
  }


  public logout(){
    this.data.logoutAulaUser();
    this.user = '';
    this.isLogged = false;
  }

  public checkIfLogged(){
    const localUser = JSON.parse(localStorage.getItem('aulaUser'));
    if(localUser){
      this.isLogged = true;
      this.user = localUser;
    } 
  }

}
