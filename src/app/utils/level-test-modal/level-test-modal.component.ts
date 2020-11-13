import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { Google } from 'src/app/utils/google';
import { timer } from 'rxjs';

@Component({
  selector: 'app-level-test-modal',
  templateUrl: './level-test-modal.component.html',
  styleUrls: ['./level-test-modal.component.scss']
})
export class LevelTestModalComponent implements OnInit, OnDestroy {

  constructor(
    public data: DataService,
    public titleService: Title,
    private meta: Meta,
    public windowSize: WindowSizeComponent,
    public google: Google
  ) { }

  ngOnInit() {
  }

  loggedUser: object = JSON.parse(localStorage.getItem('user-lt'));

  // Level Test Variables
  showTest: boolean = false;
  question: number = 1;
  rightAnswer: number;
  answerMessage: string = null;
  answerCorrection: string = null;
  answerType: string = null;  
  disableOptions: boolean = false;
  correctAnswers: number = 0;
  finalMessage: string;
  position: number;
  testData: any;
  messageEquivalence: object = {'1': 'AMensaje','2': 'BMensaje','3': 'CMensaje','4': 'DMensaje'};
  disableBtn: boolean = true;
  testHeight: number;
  answerHeight: number;
  levelTest: string;

  // CountDown Variables
  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  hours: any = 0;
  minutes: any = 30;
  seconds: any = '00';
  source = timer(0, 1000);
  clock: any; 
  time_finished: boolean;

  // CountDown Functions
  startCountdown() {
      const endDate = new Date();
      this.end = new Date().setMinutes(endDate.getMinutes() + 30);
      // this.end = new Date().setSeconds(endDate.getSeconds() + 10);
      // this.end = new Date().setSeconds(endDate.getSeconds() + 65);
      this.clock = this.source.subscribe(t => {
          if (!this.time_finished) {
              this.now = new Date();
              this.time_finished = this.showDate();
          } else {
            this.saveScore();
          }
      });
  }

  showDate(): boolean{
      let distance = this.end - this.now;
      if (distance <= 0) {
        return true;
      }

      // Si todavía no ha acabado el tiempo, sigue la cuenta atrás
      this.hours = Math.floor((distance % this._day) / this._hour);
      this.minutes = Math.floor((distance % this._hour) / this._minute);
      this.seconds = Math.floor((distance % this._minute) / this._second);

      this.hours = (this.hours < 10) ? '0'+this.hours : this.hours;
      this.minutes = (this.minutes < 10) ? '0'+this.minutes : this.minutes;
      this.seconds = (this.seconds < 10) ? '0'+this.seconds : this.seconds;
      
      return false;
  }

  // Level Test Functions
  startTest(level: string) {
    this.startCountdown();
    this.levelTest = level;
    this.getTest(level);
    this.showTest = true;
    setTimeout(() => {
      const test = document.getElementById('actual-test');
      test.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }, 200);
  }

  selectOption(position: number) {
    this.disableBtn = false;
    this.answerType = 'selected';
    this.disableOptions = true;

    // Selecting individual element
    this.position = position;
  }

  answerOption(position: number){
    if(position == this.rightAnswer){
      this.correctAnswers++;
    }
  }

  setTestHeight(){
    let testContainer = document.getElementById('actual-test');
    let answerHeight = document.querySelector('.answerMessage').clientHeight;
    testContainer.style.minHeight = testContainer.clientHeight + answerHeight + 'px';
  }

  nextQuestion(){
    this.answerOption(this.position);
    this.disableBtn = true;
    this.answerType = null;
    this.answerMessage = null;
    this.answerCorrection = null;
    this.disableOptions = false;
    const testContainer = document.getElementById('actual-test');
    testContainer.style.minHeight = 300+'px';
    if(this.question == this.testData.length){
      this.question = -1;
      this.saveScore();

      // The code below is for tracking this event in Google Analytics
      (<any>window).ga('send', 'event', {
        eventCategory: 'pruebaDeNivel',
        // eventLabel: '',
        eventAction: 'solicitar',
        // eventValue: 10
      });
      this.google.pruebaNivel();
    } else {
      this.question++;
    }
    this.checkRightAnswer(this.question);
    this.checkProgress(); 
    this.progressBar();
  }

