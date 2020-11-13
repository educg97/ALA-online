import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { DrawComponent } from 'src/app/utils/draws';
import { Google } from 'src/app/utils/google';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { WindowSizeComponent } from 'src/app/utils/window-size';

@Component({
  selector: 'app-level-test-results',
  templateUrl: './level-test-results.component.html',
  styleUrls: ['./level-test-results.component.scss']
})
export class LevelTestResultsComponent implements OnInit {

  constructor(public windowSize: WindowSizeComponent, public google: Google, private sanitizer:DomSanitizer, public data: DataService, private scroll: ScrollComponent, public modal: ModalComponent, public draws: DrawComponent) { }

  logged: boolean;
  user: Object = {
      username: "",
      email: "",
      password: "",
      company: ""
  }
  email_status: string = "";
  password_status: string = "";
  userList: Object[] = [];
  usersToShow: Object[] = [];
  currentUsersPage: number = 0;
  totalPages: number = 1;
  valueSorted: Object = {
      username: false,
      email: false,
      level: false,
      difficulty: false,
      score: false,
      date: false,
      company: false
  }
  levelValues: any= {
      "": 0,
      "(A1-)": 1,
      "(A1)": 2,
      "(A1+)": 3,
      "(A2-)": 4,
      "(A2)": 5,
      "(A2+)": 6,
      "(B1-)": 7,
      "(B1)": 8,
      "(B1+)": 9,
      "(B2-)": 10,
      "(B2)": 11,
      "(B2+)": 12,
      "(C1-)": 13,
      "(C1)": 14,
      "(C1+)": 15,
      "(C2.1-)": 16,
      "(C2.1)": 17,
      "(C2.1+)": 18,
      "(C2.2)": 19
  }
  difficulty_value: any = {
      "": 0,
      "Nivel Básico": 1,
      "Nivel Medio": 31,
      "Nivel Avanzado": 60
  }

  sliderPosition: number = 0;
  sliderImgPosition: number = 0;
  showReport: boolean;
  reportPos: number;

  ngOnInit() {
    this.scroll.disable();
  }

