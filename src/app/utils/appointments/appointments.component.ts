import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { Config } from 'src/app/utils/config';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';

declare let fbq: any;

@Component({
	selector: 'app-appointments',
	templateUrl: './appointments.component.html',
	styleUrls: ['./appointments.component.scss'],
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
export class AppointmentsComponent implements OnInit {

	constructor(
		public data: DataService,
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		public config: Config
	) { }

	calendar: object;
	sentMail: boolean = false;
	isMorning: boolean = true;
	appointments: object;
	appointmentTimeUser: string;
	datePhase: number = 1;
	nextBtnAvailable: boolean = false;
	formName: string;
	formLastname: string;
	formEmail: string;
	formPhone: string;
	isEmail: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	isPhone: any = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
	emailErrorMessage: string = null;
	phoneErrorMessage: string = null;
	formMessage: string;
	formData: object;
	calendarMessage: string = null;
	schedules: any[] = [];
	activeSchedule: string;
	Appointments: string = 'appointments';
	blockedSchedules: any;

	ngOnInit() {
		this.data.getConfig().subscribe(res => {
			this.config.appointmentsAtSameTime = res[0]['Máximo de citas por cada 15 minutos'];
		});
	}

	getAndMapSchedule() {
		this.schedules = [];
		// We have to clear the blocked days array
		this.blockedSchedules = null;
		// First we get the edited schedules for the level test
		this.data.getCustomSchedules().subscribe(response => {
			[].map.call(response, date => {
				date['day'] = date['Fecha'].split('/')[0];
				date['month'] = date['Fecha'].split('/')[1];
				date['year'] = date['Fecha'].split('/')[2];
				date['Bloqueadas'] = Object.values(date['Bloqueadas']);
				if (this.calendar['currentDay'] == date['day'] && this.calendar['currentMonth'] == date['month'] && this.calendar['currentYear'] == date['year']) {
					this.blockedSchedules = date['Bloqueadas'];
				}
			});
			// this.blockedSchedules = response;
			console.log(this.blockedSchedules);

			// Then, we get the default schedules defined by Strapi
			this.data.getSchedules().subscribe(data => {
				[].map.call(data, hour => {
					let rangeSchedule = {};
					let hours = [];
					let appointmentsPerHour = [];

					for (let i = 0; i <= 1440; i += 5) {
						let h = Math.floor(i / 60);
						if (h >= hour['Hora de inicio'] && h <= hour['Hora de fin']) {
							// We get all the times we have available for level test appointments
							const fullTime = h.toString().padStart(2, '0') + ':' + (i % 60).toString().padStart(2, '0');

							// if (this.blockedSchedules) {
							// 	if (!this.blockedSchedules.includes(fullTime)) {
							// 		hours.push(fullTime);
							// 	}
							// } else {
							// 	hours.push(fullTime);
							// }

							hours.push(fullTime);
							appointmentsPerHour.push(0);
						}
					}
					// Make a parallel array where we check how many appointments we've got per hour
					const selectedDate = new Date(this.calendar['currentYear'], this.calendar['currentMonth'] - 1, this.calendar['currentDay']);
					this.data.getAppointments().subscribe(appointments => {
						[].forEach.call(appointments, app => {
							if (selectedDate.toDateString() == new Date(app['Fecha']).toDateString()) {
								const indexTime = hours.indexOf(app['Hora']);
								if (indexTime !== -1) {
									appointmentsPerHour[indexTime]++;
								}
							}
						});
					});

					rangeSchedule = {
						hours,
						appointmentsPerHour,
						name: hour['Nombre']
					};
					hour['Activo'] ? this.schedules.push(rangeSchedule) : null;
					// console.log(this.schedules);
				});
				this.activeSchedule = this.schedules[0]['name'];
				console.log(this.schedules);
				console.log(this.activeSchedule);
			});
		});
	}


	selectNewDay(day) {
		const today = new Date().valueOf();
		const selectedDate = new Date(this.calendar['currentYear'], this.calendar['currentMonth'] - 1, day + 1).valueOf();
		if (today > selectedDate) {
			this.calendarMessage = 'No puedes hacer una prueba de nivel en el pasado.';
		} else {
			this.calendarMessage = null;
			this.getAndMapSchedule();
			this.navigateAppointment('next');
		}
	}

	getCalendarData(calendar: object) {
		this.calendar = calendar;
	}

	openAppointmentsModal(kindOfModal: string) {
		this.modal.openModal(kindOfModal);
		this.scroll.disable();
		this.getAppointmentsData();
		this.getAndMapSchedule();
	}

	getAppointmentsData() {
		this.data.getAppointments().subscribe(res => {
			this.formatAppointments(res);
			this.appointments = res;
			this.getFinalArray();
		});
	}

	formatAppointments(appointments) {
		appointments.forEach(appointment => {
			appointment['Hora cita'] = new Date(appointment['Fecha']).toLocaleTimeString('es-ES'),
				appointment['DiaNum'] = Number(new Date(appointment['Fecha']).toLocaleDateString('es-ES').split('/')[0]),
				appointment['MesNum'] = Number(new Date(appointment['Fecha']).toLocaleDateString('es-ES').split('/')[1]),
				appointment['YearNum'] = new Date(appointment['Fecha']).getFullYear()
		});
	}

	closeAppointmentsModal() {
		this.modal.closeModal();
		this.scroll.enable();
		this.datePhase = 1;
	}

	setDaytime(time: string) {
		this.activeSchedule = time;
	}

	setFormfield(e: string, type: string) {
		if (type === 'name') {
			this.formName = e['target']['value'];
		} else if (type === "email") {
			if (this.isEmail.test(e['target']['value'])) {
				this.formEmail = e['target']['value'];
				this.emailErrorMessage = null;
			} else {
				this.emailErrorMessage = 'Formato de email incorrecto';
			}
		} else if (type === 'lastname') {
			this.formLastname = e['target']['value'];
		} else if (type === 'message') {
			this.formMessage = e['target']['value'];
		} else if (type === 'phoneNumber') {
			if (this.isPhone.test(e['target']['value'])) {
				this.formPhone = e['target']['value'];
				this.phoneErrorMessage = null;
			} else {
				this.phoneErrorMessage = 'Número de teléfono no válido';
			}

		}
	}

	submitAppointmentform() {
		const appointmentForm = {
			Apellidos: this.formLastname,
			Nombre: this.formName,
			Fecha: new Date(this.calendar['currentYear'], this.calendar['currentMonth'] - 1, this.calendar['currentDay']).toISOString(),
			Hora_cita: this.appointmentTimeUser,
			Mensaje: this.formMessage,
			Telefono: this.formPhone,
			Email: this.formEmail
		}

		this.data.newAppointment(appointmentForm).subscribe(res => {

			const contactData = {
				subject: 'Solicitud de prueba de nivel',
				message: appointmentForm['Mensaje'],
				name: appointmentForm['Nombre'].toUpperCase(),
				surname: appointmentForm['Apellidos'].toUpperCase(),
				email: appointmentForm['Email'],
				phone: appointmentForm['Telefono'],
				fecha: new Date(appointmentForm['Fecha']).toLocaleDateString(),
				hora: appointmentForm['Hora_cita']
			}

			const toasts = {
				type: 'success',
				message: 'Solicitud enviada'
			};
			this.modal.newToast(toasts);
			this.closeAppointmentsModal();

			this.sentMail = true;

			this.data.sendEmailAppointment(contactData).subscribe(res => {

			});
			fbq('track', 'Schedule');
		});
	}

	// SCROLLING
	askForAppointment(hour: string) {
		const appTime = `${hour}:00`;
		this.appointmentTimeUser = hour;
		this.navigateAppointment('next');
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

	goToSelectedPhase(phase: number) {
		this.datePhase = phase;
	}

	// DISABLING HOURS DEPENDING ON AVAILABILITY
	getFinalArray() {
		let i = 1;
		while (i < this.calendar['arrOfDays'].length + 1) {
			this.calendar['arrOfDays'][i - 1] = (this.getAppointmentsByDate(this.calendar['currentYear'], this.calendar['currentMonth'], i++));
		}
		this.calendar['arrOfDays'] = this.calendar['arrOfDays'];
	}

	getAppointmentsByDate(year, month, day) {
		let dayAppointments = [];
		[].forEach.call(this.appointments, appointment => {
			if (year === appointment['YearNum'] && month === appointment['MesNum'] && day === appointment['DiaNum']) {
				dayAppointments.push(appointment);
			}
		});
		return dayAppointments;
	}

	getAppointmentsByDay() {
		this.data.getAppointments().subscribe(res => {
			console.log(res);
		});
	}
}