  progressBar(){
    const bar = document.getElementById('progress-bar');
    bar.style.width = (this.question / this.testData.length) * 100 + '%';
  }

  getLevel() {
    if(this.levelTest === 'Bajo') {
        if(this.correctAnswers < this.testData.length * 0.18){
            return '(A1-)';
        } else if(this.correctAnswers < this.testData.length * 0.36){
            return '(A1)';
        } else if(this.correctAnswers < this.testData.length * 0.54){
            return '(A1+)';
        } else if(this.correctAnswers < this.testData.length * 0.72){
            return '(A2-)';
        } else if(this.correctAnswers < this.testData.length * 0.90){
            return '(A2)';
        } else {
            return '(A2+)';
        }
    } else if(this.levelTest === ' Medio') {
        if(this.correctAnswers < this.testData.length * 0.18){
            return '(B1-)';
        } else if(this.correctAnswers < this.testData.length * 0.36){
            return '(B1)';
        } else if(this.correctAnswers < this.testData.length * 0.54){
            return '(B1+)';
        } else if(this.correctAnswers < this.testData.length * 0.72){
            return '(B2-)';
        } else if(this.correctAnswers < this.testData.length * 0.90){
            return '(B2)';
        } else {
            return '(B2+)';
        }
    } else if(this.levelTest === ' Alto') {
        if(this.correctAnswers < this.testData.length * 0.16){
            return '(C1-)';
        } else if(this.correctAnswers < this.testData.length * 0.32){
            return '(C1)';
        } else if(this.correctAnswers < this.testData.length * 0.48){
            return '(C1+)';
        } else if(this.correctAnswers < this.testData.length * 0.64){
            return '(C2.1-)';
        } else if(this.correctAnswers < this.testData.length * 0.80){
            return '(C2.1)';
        } else if(this.correctAnswers < this.testData.length * 0.96){
            return '(C2.1+)';
        } else {
            return '(C2.2)';
        }
    } else {
        return 'Algo fue mal';
    }
  }

