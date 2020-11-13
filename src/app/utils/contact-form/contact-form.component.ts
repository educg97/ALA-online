import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Google } from 'src/app/utils/google';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';

declare let fbq: any;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  isEmail: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isPhone: any = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  mailCorrect: boolean;
  phoneCorrect: boolean;
  checked: boolean = false;
  availableCourses: Object[] = [
      {courseName: "Curso intensivo de inglés online", value: "Curso intensivo de inglés"},
      {courseName: "Curso super intensivo de inglés online", value: "Curso super intensivo de inglés online"},
      {courseName: "Curso semi-intensivo de inglés online", value: "Curso semi-intensivo de inglés online"},
      {courseName: "Curso one session de inglés online", value: "Curso one session de inglés online"},
      {courseName: "Curso de preparación TOEFL® online", value: "Curso de preparación TOEFL® online"},
      {courseName: "Clases one to one de inglés online", value: "Clases one to one de inglés online"},
      {courseName: "Clases flexibles de inglés online", value: "Clases flexibles de inglés online"},
      {courseName: "Examen B1 de inglés online", value: "Examen B1 de inglés online"},
      {courseName: "Examen B2 de inglés online", value: "Examen B2 de inglés online"},
      {courseName: "Examen C1 de inglés online", value: "Examen C1 de inglés online"},
      {courseName: "Examen C2 de inglés online", value: "Examen C2 de inglés online"}
  ];

  contactData = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    selectedCourse: "",
    message: ""
  }

  sentForm: boolean;

  success_toast = {
      type: 'success',
      message: 'Tu consulta se ha enviado con éxito'
  };

  err_toast = {
      type: 'error',
      message: '¡Algo no ha ido bien!'
  }

  constructor(
    public data: DataService,
    public google: Google,
    public modal: ModalComponent,
		public scroll: ScrollComponent,
  ) { }

  ngOnInit() {
  }

  sendForm(form) {
    this.checked = true;
    if(this.isEmail.test(this.contactData.email)){
      this.mailCorrect = true; 
    } else {
      this.mailCorrect = false;
    }

    if(this.isPhone.test(this.contactData.phone)){
      this.phoneCorrect = true;
    } else {
      this.phoneCorrect = false;
    }

    if (this.phoneCorrect && this.mailCorrect) {
      this.google.contactForm();
      this.sentForm = true;
  
      this.data.sendEmail(this.contactData).subscribe(
        res => {
            // The code below is for tracking events in Google Analytics
            (<any>window).ga('send', 'event', {
              eventCategory: 'contactForm',
              eventLabel: 'footer',
              eventAction: 'ask',
              // eventValue: 10
            });
            fbq('track', 'Contact');
        },
        err => {
          if (err.status == 200) {
              // The code below is for tracking events in Google Analytics
              (<any>window).ga('send', 'event', {
                eventCategory: 'contactForm',
                eventLabel: 'footer',
                eventAction: 'ask',
                // eventValue: 10
              });
              fbq('track', 'Contact');

              this.scroll.enable();
              this.modal.closeModal();
              this.modal.newToast(this.success_toast);
          } else {
              this.modal.newToast(this.err_toast);
          }
        });
    }
  }
}