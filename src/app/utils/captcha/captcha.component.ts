import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-captcha',
  // templateUrl: './captcha.component.html',
  template: '<re-captcha (resolved)="resolved($event)" siteKey="6LcxpI8UAAAAAITij1aqDDz0gZLmAnMVsIUsEagZ"></re-captcha>',
  styleUrls: ['./captcha.component.scss']
})
// export class CaptchaComponent implements OnInit {
export class CaptchaComponent {

  // constructor() { }

  resolved(captchaResponse: string) {
      console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

}
