import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})

export class CountdownComponent implements OnInit {

  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  hours: any = 0;
  minutes: any = 0;
  seconds: any = 10;
  source = timer(0, 1000);
  clock: any; 
  time_finished: boolean;

  constructor() { }

  ngOnInit() {
    
  }

  startCountdown() {
      const endDate = new Date();
      // this.end = new Date().setMinutes(endDate.getMinutes() + 1);
      this.end = new Date().setSeconds(endDate.getSeconds() + 10);
      this.clock = this.source.subscribe(t => {
          if (!this.time_finished) {
              this.now = new Date();
              this.time_finished = this.showDate();
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
      
      return false;
  }

}
