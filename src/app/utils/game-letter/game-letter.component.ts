import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { ModalComponent } from '../modal';
import { ScrollComponent } from '../scroll';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-game-letter',
  templateUrl: './game-letter.component.html',
  styleUrls: ['./game-letter.component.scss'],
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
export class GameLetterComponent implements OnInit {

  @Output() gameLetter = new EventEmitter();

  constructor(
    public modal: ModalComponent,
    public scroll: ScrollComponent,
    public data: DataService
  ) { }

  letterHTML: string = '<p>Deer suite students</p><p>I don\'t want to steel to much of your time, but when you are righting something four my class, bee shore that you are using the write homophones. Eye cannot tell you how unintelligent you look win you use the wrong word, and my I\'s cannot bear to sea these mistakes anymore. There a terrible site to see. I don\'t want to brake your spirit, but I know that you won\'t improve buy yourself. Also, their are know excuses for using the wrong words cause you hvae the education too know better. Your smart enough to no the differences, butt you rush threw you\'re work and mess up. Then, it seems like the son isn\'t shining.</p>';
  wordsList: any;
  counter: number = 0;
  prizeAmount: number = 10;
  wordsCorrected: string[] = [];
  wordToCheck: string;
  correctWord: string;
  firstTryWord: string = '';

  firstTryStep: boolean;
  loopTryStep: boolean;
  winnerModal: boolean;
  afterMailMsg: boolean = false;

  ngOnInit() {
    let letter = this.letterHTML.split(" ");
    this.letterHTML = letter.join("</span> <span class='word'>");
    letter = this.letterHTML.split("<p>");
    this.letterHTML = letter.join("<p><span class='word'>");
    letter = this.letterHTML.split("</p>");
    this.letterHTML = letter.join("</span></p>");
    // console.log(this.letterHTML);
    this.emitGameInfo();
  }
  
  ngAfterViewInit() {
    const words = document.querySelectorAll(".word");
    this.wordsList = words;
    this.emitGameInfo();
    // console.log(words);
    // for(const word of Array.from(words)){
    //   word.addEventListener('click', (e) => {
    //     console.log(this.wordsList[e.eventPhase].innerText);
    //   });
    // }

    // Second try

    // [].forEach.call(words, word => {
    //   word.addEventListener('click', () => {
    //     console.log(this.wordsList[this.counter].innerText);
    //   });
    //   this.counter++;
    //   console.log(this.counter);
    // }); 
  }

  emitGameInfo(){
    this.gameLetter.emit({
      winnerModal: this.winnerModal,
      wordToCheck: this.wordToCheck,
      firstTryStep: this.firstTryStep,
      afterMailMsg: this.afterMailMsg,
      correctWord: this.correctWord,
      counter: this.counter,
      wordsCorrected: this.wordsCorrected,
      prizeAmount: this.prizeAmount,
      closeModal: () => this.closeModal()
    });
  }

  checkWord(current, correct){
    if(current === correct) {
      const toasts = {
        type: 'success',
        message: '¡Esta palabra es correcta!'
      }
      this.modal.newToast(toasts);
    } else if(this.wordsCorrected.includes(`${current}-${correct}`)) {
      // alert("Esta ya la habías hecho, ¡rufián!");
      const toasts = {
        type: 'success',
        message: '¡Esta ya la habías hecho!'
      }
      this.modal.newToast(toasts);
    } else {
      // const response = prompt(`¡${current} es incorrecta! ¿Cuál sería la correcta?`);
      
      // First try
      this.wordToCheck = current;
      this.correctWord = correct;
      this.firstTryStep = true;
      this.winnerModal = false;
      this.afterMailMsg = false;
      this.modal.openModal('game-letter-winner');
      this.scroll.disable();
    }
    this.emitGameInfo();
  }

  closeModal() {
    this.scroll.enable();
    this.modal.closeModal();
  }

  sendFristTry(form) {
    const response = form['value']['firstTry'];

    if(response.toLowerCase().trim() === this.correctWord.toLowerCase().trim()) {
        const toasts = {
          type: 'success',
          message: `¡Muy bien! ¡${response} es correcta!`
        }
        this.modal.newToast(toasts);
        this.counter++;
        this.wordsCorrected.push(`${this.wordToCheck}-${this.correctWord}`);
        form.reset();
        if(this.counter == this.prizeAmount) {
          this.winnerModal = true;
          this.firstTryStep = false;
        } else {
          this.closeModal();
        }
      } else {
        const toasts = {
          type: 'error',
          message: `¡Prueba otra vez!`
        }
        this.modal.newToast(toasts);
      }
      this.emitGameInfo();
  }

  sendWinner(form){
    // console.log(form['value']['email']);
    this.winnerModal = false;
    this.afterMailMsg = true;
    this.data.sendShirtVoucher({email: form['value']['email']}).subscribe(res => {
      console.log(res);
    });
    this.emitGameInfo();
  }
}
