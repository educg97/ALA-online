import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal';
import { ScrollComponent } from '../scroll';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { DataService } from 'src/app/data.service';
import { WindowSizeComponent } from '../window-size';

@Component({
  selector: 'app-book-multimedia',
  templateUrl: './book-multimedia.component.html',
  styleUrls: ['./book-multimedia.component.scss'],
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
export class BookMultimediaComponent implements OnInit {

  constructor(
    public modal: ModalComponent,
    public scroll: ScrollComponent,
    public data: DataService,
    public windowSize: WindowSizeComponent
  ) { }

  bookMultimedia: string = 'book-multimedia';
  calendar: any;
  datePhase: number = 1;
  calendarMessage: string;
  schedules: any[] = [];
  activeSchedule: string;
  appointmentTimeUser: string;
  formName: string;
  endBooking: string;
  weekDay: string;
  supervisedTimesTuesday: string[] = [];
  supervisedTimesThursday: string[] = [];
  smallRoomTimes: string[] = [];

  ngOnInit() {
  }

  getCalendarData(calendar: object) {
    this.calendar = calendar;
  }

  selectNewDay(day) {
    const today = new Date().valueOf();
    const selectedDate = new Date(this.calendar['currentYear'], this.calendar['currentMonth'] - 1, day + 1).valueOf();
    if (today > selectedDate) {
      this.calendarMessage = 'No puedes reservar un ordenador en el pasado.';
    } else {
      const weekday = new Date(this.calendar['currentYear'], this.calendar['currentMonth'] - 1, day).getDay();
      if (weekday === 2) {
        this.weekDay = 'tuesday';
      } else if (weekday === 4) {
        this.weekDay = 'thursday';
      } else {
        this.weekDay = 'Enrique';
      }

      this.calendarMessage = null;
      this.getAndMapSchedule();
      this.navigateAppointment('next');
    }
  }

  setDaytime(time: string) {
    this.activeSchedule = time;
  }

  askForAppointment(hour: string) {
		const appTime = `${hour}:00`;
		this.appointmentTimeUser = hour;
    this.navigateAppointment('next');
	}

  getAndMapSchedule() {
    this.schedules = [];
    this.supervisedTimesTuesday = [];
    this.supervisedTimesThursday = [];
    this.smallRoomTimes = [];

    let rangeSchedule = {};
    let hours = [];
    let appointmentsPerHour = [];

    for (let i = 0; i <= 1440; i += 30) {
      let h = Math.floor(i / 60);
      if (h >= 10 && h <= 19) {
        // We get all the times we have available for level test appointments
        const horas = h.toString().padStart(2, '0');
        const minutos = (i % 60).toString().padStart(2, '0');
        // const fullTime = h.toString().padStart(2, '0') + ':' + (i % 60).toString().padStart(2, '0');
        const fullTime = horas + ':' + minutos;
        hours.push(fullTime);
        // if(Number(horas) >= 10 && (Number(horas) <= 14 && Number(minutos) < 1)) {
        if(Number(horas.concat(minutos)) >= 1000 && Number(horas.concat(minutos)) <= 1400) {
          this.supervisedTimesTuesday.push('sup');
        } else {
          this.supervisedTimesTuesday.push('');
        } 

        if(Number(horas.concat(minutos)) >= 1700 && Number(horas.concat(minutos)) <= 1900) {
          this.supervisedTimesThursday.push('sup');
        } else {
          this.supervisedTimesThursday.push('');
        }

        if(Number(horas.concat(minutos)) >= 1300 && Number(horas.concat(minutos)) <= 1630) {
          this.smallRoomTimes.push('small');
        } else {
          this.smallRoomTimes.push('');
        }

        appointmentsPerHour.push(0);
      }
    }
    rangeSchedule = {
      hours,
      appointmentsPerHour,
      name: 'Prepara tu examen TOEFL®'
    };
    this.schedules.push(rangeSchedule);
  }

  navigateAppointment(str: string) {
    const container = document.getElementById('full-container-phases');
    const phaseWidth = document.querySelector('.phase').clientWidth;
    if (str == 'next') {
      this.datePhase = (this.datePhase % 3) + 1;
      container.scrollLeft = phaseWidth;
    } else {
      this.datePhase = Math.floor((3 + 1 - this.datePhase) / 3) * 3 + ((this.datePhase - 1) % 3);
      container.scrollLeft = phaseWidth;
    }
  }

  setFormfield(e: string, type: string) {
    if (type === 'name') {
			this.formName = e['target']['value'];
		} else if (type === "end-booking") {  
      this.endBooking = e['target']['value']
    }
  }

  submitBookingForm() {
    const bookingForm = {
      name: this.formName,
      dateBooking: `${this.calendar['currentDay']} de ${this.calendar['currentMonthName']}`,
      startBooking: this.appointmentTimeUser,
      endBooking: this.endBooking
    }

    const toasts = {
      type: 'success',
      message: 'Solicitud enviada'
    };

    this.data.sendMailMultimedia(bookingForm).subscribe(res => {
      console.log(res);
    });

    this.modal.newToast(toasts);
    this.closeBookModal();
  }

  openBookModal() {
    this.modal.openModal('book-multimedia');
    this.scroll.disable();
  }

  closeBookModal() {
    this.modal.closeModal();
    this.scroll.enable();
  }

}
