import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal';
import { DataService } from 'src/app/data.service';
import { ScrollComponent } from '../scroll';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horse',
  templateUrl: './horse.component.html',
  styleUrls: ['./horse.component.scss'],
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
export class HorseComponent implements OnInit {

  constructor(
    public modal: ModalComponent,
    public data: DataService,
    public scroll: ScrollComponent,
    public router: Router
  ) { }

  loggedPlayer: string;
  alreadyPlaying: boolean = false;
  step: number = 0;
  player: any;
  showHorse: boolean = true;
  stopGame: boolean = false;
  ongoingStep: number;
  lifes: number = 2;
  playersEmail: string[] = [];
  isEmail: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isPhone: any = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  mailCorrect: boolean;
  phoneCorrect: boolean;
  nameCorrect: boolean;
  newPlayer: boolean;
  checked: boolean = false;
  resurrectionDate: string;
  resurrectionTime: string;
  introductionFirst: boolean = true;
  introductionSecond: boolean;
  selectedQuestion: Object = null;
  url: string;
  inputQuestionCounter: number = 0;
  provForm: Object;

  questions: any = [];
  availableQuestions: any = [];

  inputQuestions: any = [
    {
      question: '¿Con cuántos años murió Amy Winehouse?',
      answer: 27
    },
    {
      question: '¿En qué año fue la batalla de las Navas de Tolosa?',
      answer: 1212
    },
    {
      question: '¿Cuándo se firmó el Tratado de Westfalia?',
      answer: 1648
    },
    {
      question: '¿Cuántos barcos se llevó Colón cuando se descubrió América?',
      answer: 3
    },
    {
      question: 'Si 50 es el 100%, ¿cuánto es el 90%?',
      answer: 45
    },
    {
      question: '¿Cuántas patas tiene la araña?',
      answer: 8
    },
    {
      question: '¿Cuándo empezó la Primera Guerra Mundial?',
      answer: 1914
    },
    {
      question: '¿En qué año se aprobó la actual Constitución española?',
      answer: 1978
    },
    // {
    //   question: '¿En qué año apareció en el mercado el primer videojuego protagonizado por Super Mario?',
    //   answer: 1981
    // },
    {
      question: '¿Cuándo llegó el primer hombre a la Luna?',
      answer: 1969
    },
    {
      question: '¿A qué edad murió Kurt Cobain?',
      answer: 27
    },
    {
      question: '¿A qué edad murió Jimi Hendrix?',
      answer: 27
    },
    {
      question: '¿A qué edad murió Jim Morrison?',
      answer: 27
    },
    {
      question: '¿En qué año se independizó Portugal de España?',
      answer: 1640
    },
    {
      question: '¿Cuántas Eurocopas de fútbol tiene Portugal?',
      answer: 1
    },
    {
      question: '¿En qué año se firmó el Tratado de Tordesillas?',
      answer: 1494
    },
    {
      question: '¿En qué año se rebeló el pueblo de Madrid contra la ocupación francesa?',
      answer: 1808
    },
    {
      question: '¿Cuántos países forman parte del Reino Unido?',
      answer: 4
    }
  ];
  selectedInputQuestion: Object;
  suggestedSearch: string[] = [
    'academia inglés madrid',
    'curso toefl madrid',
    'curso inglés madrid',
    'curso ingles empresas en madrid',
    'inmersion en ingles en madrid'
  ];
  suggestedCounter: number = 0;
  suggestedRandom: string;
  suggestedUrl: string;

  ngOnInit() {
    this.data.getQuestions().subscribe(res => {
      [].forEach.call(res, (question, i: number) => {
        question['question'] = question['Pregunta'];
        question['answers'] = [question['Opcion A'], question['Opcion B'], question['Opcion C']];
        question['correct'] = (question['Correcta'].trim() === 'Opcion A') ? question['Opcion A'] : (question['Correcta'].trim() === 'Opcion B') ? question['Opcion B'] : (question['Correcta'].trim() === 'Opcion C') ? question['Opcion C'] : '';
        question['index'] = i;
      });
      this.questions = res;
      this.availableQuestions = res;
      this.getRandomQuestion();

      this.loggedPlayer = sessionStorage.getItem('current-player');
      console.log('Logged player: ', this.loggedPlayer);


      if (this.loggedPlayer) {
        this.sessionLogin(this.loggedPlayer);
      }

      const url = window.location.pathname;
      this.url = url;

      const inputCounter = Number(sessionStorage.getItem('inputCounter'));
      this.inputQuestionCounter = inputCounter;
      const suggestedCounter = Number(sessionStorage.getItem('suggestedCounter'));
      this.suggestedCounter = suggestedCounter;

      const currentStep = Number(sessionStorage.getItem('horse-step'));
      if ((currentStep - 1) % 3 == 0) {
        this.ongoingStep = currentStep;
        this.step = currentStep;
      }

      console.log('Hasta aquí hemos llegado');
      // this.getRandomQuestion();
      // this.closeModal();

    });

    // First we want to store in the state every email we've got in the database
    // Later on will be faster to check if a player is already logged
    let playersEmail = [];
    this.data.getPlayers().subscribe(res => {
      [].forEach.call(res, player => {
        playersEmail.push(player['Email']);
      });
      this.playersEmail = playersEmail;
      // console.log('Emails: ', this.playersEmail);
    });

  }

