import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { DrawComponent } from 'src/app/utils/draws';
import { Google } from 'src/app/utils/google';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { WindowSizeComponent } from 'src/app/utils/window-size';

@Component({
  selector: 'app-level-test',
  templateUrl: './level-test.component.html',
  styleUrls: ['./level-test.component.scss']
})
export class LevelTestComponent implements OnInit {

  constructor(public windowSize: WindowSizeComponent, public google: Google, private sanitizer:DomSanitizer, public data: DataService, private scroll: ScrollComponent, public modal: ModalComponent, public draws: DrawComponent) { }

  userLevelTest: Object = {
    username: "",
    email: "",
    password: "",
    company: ""
  };
  email_status:string = "";
  password_status:string = "";
  isLogged: boolean = false;
  freeCourseUser: Object = JSON.parse(sessionStorage.getItem('freeCourseUser'));
  openLevelTest: boolean;
  openInstructions: boolean;
  levelTestAlreadyDone: boolean;

  ngOnInit() {
    // if (this.freeCourseUser) { // Si el usuario ya se ha registrado previamente ... 
    //   this.isLogged = true;
    // } else { // Si el usuario NO se ha registrado previamente ...
    //   this.modal.openModal('freeCourseEvents');
    //   this.scroll.disable();
    // }
  }

  closeRegisterModal() {
    this.modal.closeModal();
    this.scroll.enable();
  }

  openLevelTestModal() {
    this.openLevelTest = true;
    this.openInstructions = false;
  }

  closeLevelTestModal() {
    this.openLevelTest = false;
  }

  openInstructionsModal() {
    this.openInstructions = true;
  }

  login() {
    this.data.searchLevelTestUser(this.userLevelTest['email']).subscribe(
      res => {
        if (res[0]) {
          this.email_status = "";
          if (res[0].password == this.userLevelTest['password']) {
              this.userLevelTest['username'] = res[0].username;
              this.userLevelTest['company'] = res[0].company;
              this.password_status = "";
              let levelTestUser = {
                id: res[0]['_id'],
                username: this.userLevelTest['username']
              }
              window.localStorage.setItem('user-lt', JSON.stringify(levelTestUser));
              this.isLogged = true;
              this.openInstructions = true;
              if (res[0]['score'] != "") { // Si el usuario ya ha realizado la prueba de nivel, no le deja volver a hacerla
                this.levelTestAlreadyDone = true;
              }
          } else {
            this.password_status = "error";
          }
        } else {
          this.email_status = "error";
        }
      },
      err => {
        this.email_status = "error";
        console.error(err);
      }
    );
  }

  checkIfNoLevelTest() {

  }

  logout() {
    this.openLevelTest = false;
    this.openInstructions = false;
    this.isLogged = false;
    window.localStorage.removeItem('user-lt');
  }

}
