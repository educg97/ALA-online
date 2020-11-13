import { Component, OnInit, EventEmitter, Output, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

	// This is for activities
	@Output() today = new EventEmitter();
	@Output() reloadEvents = new EventEmitter();
	@Output() updateCalendarData = new EventEmitter();

	// This is for appointments
	@Output() newDay = new EventEmitter();

	// We need to check where is this component invoked
	@Input() from: string;

  constructor() { }

  currentMonth: number;
	currentMonthName: string;
	currentYear: number;
	daysOfCurrentMonth: number;
	firstDayCurrentMonth: number;
	arrOfDays: object[] = [];
	weekendsArray: object[];
	whiteBoxes: object;
	currentDay: number;
	months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	isActivities: boolean;

  ngOnInit() {
    this.currentDay = Number(new Date().toLocaleDateString('es-ES').split('/')[0]);
		this.currentMonth = Number(new Date().toLocaleDateString('es-ES').split('/')[1]);
		this.currentMonthName = this.months[Number(new Date().toLocaleDateString('es-ES').split('/')[1]) - 1];
		this.currentYear = Number(new Date().getFullYear());

		// this.daysOfCurrentMonth = Number(new Date(this.currentYear, this.currentMonth, 0).getDate());
		// this.firstDayCurrentMonth = new Date(new Date().getFullYear(), Number(new Date().toLocaleDateString('es-ES').split('/')[1]) - 1, 1).getDay();
  
		// this.getCalendar();
		
    // Drawing calendar
		this.getMonthData();

    // Emitting calendar to parent
		this.emitCalendarInfo();
		
		// Check if is coming from activities
		const url = window.location.pathname;
		if(url == '/actividades-en-ingles-madrid'){
			this.isActivities = true;
		}
	}

  // These are the functions that create the calendar

  createArray(i: number) {
		let arr = new Array(i);
		return arr;
	}
  
  // These functions let you interact with the calendar

  selectDay(day: number) {
    this.currentDay = day;
		this.emitCalendarInfo();
		this.newDay.emit(this.currentDay);
  }
  
	selectMonth(str) {
		if (str === 'next') {
			this.currentYear += Math.floor(this.currentMonth/12);
			this.currentMonth = (this.currentMonth % 12) + 1;
			this.currentMonthName = this.months[this.currentMonth - 1];
		} else {
			this.currentYear -= Math.floor((12 + 1 - this.currentMonth) / 12);
			this.currentMonth = Math.floor((12 + 1 - this.currentMonth) / 12) * 12 + ((this.currentMonth - 1) % 12);
			this.currentMonthName = this.months[this.currentMonth - 1];
		}
		this.getMonthData();
		this.emitCalendarInfo();
		this.updateCalendar(str);
	}

  getMonthData() {
		this.daysOfCurrentMonth = Number(new Date(this.currentYear, this.currentMonth, 0).getDate());
		this.firstDayCurrentMonth = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
		this.firstDayCurrentMonth = Math.floor((6-this.firstDayCurrentMonth)/6) * 7 + this.firstDayCurrentMonth;
		this.getCalendar();
		this.checkWeekends();
	}
	
	getCalendar(){
		this.whiteBoxes = this.createArray(this.firstDayCurrentMonth - 1);
		this.arrOfDays = this.createArray(this.daysOfCurrentMonth);
	}
  
  emitCalendarInfo(){
		
    this.today.emit({
      currentMonth: this.currentMonth,
      currentMonthName: this.currentMonthName,
      currentYear: this.currentYear,
      daysOfCurrentMonth: this.daysOfCurrentMonth,
      firstDayCurrentMonth: this.firstDayCurrentMonth,
      arrOfDays: this.arrOfDays,
      whiteBoxes: this.whiteBoxes,
      currentDay: this.currentDay
    });
	}

	updateData(){
		this.updateCalendarData.emit(() => this.getCalendar());
	}
	
	updateCalendar(str: string){
		this.getCalendar();
		this.reloadEvents.emit(str);
	}

	checkWeekends(){
		let i = 0;
		let weekendsArray = [];
		while (i < this.arrOfDays.length){
			if((new Date(this.currentYear, this.currentMonth - 1, i).getDay() == 5) || (new Date(this.currentYear, this.currentMonth - 1, i).getDay() == 6)){
				weekendsArray.push('weekend');
				i++;
			} else {
				weekendsArray.push('workday');
				i++;
			}
		}
		this.weekendsArray = weekendsArray;
	}
}