  getRandomSearch() {
    const numSearches = this.suggestedSearch.length;
    const randomIndex = Math.floor(Math.random() * numSearches);
    const randomSearch = this.suggestedSearch[randomIndex];
    this.suggestedRandom = randomSearch;
    this.suggestedUrl = this.suggestedRandom.split(' ').join('+');
  }

  getRandomQuestion() {
    const numQuestions = this.availableQuestions.length;
    const randomIndex = Math.floor(Math.random() * numQuestions);
    const randomQuestion = this.availableQuestions[randomIndex];
    this.selectedQuestion = randomQuestion;
  }

  introductionNav(step: string) {
    if (step === 'first') {
      this.introductionFirst = false;
      this.introductionSecond = true;
    } else if (step === 'second') {
      this.introductionSecond = false;
    }
  }

  startContest() {
    this.modal.openModal('horse-contest');
    this.scroll.disable();
  }

  submitInitForm(form){
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
      this.data.getHorsesByMail(formattedForm['email']).subscribe(res => {
        if(res[0] && res[0]['Email']) {
          this.mailCorrect = true;
          if(formattedForm['phone'] === res[0]['Telefono']) {
            // Correct login
            const player = {
              ...res[0],
              'Hechas filtered': Object.values(res[0]['Hechas'])
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

  submitForm(form) {
    const formData = {
      phone: form['value']['phone'].trim(),
      email: form['value']['email'].toLowerCase().trim(),
      name: (form['value']['name']) ? form['value']['name'].trim() : ''
    }

    this.checked = true;
    if (!this.playersEmail.includes(formData['email'])) {
      if (this.isEmail.test(formData['email'])) {
        this.mailCorrect = true;
      } else {
        this.mailCorrect = false;
      }

      if (formData['name'].length >= 2) {
        this.nameCorrect = true;
      } else {
        this.nameCorrect = false;
      }

      if (this.isPhone.test(formData['phone'])) {
        this.phoneCorrect = true;
      } else {
        this.phoneCorrect = false;
      }

      if (this.phoneCorrect && this.mailCorrect && this.nameCorrect) {
        this.createPlayer(formData);
      }

    } else {
      this.loginPlayer(formData);
    }
  }

  createPlayer(form) {
    if (form['name'] !== '' && form['email'] !== '' && form['phone'] !== '') {
      const player = {
        'Nombre': form['name'],
        'Email': form['email'],
        'Puntos': 100,
        'Puntos hoy': 100,
        'Preguntas respondidas': 0,
        'Telefono': form['phone']
      }
      this.data.createPlayer(player).subscribe(res => {
        // console.log(res);
        sessionStorage.setItem('current-player', form['email']);

        // Send mail to the user 
        const user = {
          email: form['email'],
          phone: form['phone'],
          name: form['name']
        }
        this.data.sendMailHorse(user).subscribe(data => {
          console.log(data);
        });

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
        console.log(this.player);
      });
    }
  }

  loginPlayer(form) {
    console.log('Login player: ', form);
    // First we check if the user has been registered before
    this.data.getPlayers().subscribe(res => {
      [].forEach.call(res, player => {
        if (player['Email'].toLowerCase().trim() == form['email']) {
          if (player['Telefono'].trim() == form['phone']) {
            player['Hechas filtered'] = Object.values(player['Hechas']);
            sessionStorage.setItem('current-player', player['Email']);
            this.player = player;
            this.phoneCorrect = true;


            this.step = player['Preguntas respondidas'] + 1;
            // if (player['Preguntas respondidas'] >= this.questions.length) {
            if (this.player['Hechas filtered'].length >= this.questions.length) {
              // this.closeModal();
              // this.showHorse = false;
              // alert("Avisa al programador más bello de M4 de que te ha salido este mensaje");
              this.step = 1;
              const toasts = {
                type: 'success',
                message: '¡Bienvenido de nuevo!'
              }
              this.modal.newToast(toasts);
              const updatedPlayer = {
                ...this.player,
                'Preguntas respondidas': this.step,
                'Hechas': {},
                'Hechas filtered': []
              }
              this.player = updatedPlayer;

              this.filterAvailableQuestions();

              this.data.updatePlayer(this.player['id'], updatedPlayer).subscribe(data => {
                // this.player = data;
                console.log(data);
              });
            }
          } else {
            // If the phone doesn't match the user's phone (we use it as a password)
            this.phoneCorrect = false;
            const toasts = {
              type: 'error',
              message: 'Teléfono erróneo'
            }
            this.modal.newToast(toasts);
          }
        }
      });
    });
  }

  sessionLogin(mail: string) {
    this.data.getHorsesByMail(mail).subscribe(res => {
      const player = {
        ...res[0],
        'Hechas filtered': Object.values(res[0]['Hechas'])
      }
      this.player = player;
    });
  }

  filterAvailableQuestions() {
    // Add only the questions that the player hasn't replied
    this.availableQuestions = [];
    // [].forEach.call(this.questions, question => {
    //   if (!this.player['Hechas filtered'].includes(question['index'])) {
    //     this.availableQuestions.push(question);
    //   }
    // });
    this.availableQuestions = this.questions.filter(question => {
      return !this.player['Hechas filtered'].includes(question['index'])
    })
    this.getRandomQuestion();
  }

  toggleRegister() {
    this.alreadyPlaying = !this.alreadyPlaying;
  }

  closeModal() {
    this.modal.closeModal();
    this.scroll.enable();
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

  checkAnswer(question, answer) {
    if (answer === this.questions[question]['correct']) {
      this.player['Hechas filtered'].push(question);
      const toasts = {
        type: 'success',
        message: '¡Correcto! Has ganado 100 puntos'
      }
      this.modal.newToast(toasts);


      this.afterReplied();

      // Take the question out of the array
      let newQuestions = [];
      this.availableQuestions.forEach(q => {
        if (question !== q['index']) {
          newQuestions.push(q);
        }
      });
      this.availableQuestions = newQuestions;

      // Start again if the player has answered all the questions
      if (this.availableQuestions.length < 1) {
        this.availableQuestions = this.questions;
      }

      this.getRandomQuestion();

      if ((this.step - 1) % 3 === 0) {
        this.stopGame = true;
        sessionStorage.setItem('horse-step', this.step.toString());
      }

      this.player['Puntos'] += 100;
      this.player['Puntos hoy'] += 100;
      this.player['Preguntas respondidas'] = this.step;
      this.player['Hechas'] = {
        ...this.player['Hechas'],
        [question]: question
      }

      this.data.updatePlayer(this.player['id'], this.player).subscribe(data => {
        data['Hechas filtered'] = Object.values(data['Hechas']);
        this.player = data;
      });
    } else {
      const toasts = {
        type: 'error',
        message: `¡Fallaste! Perdiste 50 puntos.`
      }

      this.afterReplied();
      this.getRandomQuestion();

      const updatedPlayer = {
        ...this.player,
        'Puntos': this.player['Puntos'] - 50,
        'Puntos hoy': this.player['Puntos'] - 50
      }

      this.data.updatePlayer(this.player['id'], updatedPlayer).subscribe(updatedPlayer => {
        updatedPlayer['Hechas filtered'] = Object.values(updatedPlayer['Hechas']);
        this.player = updatedPlayer;
      });

      this.modal.newToast(toasts);
    }
  }

  answerInputQuestion(form) {
    // Falta actualizar el perfil del jugador
    const answer = form['value']['number'];
    if (answer === this.selectedInputQuestion['answer']) {
      const toasts = {
        type: 'success',
        message: '¡Correcto! Has ganado 100 puntos'
      }
      this.modal.newToast(toasts);
      this.stopGame = false;
      this.inputQuestionCounter = 0;
    } else {
      const toasts = {
        type: 'error',
        message: '¡Fallaste! Perdiste 50 puntos.'
      }
      this.modal.newToast(toasts);
      this.stopGame = false;
      this.inputQuestionCounter = 0;
    }
  }
}
