import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ModalComponent } from '../modal';
import { DataService } from 'src/app/data.service';
import { ScrollComponent } from '../scroll';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usa-flag',
  templateUrl: './usa-flag.component.html',
  styleUrls: ['./usa-flag.component.scss'],
  animations: [
    trigger('toastOnOff', [
      state('in', style({ transform: 'translateX(80vw)' })),
      transition(':enter', [
        style({ transform: 'translateX(-80vw)' }),
        animate('600ms ease-in-out')
      ]),
      transition(':leave',
        animate('600ms ease-in-out', style({ transform: 'translateX(-80vw)' }))
      )
    ])
  ]
})
export class UsaFlagComponent implements OnInit {

  constructor(
    public modal: ModalComponent,
    public data: DataService,
    public scroll: ScrollComponent,
    public router: Router
  ) { }

  isEmail: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isPhone: any = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  questions: any[] = [];
  availableQuestions: any[] = [];
  selectedQuestion: Object;
  loggedPlayer: string;
  player: Object;
  url: string;
  step: number = 0;
  introductionFirst: boolean = true;
  introductionSecond: boolean;
  introductionThird: boolean;
  stopGame: boolean = false;
  mailCorrect: boolean;
  phoneCorrect: boolean;
  nameCorrect: boolean;
  playing: boolean = false;
  allStar: boolean;
  provForm: Object;
  checked: boolean;
  newPlayer: boolean;
  inputQuestionCounter: number = 0;
  suggestedCounter: number = 0;
  inputQuestions: any[] = [];
  normalQuestions: any[] = [];
  selectedInputQuestion: Object;
  suggestedSearch: string[] = [
    'academia inglés madrid',
    'curso toefl madrid',
    'curso inglés madrid',
    'curso ingles empresas en madrid',
    'inmersion en ingles en madrid'
  ];
  suggestedRandom: string;
  suggestedUrl: string;
  initFormBool: boolean = false;
  showLevelSwitch: boolean = false;

  ngOnInit() {
    this.data.getEnglishQuestions().subscribe(data => {
      this.questions = [].map.call(data, (question, i:number) => {
        question['question'] = question['Pregunta'];
        question['answers'] = [question['Opcion A'], question['Opcion B'], question['Opcion C']];
        question['correct'] = (question['Opcion correcta'].trim() === 'Opcion A') ? question['Opcion A'] : (question['Opcion correcta'].trim() === 'Opcion B') ? question['Opcion B'] : (question['Opcion correcta'].trim() === 'Opcion C') ? question['Opcion C'] : '';
        question['input-correct'] = question['Tipo de pregunta'] === 'fill-blanks' ? question['Respuesta numero'].trim() : '';
        question['index'] = i;

        return question;
      });

      this.normalQuestions = this.questions.filter(q => q['Tipo de pregunta'] === 'multi-choice');
      this.inputQuestions = this.questions.filter(q => q['Tipo de pregunta'] === 'fill-blanks');

      this.filterQuestionsByLevel();

      this.getRandomQuestion();

      this.loggedPlayer = sessionStorage.getItem('current-player');

      if (this.loggedPlayer) {
        this.sessionLogin(this.loggedPlayer);
        this.step++;
        this.introductionFirst = false;
        this.introductionSecond = false;
      }

      const url = window.location.pathname;
      this.url = url;

      const inputCounter = Number(sessionStorage.getItem('inputCounter'));
      this.inputQuestionCounter = inputCounter;
      const suggestedCounter = Number(sessionStorage.getItem('suggestedCounter'));
      this.suggestedCounter = suggestedCounter;

      const currentStep = Number(sessionStorage.getItem('flag-step'));
      if ((currentStep - 1) % 3 == 0) {
        this.step = currentStep;
      }

      if(sessionStorage.getItem('level') === 'all-star') {
        this.allStar = true;
      } else {
        this.allStar = false;
      }
    }); // End of Subscribe
  } // End of ngOnInit

  startContest(){
    this.modal.openModal('flag-contest');
    this.scroll.disable();
  }

  closeModal() {
    this.modal.closeModal();
    this.scroll.enable();
  }

  getRandomQuestion(){
    const numQuestions = (this.availableQuestions.length === 0) ? this.normalQuestions.length : this.availableQuestions.length;
    const randomIndex = Math.floor(Math.random() * numQuestions);
    const randomQuestion = (this.availableQuestions.length === 0) ? this.normalQuestions[randomIndex] : this.availableQuestions[randomIndex];
    this.selectedQuestion = randomQuestion;
  }

