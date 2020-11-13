import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-form-tutoria',
  templateUrl: './form-tutoria.component.html',
  styleUrls: ['./form-tutoria.component.scss']
})
export class FormTutoriaComponent implements OnInit {

  constructor(
    public data: DataService
  ) { }

  sentForm: boolean;
  notTerms: boolean;

  ngOnInit() {

  }

  sendTutoria(form){
    if(!form['value']['terms'] || form['value']['terms'] == undefined){
      this.notTerms = true
    } else {
      const mailData = {
        name: form['value']['name'],
        surname: form['value']['surname'],
        email: form['value']['email'],
        message: form['value']['message'],
        terms: form['value']['terms']
      }

      this.sentForm = true;
  
      this.data.sendMailTutoria(mailData).subscribe(res => {
        console.log(res);
      });
    }
    
  }

}