  login() {
    this.data.searchLevelTestUser(this.user['email']).subscribe(
      res => {
        if (res[0] && res[0]['admin_user']) {
          this.email_status = "";
          if (res[0].password == this.user['password']) {
              this.user['username'] = res[0].username;
              this.user['company'] = res[0].company;
              this.password_status = "";
              this.logged = true;
              this.getUserList();
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

  getUserList() {
    this.data.getLevelTestList(this.user['company']).subscribe(
      res => {
          [].forEach.call(res, user => {
            user.levelDescription = this.getLevelReport(user['level']);
            if (!user['admin_user']) {
                user['difficulty_level'] = this.getUserLevelDifficulty(user['level']);
                this.userList.push(user);
            }
          });

          this.usersToShow = this.userList.slice(0, 5);
          this.totalPages = (this.userList.length % 5 == 0) ? Math.trunc(this.userList.length) / 5 : (Math.trunc(this.userList.length / 5) + 1)
      }, 
      err => {
          console.error(err);
      }
    );
  }

  changePage(position) {
    if (position == 'left') {
      this.currentUsersPage --;
    } else {
      this.currentUsersPage++;
    }
    this.usersToShow = this.userList.slice(0 + this.currentUsersPage * 5, 5 + this.currentUsersPage * 5);
  }

  getUserLevelDifficulty(userLevel: string) {
      if (userLevel.substr(0, 2) == "(A") {
          return "Nivel Básico";
      } else if (userLevel.substr(0, 2) == "(B") {
          return "Nivel Medio";
      } else if (userLevel.substr(0, 2) == "(C") {
          return "Nivel Avanzado";
      }
      return "";
  }

  sortListByStringValue(value) {
    this.userList.sort(function (a, b) {
      if (a[value].toLowerCase() > b[value].toLowerCase()) {
        return 1;
      }
      if (a[value].toLowerCase() < b[value].toLowerCase()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  sortValueByNumberValue() {
    const difficulty_values: Object = this.difficulty_value;
    this.userList.sort(function (a, b) {
      a['score'] = (a['score'] == "") ? "0" : a['score'];
      b['score'] = (b['score'] == "") ? "0" : b['score'];
      if ((Number(a['score']) + difficulty_values[a['difficulty_level']])  > (Number(b['score']) + difficulty_values[b['difficulty_level']])) {
        return 1;
      }
      if ((Number(a['score']) + difficulty_values[a['difficulty_level']])  < (Number(b['score']) + difficulty_values[b['difficulty_level']])) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  sortValueByDate() {
    this.userList.sort(function (a, b) {
      let dateA = new Date(a['lt-date']);
      let dateB = new Date(b['lt-date']);

      if (dateA > dateB) {
        return 1;
      }
      if (dateA < dateB) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  sortValuesByLevel() {
    const values: Object = this.levelValues;
    this.userList.sort(function (a, b) {
      let levelAValue = values[a['level']];
      let levelBValue = values[b['level']];

      if (levelAValue > levelBValue) {
        return 1;
      }
      if (levelAValue < levelBValue) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  invertListByStringValue(value) {
    this.userList.sort(function (a, b) {
      if (a[value].toLowerCase() < b[value].toLowerCase()) {
        return 1;
      }
      if (a[value].toLowerCase() > b[value].toLowerCase()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  invertValueByNumberValue() {
    const difficulty_values: Object = this.difficulty_value;
    this.userList.sort(function (a, b) {
      a['score'] = (a['score'] == "") ? "0" : a['score'];
      b['score'] = (b['score'] == "") ? "0" : b['score'];
      if ((Number(a['score']) + difficulty_values[a['difficulty_level']])  < (Number(b['score']) + difficulty_values[b['difficulty_level']])) {
        return 1;
      }
      if ((Number(a['score']) + difficulty_values[a['difficulty_level']])  > (Number(b['score']) + difficulty_values[b['difficulty_level']])) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  invertValueByDate() {
    this.userList.sort(function (a, b) {
      let dateA = new Date(a['lt-date']);
      let dateB = new Date(b['lt-date']);

      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  invertValuesByLevel() {
    const values: Object = this.levelValues;
    this.userList.sort(function (a, b) {
      let levelAValue = values[a['level']];
      let levelBValue = values[b['level']];

      if (levelAValue < levelBValue) {
        return 1;
      }
      if (levelAValue > levelBValue) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  sortList(value: string) {
    if (value == 'score') {
      this.sortValueByNumberValue();
    } else if (value == 'date') {
      this.sortValueByDate();
    } else if (value == 'level') {
      this.sortValuesByLevel();
    } else {
      this.sortListByStringValue(value);
    }
    
    this.currentUsersPage = 0;
    this.usersToShow = this.userList.slice(0 + this.currentUsersPage * 5, 5 + this.currentUsersPage * 5);
    Object.keys(this.valueSorted).forEach(key => {
        if (key != value) {
          this.valueSorted[key] = false;
        } else {
          this.valueSorted[key] = true;
        }
    })
  }

  invertList(value: string) {
    if (value == 'score') {
      this.invertValueByNumberValue();
    } else if (value == 'date') {
      this.invertValueByDate();
    } else if (value == 'level') {
      this.invertValuesByLevel();
    } else {
      this.invertListByStringValue(value);
    }
    
    this.currentUsersPage = 0;
    this.usersToShow = this.userList.slice(0 + this.currentUsersPage * 5, 5 + this.currentUsersPage * 5);
    this.valueSorted[value] = false;
  }

  moveSlider(str: string) {
      if (str === 'right') {
          this.sliderPosition = 1;
      } else {
          this.sliderPosition = 0;
      }

      const sliderOptions = document.getElementsByClassName('results-content')[0];
      const cardWidth = document.querySelector('.scrollable-option').clientWidth;
      if (this.windowSize.isDesktop) {
          sliderOptions.scrollLeft = this.sliderPosition*cardWidth;
      } else {
          sliderOptions.scrollLeft = this.sliderPosition*this.windowSize.windowSize;
      }
  }

  moveImgSlider(str: string) {
    if (str === 'right') {
        this.sliderImgPosition = 1;
    } else {
        this.sliderImgPosition = 0;
    }

    const sliderOptions = document.getElementsByClassName('lt-images')[0];
    const cardWidth = document.querySelector('.image-container').clientWidth;
    if (this.windowSize.isDesktop) {
        sliderOptions.scrollLeft = this.sliderImgPosition*cardWidth;
    } else {
        sliderOptions.scrollLeft = this.sliderImgPosition*this.windowSize.windowSize;
    }
}

  showReportFunction(pos: number) {
    this.showReport = true;
    this.reportPos = pos;
  }

  getLevelReport(userLevel: string){
      switch(userLevel) {
          case "(A1-)": {
              return "<p><strong>Elemental inicial.</strong></p> <br> <p>El candidato carece de conocimientos en el idioma inglés.</p>";
          }
          case "(A1)": {
              return "<p><strong>Elemental medio.</strong></p> <br> <p>El candidato produce palabras aisladas y frases de uso muy corriente. Identifica palabras en textos sencillos que le permiten darse una idea sobre lo que trata el texto. Carece de funcionalidad profesional.</p>";
          }
          case "(A1+)": {
              return "<p><strong>Elemental avanzado.</strong></p> <br> <p>El candidato puede expresarse mínimamente con frases de uso muy corriente. Carece de funcionalidad profesional.</p>";
          }
          case "(A2-)": {
              return "<p><strong>Preintermedio inicial.</strong></p> <br> <p>El candidato puede interaccionar con su interlocutor respondiendo a frases muy simples, produciéndose malentendidos. Utiliza frases aprendidas y carece de autonomía de expresión. No puede hacer frases completas y es difícil entenderle. Carece de funcionalidad profesional.</p>";
          }
          case "(A2)": {
              return "<p><strong>Preintermedio medio.</strong></p> <br> <p>El candidato puede participar en una conversación muy básica y limitada, sujeta a estructuras y vocabulario muy básico. Carece de funcionalidad profesional.</p>";
          }
          case "(A2+)": {
              return "<p><strong>Preintermedio avanzado.</strong></p> <br> <p>El candidato puede participar en una conversación sobre temas muy sencillos. Su comprensión escrita le permite entender textos cortos y sencillos. Carece de funcionalidad profesional en casi todos los contextos.</p>";
          }
          case "(B1-)": {
              return "<p><strong>Intermedio inicial.</strong></p> <br> <p>El candidato puede mantener una conversación con muy poca fluidez y con errores muy frecuentes. Empieza a poder desenvolverse en determinados contextos profesionales con muy poca destreza. Su funcionalidad profesional es muy limitada.</p>";
          }
          case "(B1)": {
              return "<p><strong>Intermedio medio.</strong></p> <br> <p>El candidato es capaz de expresarse y hacerse entender en inglés, pero las interferencias estructurales son notorias y la fluidez es escasa. Su funcionalidad profesional es muy limitada.</p>";
          }
          case "(B1+)": {
              return "<p><strong>Intermedio avanzado.</strong></p> <br> <p>El candidato es capaz de expresarse y hacerse entender en inglés pese a las interferencias estructurales y sin ser fluido. Su funcionalidad profesional es bastante limitada.</p>";
          }
          case "(B2-)": {
              return "<p><strong>Intermedio alto-inicial.</strong></p> <br> <p>El candidato es capaz de comunicarse pese a las interferencias estructurales y las dificultades de comprensión del interlocutor. Es capaz de contrastar y diferenciar sus pensamientos expresándose de forma oral y escrita. El candidato es funcionalmente activo en inglés a nivel profesional aunque con dificultades e intromisiones. Se producen errores de comunicación.</p>";
          }
          case "(B2)": {
              return "<p><strong>Intermedio alto-medio.</strong></p> <br> <p>El candidato es capaz de comunicarse con más de un interlocutor al tiempo. Su funcionalidad profesional es activa aunque comete muchos errores lingüísticos que pueden dar lugar a malentendidos.</p>";
          }
          case "(B2)": {
              return "<p><strong>Intermedio alto avanzado.</strong></p> <br> <p>El candidato es capaz de comunicarse con más de un interlocutor al tiempo y de acomodar las estrategias apropiadas a las circunstancias aunque se producen bastantes errores. Su funcionalidad profesional es activa, con dificultades puede empezar a participar con cierto éxito en reuniones en grupo.</p>";
          }
          case "(C1-)": {
              return "<p><strong>Preavanzado inicial.</strong></p> <br> <p>El candidato comprende el idioma y se expresa con suficiente concisión lo cual le permite utilizar el idioma en gran amplitud de contextos. A nivel profesional es un interlocutor activo aunque con errores lingüísticos e intromisiones bastantes frecuentes de la lengua materna.</p>";
          }
          case "(C1)": {
              return "<p><strong>Preavanzado medio.</strong></p> <br> <p>El candidato maneja el idioma con gran soltura. Al hablar se expresa con naturalidad, aunque con intromisiones de la lengua materna. El candidato puede participar en debates y conferencias con suficiente éxito.</p>";
          }
          case "(C1)": {
              return "<p><strong>Preavanzado avanzado.</strong></p> <br> <p>El candidato es ágil en la utilización del idioma, se le presentan pocas barreras. Participa en debates y conferencias con soltura y gran destreza en el uso del lenguaje. Su naturalidad y creatividad le permiten gran concreción. Su participación en conferencias, negociaciones y debates se realiza sin problemas aunque existen intromisiones de la lengua materna.</p>";
          }
          case "(C2.1-)": {
              return "<p><strong>Avanzado inicial.</strong></p> <br> <p>El candidato carece de barreras lingüísticas. Es ágil y sutil en su expresión aunque se detectan errores gramaticales y la utilización de modismos o expresiones es escasa.</p>";
          }
          case "(C2.1)": {
              return "<p><strong>Avanzado medio.</strong></p> <br> <p>El candidato presenta casi total naturalidad en la utilización del idioma. Puede existir un acento latente, falta de comprensión de algunos modismos o expresiones.</p>";
          }
          case "(C2.1+)": {
              return "<p><strong>Avanzado avanzado.</strong></p> <br> <p>El dominio del idioma es total. Casi no se pueden encontrar errores o interferencias de la lengua materna.</p>";
          }
          case "(C2.2)": {
              return "<p><strong>Superior.</strong></p> <br> <p>El dominio del idioma es comparable al de una persona culta nativa en el idioma.</p>";
          }
          default: {
              return "Nivel no encontrado";
          }
      }
  }

  getLevelValue(level: string): number {
    this.levelValues.forEach(element => {
        if (element['level'] == level) {
            return element['value'];
        }
    });
    return 0;
  }

  closeReportModal() {
      this.showReport = false;
  }

  logout() {
    this.user['username'] = "";
    this.user['email'] = "";
    this.user['password'] = "";
    this.userList = [];
    this.usersToShow = [];
    this.logged = false;
  }

}