  sessionLogin(mail: string) {
    this.data.getFlagPlayersByMail(mail).subscribe(res => {
      const player = {
        ...res[0],
        'Hechas filtered': Object.values(res[0]['Preguntas respondidas']['english'])
      }
      this.player = player;
      this.availableQuestions = this.availableQuestions.filter(q => !this.player['Hechas filtered'].includes(q['index']));
      this.getRandomQuestion();
    });
  }

  introductionNav(step: string) {
    if (step === 'first') {
      this.introductionFirst = false;
      this.introductionSecond = true;
      this.introductionThird = false;
    } else if (step === 'second') {
      this.introductionSecond = false;
    }
  }


  submitInitForm(form){
    if(form['value']['email'] && form['value']['phone']) {
      this.initFormBool = false;
      const formattedForm = {
        email: form['value']['email'].toLowerCase().trim(),
        phone: form['value']['phone'].trim()
      }
  
      this.provForm = formattedForm;
  
      if (this.isEmail.test(formattedForm['email'])) {
        this.mailCorrect = true;
      } else {
        this.mailCorrect = false;
      }
  
      if (this.isPhone.test(formattedForm['phone'])) {
        this.phoneCorrect = true;
      } else {
        this.phoneCorrect = false;
      }
  
      if(this.isEmail.test(formattedForm['email']) && this.isPhone.test(formattedForm['phone'])) {
        this.data.getFlagPlayersByMail(formattedForm['email']).subscribe(res => {
          if(res[0] && res[0]['Email']) {
            this.mailCorrect = true;
            if(formattedForm['phone'] === res[0]['Telefono']) {
              // Correct login
              const player = {
                ...res[0],
                'Hechas filtered': Object.values(res[0]['Preguntas respondidas']['english'])
              }
              this.player = player;
              this.phoneCorrect = true;
              
              sessionStorage.setItem('current-player', this.player['Email']);
              this.step = this.player['Preguntas respondidas'] + 1;
              const toasts = {
                type: 'success',
                message: '¡Bienvenido de nuevo!'
              }
              this.modal.newToast(toasts);
            } else {
              this.checked = true;
              this.phoneCorrect = false;
            }
          } else {
            this.newPlayer = true;
          }
        });
      } 
    } else {
      // The user hasn't filled in the whole form
      this.initFormBool = true;
    }
    
  }

  submitNameForm(form) {
    const userName = form['value']['name'];
    if(userName.length > 2) {
      this.nameCorrect = true;
      const player = {
        name: form['value']['name'],
        ...this.provForm
      };
      
      this.createPlayer(player);
    } else {
      this.checked = true;
      this.nameCorrect = false;
    }
  }

  createPlayer(form) {
    if (form['name'] !== '' && form['email'] !== '' && form['phone'] !== '') {
      const player = {
        'Nombre': form['name'],
        'Email': form['email'],
        'Puntos': 100,
        'Telefono': form['phone'],
        'Preguntas respondidas': {
          "spanish": {},
          "english": {}
        }
      }
      this.data.createFlagPlayer(player).subscribe(res => {
        sessionStorage.setItem('current-player', form['email']);

        // Send mail to the user 
        const user = {
          email: form['email'],
          phone: form['phone'],
          name: form['name']
        }
        this.data.sendMailFlag(user).subscribe(data => {});

        res['Hechas filtered'] = [];
        this.player = res;
        this.step++;
        const toasts = {
          type: 'success',
          message: '¡Bienvenido!'
        };
        const firstPoints = {
          type: 'success',
          message: 'Has ganado 100 puntos'
        }
        this.modal.newToast(toasts);
        this.modal.newToast(firstPoints);
      });
    }
  }

  toggleSwitch() {
    this.allStar = !this.allStar;
    this.filterQuestionsByLevel();
    sessionStorage.setItem('level', `${this.allStar ? 'all-star' : 'rookie'}`);
  }

  filterQuestionsByLevel(){
    if(this.allStar) {
      this.availableQuestions = this.normalQuestions.filter(q => q['Nivel'] === 'allstar');
    } else {
      this.availableQuestions = this.normalQuestions.filter(q => q['Nivel'] === 'rookie');
    }
    this.player ? this.availableQuestions = this.availableQuestions.filter(q => !this.player['Hechas filtered'].includes(q['index'])) : null;
    this.getRandomQuestion();
  }