  checkProgress(){
    if(this.levelTest === 'Bajo'){
      if(this.correctAnswers < this.testData.length * 0.3){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nHas adquirido un <strong>nivel elemental (A1)</strong>. En este nivel eres capaz de <strong>producir palabras aisladas</strong> y frases de uso corriente.\n\nEl curso más recomendado para tu aprendizaje es un <strong>intensivo diario</strong>.\n\n¡Habla con uno de nuestros asesores para un <strong>seguimiento más personalizado!</strong>';
      } else if(this.correctAnswers < this.testData.length * 0.6){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>elemental avanzado (A1+)</strong>. Con este nivel puedes expresarte con <strong>frases de uso corriente</strong> y comenzar a interaccionar con frases simples.\n\nEl curso ideal para este nivel es el <strong>curso intensivo diario o semi-intensivo</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else if(this.correctAnswers < this.testData.length * 0.9){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nHas adquirido un nivel <strong>pre-intermedio inicial (A2-)</strong>, por lo que puedes interactuar con un interlocutor respondiendo a frases simples (aunque con algunos malentendidos) y <strong>utilizas frases aprendidas</strong> aunque con dificultades en la expresión.\n\nEl curso ideal para este nivel es el <strong>curso intensivo diario o semi-intensivo</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else {
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>pre-intermedio (A2)</strong>, con el que puedes participar en una breve conversación sobre temas muy sencillos y tu expresión escrita te permite <strong>entender textos cortos y sencillos</strong>.\n\nEl curso ideal para este nivel es el <strong>curso intensivo diario o semi-intensivo</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      }
    } else if(this.levelTest === ' Medio'){
      if(this.correctAnswers < this.testData.length * 0.3){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>intermedio inicial (B1-)</strong>, con el que puedes mantener una <strong>conversación con poca fluidez</strong> y errores aunque comienzas a desenvolverte en contextos profesionales.\n\n<strong>Ven a ALA</strong> y coméntanos tu objetivo para poder ofrecerte el curso que mejor se adapta a tus necesidades.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else if(this.correctAnswers < this.testData.length * 0.6){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>intermedio (B1)</strong> con el que eres capaz de <strong>expresarte y hacerte entender en inglés</strong> con interferencias estructurales.\n\nVen a ALA y <strong>coméntanos tu objetivo</strong> para poder ofrecerte el curso que mejor se adapta a tus necesidades.\n\n¡<strong>Habla con uno de nuestros asesores</strong> para obtener un seguimiento más personalizado!';
      } else if(this.correctAnswers < this.testData.length * 0.9){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>intermedio alto inicial (B2-)</strong>, por lo que puedes comunicarte pese a las interferencias estructurales y las dificultades de comprensión.\n\nTambién <strong>comienzas a ser funcionalmente activo</strong> a nivel profesional.\n\nVen a ALA y coméntanos tu objetivo para poder ofrecerte el curso que mejor se adapta a tus necesidades.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else {
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>intermedio alto (B2)</strong> con el que eres capaz de comunicarte con <strong>más de un interlocutor al mismo tiempo</strong> y comienzas a ser funcionalmente activo a nivel profesional.\n\nEl curso ideal para este nivel es semi-intensivo o cursos intensivos de <strong>Business English</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      }
    } else if(this.levelTest === ' Alto'){
      if(this.correctAnswers < this.testData.length * 0.3){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nHas adquirido un nivel <strong>pre-avanzado inicial (C1-)</strong>, con el que comprendes el idioma y <strong>te expresas con suficiente concisión</strong> en gran amplitud de contextos.\n\nA nivel profesional <strong>la funcionalidad es alta</strong> aunque con intromisiones de la lengua materna. <strong>El curso ideal para este nivel es semi-intensivo</strong> o cursos intensivos de Business English.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else if(this.correctAnswers < this.testData.length * 0.6){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>pre-avanzado (C1)</strong>, con el que manejas el idioma con gran soltura y <strong>te expresas con naturalidad</strong> aunque con intromisiones de la lengua materna.\n\nA nivel profesional puedes <strong>participar en debates y conferencias</strong> con suficiente éxito. Si quieres mejorar tus habilidades profesionales, prueba nuestros cursos de Business English o de <strong>certificación de nivel (TOEFL, TOEIC…)</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else if(this.correctAnswers < this.testData.length * 0.9){
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>avanzado inicial (C2-)</strong>, por lo que careces de barreras lingüísticas y eres <strong>ágil y sutil en tu expresión</strong> aunque la utilización de modismos y expresiones sea escasa.\n\nAprovecha al máximo tu formación con nuestros cursos de inglés profesional o de <strong>certificación de exámenes (TOEFL, TOEIC…)</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      } else {
        this.finalMessage = `${this.correctAnswers}/${this.testData.length}` + '\n\nTienes un nivel <strong>avanzado (C2)</strong> con el que presentas un dominio del idioma y total naturalidad al expresarte. Puede existir un acento lantente y, en ocasiones, falta de comprensión de modismos o expresiones.\n\nSaca el máximo partido a tu formación con nuestros cursos de inglés profesional o de <strong>certificación de exámenes (TOEFL, TOEIC…)</strong>.\n\n¡Habla con uno de nuestros asesores para obtener un seguimiento más personalizado!';
      }
    } else {
      console.log('Algo fue mal');
    }
    
  }

  // Test
  getTest(level: string){
      this.data.getTests(level).subscribe(data => {
        this.testData = data;
        this.checkRightAnswer(this.question);
      });
  }

  checkRightAnswer(question: number){
    if((question > 0) && (question <= this.testData.length)){
      const right = (this.testData[question - 1]['Correcta'] === 'B') ?
      2 : (this.testData[question - 1]['Correcta'] === 'C') ?
      3 : (this.testData[question - 1]['Correcta'] === 'D') ?
      4 : 1;
      this.rightAnswer = right;
    }
  }

  saveScore() {
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - (currentDate.getTimezoneOffset() / 60)); // Para la diferencia horaria
    const userResults: Object = {
        user_id: this.loggedUser['id'], 
        username: this.loggedUser['username'],
        score: this.correctAnswers,
        level: this.getLevel(),
        level_date: currentDate.toISOString()
    }

    this.data.setLevelTestScore(userResults).subscribe(
      res => {},
      err => {
        console.error("error saving the score", err);
      }
    );
  }

  ngOnDestroy() {
    this.saveScore();
  }

}
