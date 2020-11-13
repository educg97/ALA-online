import { Component, OnInit, Input } from '@angular/core';
import { ModalComponent } from '../modal';
import { ScrollComponent } from '../scroll';

@Component({
  selector: 'app-exam-inscription',
  templateUrl: './exam-inscription.component.html',
  styleUrls: ['./exam-inscription.component.scss']
})
export class ExamInscriptionComponent implements OnInit {

  constructor(
    public modal: ModalComponent,
    public scroll: ScrollComponent
  ) { }

  // @Input() public webpage: string;
  webpage: string;
  imgToefl: string = 'http://api.americanlanguage.es:4200/uploads/881c5f42d9904aa7aba78cd13d867f52.png';
  imgToeic: string = 'https://www.americanlanguage.es/assets/images/logos/preparacion-examen-toeic.png';

  ngOnInit() {
    const url = window.location.pathname;
    if(url === 'preparacion-toefl'){
      this.webpage = 'preparacion-toefl';
    } else {
      this.webpage = 'preparacion-examen-toeic';
    }
  }

  openModal(){
    this.modal.openModal('info-inscription');
    this.scroll.disable();
  }

  closeModal(){
    this.modal.closeModal();
    this.scroll.enable();
  }
}