  checkAnswer(question, answer) {
    if (answer === this.questions[question]['correct']) {
      this.player['Hechas filtered'].push(question);
      const toasts = {
        type: 'success',
        message: `¡Correcto! Has ganado 100 puntos`
      }
      this.modal.newToast(toasts);

      this.afterReplied();

      // Take the question out of the array
      this.availableQuestions = this.availableQuestions.filter(q => q['index'] !== question);

      // Start again if the player has answered all the questions
      if (this.availableQuestions.length < 1) {
        this.filterQuestionsByLevel();
      }

      this.getRandomQuestion();

      if ((this.step - 1) % 3 === 0) {
        this.stopGame = true;
        sessionStorage.setItem('flag-step', this.step.toString());
      }

      this.player['Puntos'] += 100;
      this.player['Preguntas respondidas'] = {
        ...this.player['Preguntas respondidas'],
        "english": {
          ...this.player['Preguntas respondidas']['english'],
          [question]: question
        }
      }

      this.data.updateFlagPlayer(this.player['id'], this.player).subscribe(data => {
        data['Hechas filtered'] = Object.values(data['Preguntas respondidas']['english']);
        this.player = data;
      });
    } else {
      const toasts = {
        type: 'error',
        message: `¡Fallaste! Perdiste 50 puntos.`
      }

      this.afterReplied();
      this.getRandomQuestion();

      const lostPoints = 50;

      const updatedPlayer = {
        ...this.player,
        'Puntos': this.player['Puntos'] - lostPoints
      }

      this.data.updateFlagPlayer(this.player['id'], updatedPlayer).subscribe(updatedPlayer => {
        updatedPlayer['Hechas filtered'] = Object.values(updatedPlayer['Preguntas respondidas']['english']);
        this.player = updatedPlayer;
      });

      this.modal.newToast(toasts);
    }
  }

  afterReplied() {
    this.step++;
    this.inputQuestionCounter++;
    this.suggestedCounter++;
    sessionStorage.setItem('inputCounter', this.inputQuestionCounter.toString());
    sessionStorage.setItem('suggestedCounter', this.suggestedCounter.toString());
    if (this.inputQuestionCounter === 15) {
      this.stopGame = true;
      const length = this.inputQuestions.length;
      const randIdx = Math.floor(Math.random() * length);
      this.selectedInputQuestion = this.inputQuestions[randIdx];
    }

    if (this.suggestedCounter === 31) {
      this.stopGame = true;
      this.getRandomSearch();
    }
  }

  getRandomSearch() {
    const numSearches = this.suggestedSearch.length;
    const randomIndex = Math.floor(Math.random() * numSearches);
    const randomSearch = this.suggestedSearch[randomIndex];
    this.suggestedRandom = randomSearch;
    this.suggestedUrl = this.suggestedRandom.split(' ').join('+');
  }

  answerInputQuestion(form) {
    const answer = this.data.string_to_slug(form['value']['number']);
    const inputAnswer = this.data.string_to_slug(this.selectedInputQuestion['input-correct']);
    let points: number;
    if (answer == inputAnswer) {
      const toasts = {
        type: 'success',
        message: '¡Correcto! Has ganado 100 puntos'
      }
      this.modal.newToast(toasts);
      this.stopGame = false;
      this.inputQuestionCounter = 0;
      points = 100;
      form.reset();
    } else {
      const toasts = {
        type: 'error',
        message: '¡Fallaste! Perdiste 50 puntos.'
      }
      this.modal.newToast(toasts);
      this.stopGame = false;
      this.inputQuestionCounter = 0;
      points = -50;
    }

    const updatedPlayer = {
      ...this.player,
      'Puntos': this.player['Puntos'] + points
    }

    this.data.updateFlagPlayer(this.player['id'], updatedPlayer).subscribe(updatedPlayer => {
      updatedPlayer['Hechas filtered'] = Object.values(updatedPlayer['Preguntas respondidas']['english']);
      this.player = updatedPlayer;
    });
  }

  switchToEasy(){
    this.allStar = false;
    this.filterQuestionsByLevel();
    sessionStorage.setItem('level', `${this.allStar ? 'all-star' : 'rookie'}`);
  }

  switchToHard(){
    if(!this.allStar) {
      this.allStar = true;
      this.filterQuestionsByLevel();
      sessionStorage.setItem('level', `${this.allStar ? 'all-star' : 'rookie'}`);
    }
  }

  toggleShowLevelSwitch(){
    this.showLevelSwitch = !this.showLevelSwitch;
  }
}
