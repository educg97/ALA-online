import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ScrollComponent } from 'src/app/utils/scroll';
import { ModalComponent } from 'src/app/utils/modal';
import { AuthComponent } from 'src/app/utils/auth.component';
import { CalendarComponent } from 'src/app/utils/calendar/calendar.component';
import { ActivatedRoute } from "@angular/router";
import { Title, Meta } from '@angular/platform-browser';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { DrawComponent } from 'src/app/utils/draws';
import { GameLetterComponent } from 'src/app/utils/game-letter/game-letter.component';


@Component({
	selector: 'app-activities',
	templateUrl: './activities.component.html',
	styleUrls: ['./activities.component.scss'],
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

export class ActivitiesComponent implements OnInit {
	@ViewChild(CalendarComponent)
	calendar: CalendarComponent;
	@ViewChild(GameLetterComponent)
	gameLetter: GameLetterComponent;

	@Input() calendarData: object;
	@Input() updateCalendar: any;

	public isShowingModal: boolean;
	public offsets: number[];

	constructor(
		public data: DataService,
		public scroll: ScrollComponent,
		public modal: ModalComponent,
		public route: ActivatedRoute,
		public titleService: Title,
		public auth: AuthComponent,
		public draws: DrawComponent,
		private meta: Meta
	) {
		this.offsets = this.range(1, 20);
		// Open Graph tags - the four first tags are required, the description is optional
		this.meta.updateTag({ property: 'og:title', content: 'Actividades para aprender inglés en Madrid | American Language Online' });
		this.meta.updateTag({ property: 'og:type', content: 'website' });
		this.meta.updateTag({ property: 'og:url', content: 'https://www.americanlanguage.es/actividades-en-ingles-madrid' });
		this.meta.updateTag({ property: 'og:image', content: 'https://www.americanlanguage.es/assets/images/academies/plaza-conde-valle-suchil.jpg' });
		this.meta.updateTag({ property: 'og:description', content: 'Aprende inglés de la forma más divertida con nuestras actividades gratuitas. Miles de actividades en inglés para ti. 💃 ¡Apúntate!' });
	}

	ngOnInit() {
		this.auth.checkIfLogged();
		if (this.auth.user && this.auth.user['userType'] === 'teacher') {
			this.loggedUserType = 'teacher';
		}
		if (this.auth.user && this.auth.user['username'] === 'admin') {
			this.isAdmin = true;
		}
		if (this.auth.user && this.auth.user['username'] === 'keeplearning') {
			this.isKeeplearning = true;
		}

		console.log("isKeeplearning", this.isKeeplearning);
		this.loginEvent();
		this.titleService.setTitle('Actividades para aprender Inglés | American Language Online');
		this.meta.updateTag({ name: 'description', content: 'Aprende inglés con actividades gratis de inglés en Madrid. Miles de actividades gratuitas para hablar inglés en Madrid para alumnos ¡consulta el calendario! 💃' });

		

		// Here we save the user's data if they're coming from Aula
		const aulaUser = {
			username: this.route.snapshot.queryParamMap.get('username'),
			name: this.route.snapshot.queryParamMap.get('name'),
			lastname: this.route.snapshot.queryParamMap.get('lastname'),
			level: this.route.snapshot.queryParamMap.get('level')
		}
		if (aulaUser['username']) { // This is if the user comes by params, for example, from Aula
			this.auth.externalLogin(aulaUser);
			this.filterLevels(aulaUser.level);

			let username = aulaUser['username'].split('');
			let code: any = username.filter((letter) => {
				if (isNaN(parseInt(letter))) {
					return letter;
				}
			})
			code = code.join('');
			if (code !== "AL") {
				// Es empresa
				this.loggedCompany = {
					...aulaUser,
					code
				}

				this.data.getCompanies().subscribe(res => {
					this.isCompany = true;
					this.loggedCompany = res[0];
					this.getAndPrintEvents(this.calendarData['currentMonth']);
				});
			} else {
				// Es alumno normal, lógica de siempre
				this.filterLevels(aulaUser['level']);
			}
		} else if (this.isAdmin || this.isKeeplearning) { // If Admin or keeplearning
			console.log('Hola que tal eres admin o keeplearning');
		} else if (this.auth.isLogged) { // If you're logged and is not coming anything by params
			this.filterLevels(this.aulaUser['realLevel']); // Funciona
		} else { // If you're not logged in and you login by the login modal
			this.modal.openModal('loginEvents');
			this.scroll.disable();
		}
	}

	isAdmin: boolean;
	isKeeplearning: boolean = false;
	api: string;
	token: string;
	events: object;
	printEvents: object;
	a1Filter: boolean;
	a2Filter: boolean;
	b1Filter: boolean;
	b2Filter: boolean;
	c1Filter: boolean;
	dataCalendar: object;
	months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	onScreenModal: boolean = false;
	selectedEvent: object;
	a1a2FilterModal: boolean;
	a2b1FilterModal: boolean;
	b1b2FilterModal: boolean;
	b2c1FilterModal: boolean;
	loggedUser: object; // If you are not logged and you subscribe into an event
	today: any = new Date();
	responseStudentInscription: object;
	applyFilters: boolean = false;
	isCompany: boolean;
	loggedCompany: any;
	loggedUserType: string = null;
	inscribedStudents: Object[] = null;
	showPrintable: boolean = false;
	printableEvents: any;
	isTecnicas: boolean;
	myFutureEvents: any;
	showMyActivities: boolean = false;
	inscribeCustomStudent: boolean;

	gameInfo: any;

	mondayEvents: Object[] = [];
	tuesdayEvents: Object[] = [];
	wednesdayEvents: Object[] = [];
	thursdayEvents: Object[] = [];
	fridayEvents: Object[] = [];
	saturdayEvents: Object[] = [];
	sundayEvents: Object[] = [];
	weekendsArray: Object[];
	blankBoxes: any;
	printArrOfDays: any;
	colors: string[] = ['blue', 'red', 'yellow', 'green', 'purple', 'teal', 'light-blue', 'ala-blue', 'purple', 'deep-orange', 'light-green', 'blue', 'red', 'yellow', 'green', 'purple', 'teal', 'light-blue', 'ala-blue', 'purple', 'deep-orange', 'light-green', 'blue', 'red', 'yellow', 'green', 'purple', 'teal', 'light-blue', 'ala-blue', 'purple', 'deep-orange', 'light-green'];

	pastMonthDaysWeek: Object[] = [];

	public aulaUser: object = JSON.parse(localStorage.getItem('aulaUser')); // If you log in before seeing the calendar.

	// Get inscribed student for an activity (only for admin user)
	getStudents(level: string) {
		const group = (level === 'a1a2FilterModal') ? 'A1/A2' :
			(level === 'a2b1FilterModal') ? 'A2/B1' :
				(level === 'b1b2FilterModal') ? 'B1/B2' :
					(level === 'b2c1FilterModal') ? 'B2/C1' : null;
		this.inscribedStudents = this.selectedEvent['Alumnos inscritos'][group];
	}

	// @inputs
	updateCalendarData(updateCalendarData) {
		this.updateCalendar = updateCalendarData;
	}

	emitCalendarData(calendarData) {
		this.calendarData = calendarData;
	}

	reloadCalendarEvents(events) {
		this.getAndPrintEvents(this.calendarData['currentMonth']);
	}

	getGameInfo(gameInfo) {
		console.log(gameInfo);
		this.gameInfo = gameInfo;
	}
	// @input end

	loginModalAct(form) {
		if((form['value']['username'] === 'tecnicas reunidas') && (form['value']['password'] === 'tr2019')){
			this.isTecnicas = true;
			this.modal.closeModal();
			this.scroll.enable();
			
			this.data.getCompanies().subscribe(res => {
				[].forEach.call(res, comp => {
					if(comp['Alias'] === 'TR'){
						this.loggedCompany = comp;
					}
				});
				this.getAndPrintEvents(this.calendarData['currentMonth']);
			});
		} else {
			this.auth.loginAndSave({ username: form.value.username, password: form.value.password })
			.then(res => {
				if (res['username'] !== 'admin' && res['username'] !== 'keeplearning') {
					this.filterLevels(this.auth.user['realLevel']);
				}
				this.modal.closeModal();
				this.scroll.enable();
				if (res['userType'] === 'teacher') {
					this.loggedUserType = 'teacher';
				}
				if (res['username'] === 'admin') {
					this.isAdmin = true;
				}
				if (res['username'] === 'keeplearning') {
					this.isKeeplearning = true;
				}
			})
			.catch(err => {
				const toasts = {
					type: 'error',
					message: 'Algo fue mal'
				};
				this.modal.newToast(toasts);
			});
		}
	}

	loginEvent() {
		this.getAndPrintEvents(this.calendar['currentMonth']);
	}
	getAndPrintEvents(month) {
		if(this.isTecnicas){
			this.getEvents();
		} else if (this.isCompany) {
			let futureEvents: boolean = false;
			this.loggedCompany['events'].forEach(event => {
				this.formatEvent(event);
				if (new Date(event['Fecha de inicio']) > new Date()) {
					futureEvents = true;
				}
			});

			if (futureEvents) {
				this.events = this.loggedCompany['events'];
				this.printEvents = this.loggedCompany['events'];

				this.getFinalArray(); // Probando a ver si funciona de esta forma
			} else {
				this.getEvents();
			}

		} else if (this.loggedUserType === 'teacher') {
			this.getEvents();
		} else {
			this.getEvents();
		}
	}

	getEvents() {
		this.data.getEvents().subscribe(events => {
			if (this.isAdmin || this.isKeeplearning) {
				let eventsAdmin = [];
				[].forEach.call(events, ev => {
					this.formatEvent(ev);
					eventsAdmin.push(ev);
				});

				this.events = eventsAdmin;
				this.printEvents = eventsAdmin;
			} else if(this.isTecnicas) {
				let trEvents = [];
				[].forEach.call(this.loggedCompany['events'], evt => {
					this.formatEvent(evt);
					trEvents.push(evt);
				});
				console.log(trEvents);
				this.events = trEvents;
				this.printEvents = trEvents;
			} else if (this.loggedUserType === 'teacher') {
				let eventsALA = [];

				[].forEach.call(events, (event) => {
					this.formatEvent(event);
					if (event['company'] && event['company']['Alias'] === 'ALA') {
						eventsALA.push(event);
					}
				});

				this.events = eventsALA;
				this.printEvents = eventsALA;
			} else {
				let eventsNoCompany = [];
				[].forEach.call(events, (event) => {
					this.formatEvent(event);
					if (!event['company']) {
						eventsNoCompany.push(event);
					}
				});

				this.events = eventsNoCompany;
				this.printEvents = eventsNoCompany;
			}

			this.getFinalArray(); // Probando a ver si funciona de esta forma
		});
	}

	formatEvent(event: object) {
		const evMonth = Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[1]);
		const madridTime = (evMonth > 3 && evMonth < 11) ? 2 : 1; // This is for adjustment with the time changing every April and October

		event['Fecha limite de inscripcion legible'] = new Date(event['Fecha limite de inscripcion']).toLocaleDateString(),
			event['Fecha limite de inscripcion'] = new Date(event['Fecha limite de inscripcion']),
			event['Hora de inicio'] = parseInt(new Date(event['Fecha de inicio']).toLocaleTimeString().split(':')[0]) - madridTime, // Because it will refuse to work with locales
			event['Minutos de inicio'] = parseInt(new Date(event['Fecha de inicio']).toLocaleTimeString().split(':')[1]), // Because it will refuse to work with locales
			event['Hora de fin'] = parseInt(new Date(event['Fecha de fin']).toLocaleTimeString().split(':')[0]) - madridTime, // Because it will refuse to work with locales
			event['Minutos de fin'] = parseInt(new Date(event['Fecha de fin']).toLocaleTimeString().split(':')[1]), // Because it will refuse to work with locales
			event['Fecha de inicio legible'] = new Date(event['Fecha de inicio']).toLocaleDateString().split(':')[0],
			event['Fecha de fin legible'] = new Date(event['Fecha de fin']).toLocaleDateString().split(':')[0],
			event['MesNum'] = Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[1]),
			event['DiaNum'] = Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[0]),
			event['Mes'] = this.months[Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[1]) - 1],
			event['Year'] = new Date(event['Fecha de inicio']).getFullYear(),
			event['primerDia'] = new Date(new Date(event['Fecha de inicio']).getFullYear(), Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[1]) - 1, 1).getDay(),
			event['Dias'] = new Date(new Date(event['Fecha de inicio']).getFullYear(), Number(new Date(event['Fecha de inicio']).toLocaleDateString().split('/')[1]), 0).getDate(),
			event['counter'] = 1,
			event['Pasado'] = this.today > new Date(event['Fecha limite de inscripcion']),
			event['Color'] = (event['Tipo de evento'] == 'Inglés general') ? 'red':
							 (event['Tipo de evento'] == 'Business') ? 'light-green' :	 
							 (event['Tipo de evento'] == 'Eventos') ? 'cyan' :	 
							 (event['Tipo de evento'] == 'Tapas Night') ? 'purple' : null;
						
	}

	getFinalArray() {
		let i = 1;
		while (i < this.calendarData['arrOfDays'].length + 1) {
			this.calendarData['arrOfDays'][i - 1] = (this.getEventsByDate(this.calendarData['currentYear'], this.calendarData['currentMonth'], i++));
		}
		this.calendar['arrOfDays'] = this.calendarData['arrOfDays'];
	}

	filterLevels(level) {
		const newLevel = this.formatFilter(level);
		const currentFilter = this[newLevel];

		if (this.isAdmin) {
			this.a1Filter = true;
			this.a2Filter = true;
			this.b1Filter = true;
			this.b2Filter = true;
			this.c1Filter = true;
		} else if (this.isKeeplearning) {
			this.a1Filter = false;
			this.a2Filter = false;
			this.b1Filter = false;
			this.b2Filter = false;
			this.c1Filter = false;

			this[level] = !currentFilter;

		} else if (this.auth.isLogged) {
			this[newLevel] = true;
		} else {
			this.a1Filter = false;
			this.a2Filter = false;
			this.b1Filter = false;
			this.b2Filter = false;
			this.c1Filter = false;

			this[level] = !currentFilter;
		}

		this.getFinalArray();
	}

	formatFilter(level: string) {
		if (level === 'A1') {
			return 'a1Filter';
		} else if (level === 'A2') {
			return 'a2Filter';
		} else if (level === 'B1') {
			return 'b1Filter';
		} else if (level === 'B2') {
			return 'b2Filter';
		} else if (level === 'C1' || level === 'C2') {
			return 'c1Filter';
		} else {
			return level;
		}
	}

	filterModalLevels(level: string) {
		const currentFilter = this[level];

		this.a1a2FilterModal = false;
		this.a2b1FilterModal = false;
		this.b1b2FilterModal = false;
		this.b2c1FilterModal = false;

		this[level] = !currentFilter;
		this.getStudents(level);
	}

	getEventsByDate(year, month, day) {
		let dayEvents = [];
		[].forEach.call(this.events, event => {
			const currentDay = event['DiaNum'];
			if (year === event['Year'] && month === event['MesNum'] && currentDay === day) {
				if (this.a1Filter) {
					if (!event["A1/A2"]) {
						event['counter'] = 0;
					} else {
						event['counter'] = 1;
						dayEvents.push(event);
					}
				} else if (this.a2Filter) {
					if (!(event["A1/A2"] || event["A2/B1"])) {
						event['counter'] = 0;
					} else {
						event['counter'] = 1;
						dayEvents.push(event);
					}
				} else if (this.b1Filter) {
					if (!(event["B1/B2"] || event["A2/B1"])) {
						event['counter'] = 0;
					} else {
						event['counter'] = 1;
						dayEvents.push(event);
					}
				} else if (this.b2Filter) {
					if (!(event["B1/B2"] || event["B2/C1"])) {
						event['counter'] = 0;
					} else {
						event['counter'] = 1;
						dayEvents.push(event);
					}
				} else if (this.c1Filter) {
					if (!event["B2/C1"]) {
						event['counter'] = 0;
					} else {
						event['counter'] = 1;
						dayEvents.push(event);
					}
				} else if (!this.a1Filter
					&& !this.a2Filter
					&& !this.b1Filter
					&& !this.b2Filter
					&& !this.c1Filter) {
					event['counter'] = 1;
					dayEvents.push(event);
				}
			}
		});
		return dayEvents;
	}

	selectEvent(id: string, modalType: string) {
		this.modal.openModal(modalType);
		this.showModal();
		this.data.getSingleEvent(id).subscribe(singleEvent => {
			this.selectedEvent = singleEvent;

			// Si la fecha de inscripción ha pasado
			this.selectedEvent['Pasado'] = this.today > new Date(this.selectedEvent['Fecha limite de inscripcion']);

			// Plazas libres según el grupo
			const grupos = ['A1/A2', 'A2/B1', 'B1/B2', 'B2/C1'];
			grupos.forEach((grupo, i) => {
				if (this.selectedEvent['Alumnos inscritos'][grupo]) {
					this.selectedEvent['Plazas ocupadas'] = {
						...this.selectedEvent['Plazas ocupadas'],
						[grupo]: {
							cantidad: this.selectedEvent['Alumnos inscritos'][grupo].length,
							ocupacion: ((this.selectedEvent['Alumnos inscritos'][grupo].length / this.selectedEvent['Numero de plazas']) >= 0.65) ? 'ocupao' : ((this.selectedEvent['Alumnos inscritos'][grupo].length / this.selectedEvent['Numero de plazas']) >= 0.20) && (0.65 > (this.selectedEvent['Alumnos inscritos'][grupo].length / this.selectedEvent['Numero de plazas'])) ? 'medio' : 'libre'
						}
					}
				}
			});
		});
	}

	showModal() {
		this.onScreenModal = true;
		this.scroll.disable();
	}

	closeModal(form) {
		this.a1a2FilterModal = false;
		this.a2b1FilterModal = false;
		this.b1b2FilterModal = false;
		this.b2c1FilterModal = false;
		this.onScreenModal = false;
		this.scroll.enable();
		this.modal.closeModal();
	}

	inscribeAfterCheckLoggin(form) {
		let currentStudents = this.selectedEvent['Alumnos inscritos'];
		const group = (this.a1a2FilterModal) ? 'A1/A2' : (this.a2b1FilterModal) ? 'A2/B1' : (this.b1b2FilterModal) ? 'B1/B2' : (this.b2c1FilterModal) ? 'B2/C1' : 'Apátrida';

		if(this.isTecnicas) {
			if((JSON.stringify(currentStudents).indexOf(form['value']['emailTR'])) < 0) {
				let response = {};

				if (currentStudents[group]) {
					response = {
						[group]: [
							...currentStudents[group],
							{
								nombre: form['value']['fullNameTR'],
								emailTR: form['value']['emailTR']
							}
						]
					}
				} else {
					response = {
						[group]: [
							{
								nombre: form['value']['fullNameTR'],
								emailTR: form['value']['emailTR']
							}
						]
					}
				}
				const finalResponse = {
					...currentStudents,
					...response
				}

				

				this.data.updateAlumnosInscritos(this.selectedEvent['_id'], finalResponse).subscribe(res => {
					this.closeModal(form);
					form.reset();
					const toasts = {
						type: 'success',
						message: 'Gracias por inscribirte'
					};
					this.modal.newToast(toasts);
				});
				
			} else {
				console.log('Parece que hay alguien');
				const toasts = {
					type: 'error',
					message: 'Ya estabas inscrito'
				};
				this.modal.newToast(toasts);
			}
			
		} else if (((JSON.stringify(currentStudents).indexOf(this.auth['user']['username'])) < 0) || this.auth['user']['username'] == "keeplearning") { // El usuario keeplearning se puede inscribir más de una vez en una misma actividad
			// Aquí incribimos al alumno
			let response = {};
			// Comprobamos si hay ya algún alumno inscrito en el grupo que se quiere inscribir el nuevo alumno
			if (currentStudents[group]) {
				response = {
					[group]: [
						...currentStudents[group],
						{
							nombre: `${this.auth['user']['firstname']} ${this.auth['user']['lastname']}`,
							username: this.auth['user']['username'],
							email: this.auth['user']['email'],
							password: form.value.password
						}
					]
				}
			} else {
				response = {
					[group]: [
						{
							nombre: `${this.auth['user']['firstname']} ${this.auth['user']['lastname']}`,
							username: this.auth['user']['username'],
							email: this.auth['user']['email'],
							password: form.value.password
						}
					]
				}
			}
			const finalResponse = {
				...currentStudents,
				...response
			}

			console.log(this.selectedEvent);
			let timeInit = new Date(this.selectedEvent['Fecha de inicio']).toISOString().split('.000')[0];
				timeInit = timeInit.split('T')[1];
				// timeInit = `${timeInit.split(':')[0]}h`;
			
			let timeEnd = new Date(this.selectedEvent['Fecha de fin']).toISOString().split('.000')[0];
				timeEnd = timeInit.split('T')[1];

			const mailData = {
				event: this.selectedEvent['Evento'],
				name: this.auth['user']['firstname'],
				lastname: this.auth['user']['lastname'],
				email: this.auth['user']['email'],
				dateEvent: new Date(this.selectedEvent['Fecha de inicio']).toLocaleDateString(),
				timeInit: timeInit,
				// timeEnd: timeEnd
			}


			this.data.updateAlumnosInscritos(this.selectedEvent['_id'], finalResponse).subscribe(res => {
				this.closeModal(form);
				form.reset();
				const toasts = {
					type: 'success',
					message: 'Gracias por inscribirte'
				};
				this.modal.newToast(toasts);
			});

			this.data.sendEmailActivityInscription(mailData).subscribe(res => {});
		} else {
			const toasts = {
				type: 'error',
				message: 'Ya estabas inscrito'
			};
			this.modal.newToast(toasts);
		}

	}

	inscribirAlumno(form) {
		if(this.isTecnicas) {
			this.inscribeAfterCheckLoggin(form);
		} else if (this.auth.isLogged) {
			this.inscribeAfterCheckLoggin(form);
		} else {
			this.auth.loginAndSave({
				username: form.value.username,
				password: form.value.password
			}).then(res => {
				this.inscribeAfterCheckLoggin(form);
			});
		}
	}

	deleteStudentAfterLoggin(form) {
		let currentStudents = this.selectedEvent['Alumnos inscritos'];
		const group = (this.a1a2FilterModal) ? 'A1/A2' : (this.a2b1FilterModal) ? 'A2/B1' : (this.b1b2FilterModal) ? 'B1/B2' : (this.b2c1FilterModal) ? 'B2/C1' : 'Apátrida';

		if ((JSON.stringify(currentStudents).indexOf(this.auth['user']['username'])) > 0) {
			let groupEvents = Object.keys(currentStudents);
			groupEvents.forEach(grupo => {
				currentStudents[grupo].forEach((alumno, i) => {
					if (alumno['username'] === this.auth['user']['username']) {
						currentStudents[group].splice(i, 1);
					}
				});
			});

			// const contactData = {
			// 	to: form['value']['email'],
			// 	subject: 'Formulario de contacto desde americanlanguage.es',
			// 	message: form['value']['message'],
			// 	name: form['value']['name'],
			// 	surname: form['value']['surname'],
			// 	phone: form['value']['phone']
			// }

			// this.data.sendEmail(contactData).subscribe(res => {
			// 	console.log(res);
			// });

			this.data.updateAlumnosInscritos(this.selectedEvent['_id'], currentStudents).subscribe(res => {
				const toasts = {
					type: 'success',
					message: 'Te has desapuntado de la actividad'
				};
				this.closeModal(form);
				form.reset();
				this.modal.newToast(toasts);
			});

			console.log(this.selectedEvent);
			let timeInit = new Date(this.selectedEvent['Fecha de inicio']).toISOString().split('.000')[0];
				timeInit = timeInit.split('T')[1];
				// timeInit = `${timeInit.split(':')[0]}h`;
			
			let timeEnd = new Date(this.selectedEvent['Fecha de fin']).toISOString().split('.000')[0];
				timeEnd = timeInit.split('T')[1];

			const mailData = {
				event: this.selectedEvent['Evento'],
				name: this.auth['user']['firstname'],
				lastname: this.auth['user']['lastname'],
				email: this.auth['user']['email'],
				dateEvent: new Date(this.selectedEvent['Fecha de inicio']).toLocaleDateString(),
				timeInit: timeInit,
				// timeEnd: timeEnd
			}

			this.data.sendEmailActivityUnsusbscription(mailData).subscribe(res => {});
		} else {
			const toasts = {
				type: 'error',
				message: 'Para borrarte antes tienes que inscribirte'
			};
			this.modal.newToast(toasts);
		}
	}

	desuscribirAlumno(form) {
		if (this.auth.isLogged) {
			this.deleteStudentAfterLoggin(form);
		} else {
			this.auth.loginAndSave({
				username: form.value.username,
				password: form.value.password
			}).then(res => {
				this.deleteStudentAfterLoggin(form);
			})
		}
	}

	closeLoginModal() {
		this.modal.closeModal();
		this.scroll.enable();
	}

	orderArrays(array: any) {
		[].sort.call(array, function (a, b) {
			var keyA = a['Fecha de inicio'],
				keyB = b['Fecha de inicio'];

			if (keyA > keyB) return 1;
			if (keyA < keyB) return -1;
			return 0;
		});
	}

	getPrintEventsByDay(year, month, day){
		let printEvents = [];
		this.printableEvents.forEach(ev => {
			const currentDay = ev['DiaNum'];
			if (year === ev['Year'] && month === ev['MesNum'] && currentDay === day) {
				printEvents.push(ev);
			}
		});
		return printEvents;
	}

	getPrintFinalArray() {
		let i = 1;
		while (i < this.printArrOfDays.length + 1) {
			this.printArrOfDays[i - 1] = (this.getPrintEventsByDay(this.calendarData['currentYear'], this.calendarData['currentMonth'], i++));
		}
		// this.calendar['arrOfDays'] = this.calendarData['arrOfDays'];
	}

	togglePrintableDoc() {
		this.showPrintable = !this.showPrintable;
		const eventsToPrint = [].filter.call(this.events, ev => (ev['MesNum'] == this.calendarData['currentMonth']) && (ev['Tipo de evento'] !== 'Business'));

		this.printArrOfDays = this.calendarData['arrOfDays'];

		this.orderArrays(eventsToPrint);
		if(this.calendarData['whiteBoxes'] >= 5) {
			for(let k = 0; k < 5; k++){
				this.calendarData['whiteBoxes'].shift();
			}
			this.calendarData['whiteBoxes'] = this.pastMonthDaysWeek;
		}
		console.log("white boxes", this.calendarData['whiteBoxes']);
		console.log("pastMonthDaysWeek", this.pastMonthDaysWeek);

		eventsToPrint.forEach(event => {
			event['dayWeek'] = new Date(event['Fecha de inicio']).getDay();
			if(event['dayWeek'] == 1){
				this.mondayEvents.push(event);
			} else if(event['dayWeek'] == 2){
				this.tuesdayEvents.push(event);
			} else if(event['dayWeek'] == 3){
				this.wednesdayEvents.push(event);
			} else if(event['dayWeek'] == 4){
				this.thursdayEvents.push(event);
			} else if(event['dayWeek'] == 5){
				this.fridayEvents.push(event);
			} else if(event['dayWeek'] == 6){
				this.saturdayEvents.push(event);
			} else if(event['dayWeek'] == 7){
				this.sundayEvents.push(event);
			}
		});
		
		this.checkWeekends();
		
		this.printableEvents = eventsToPrint;
		
		this.getPrintFinalArray();
		console.warn(this.calendarData);
		console.log(this.printArrOfDays);
		
		const calendarToPrint = document.getElementById('printDoc');
		calendarToPrint.scrollIntoView({block: 'start', behavior: 'smooth'});
	}

	printActivities(){
		const printableContent = document.getElementById('printDoc').innerHTML;
		const originalContent = document.body.innerHTML;

		document.body.innerHTML = printableContent;
		window.print();
		document.body.innerHTML = originalContent;

		this.showPrintable = false;
	}

	checkWeekends(){
		let i = 0;
		let weekendsArray = [];
		while (i < this.calendarData['arrOfDays'].length){
			if((new Date(this.calendarData['currentYear'], this.calendarData['currentMonth'] - 1, i).getDay() == 5) || (new Date(this.calendarData['currentYear'], this.calendarData['currentMonth'] - 1, i).getDay() == 6)){
				weekendsArray.push('weekend');
				i++;
			} else {
				weekendsArray.push('workday');
				i++;
			}
		}
		this.weekendsArray = weekendsArray;
	}

	seeMyEvents(){
		if(!this.showMyActivities) {
			this.showMyActivities = true;
			const username = this.auth.user['username'];
			// const rightNow = new Date().toISOString();
			// const futureEvents = [].filter.call(this.events, ev => ev['Fecha de inicio'] >= rightNow);
			// let myEvents = [];
			
			// futureEvents.forEach(event => {
			// 	const studentsPerEvent = Object.values(event['Alumnos inscritos']);
			// 	studentsPerEvent.forEach(level => {
			// 		[].forEach.call(level, student => {
			// 			if(student['username'] === username) {
			// 				myEvents.push(event);
			// 			}
			// 		});
			// 	});
			// });
	
			// this.myFutureEvents = myEvents;
			this.updateMyEvents(username);
		} else {
			this.showMyActivities = false;
		}
	}

	updateMyEvents(username){
		const rightNow = new Date().toISOString();
			const futureEvents = [].filter.call(this.events, ev => ev['Fecha de inicio'] >= rightNow);
			let myEvents = [];
			
			futureEvents.forEach(event => {
				const studentsPerEvent = Object.values(event['Alumnos inscritos']);
				studentsPerEvent.forEach(level => {
					[].forEach.call(level, student => {
						if(student['username'] === username) {
							myEvents.push(event);
						}
					});
				});
			});
	
			this.myFutureEvents = myEvents;
	}

	deleteStudentFromActivity(username, activitySelected){
		const levels = ['A1/A2', 'A2/B1', 'B1/B2', 'B2/C1'];
		let activity = activitySelected ? activitySelected : this.selectedEvent;

		levels.forEach(level => {
			if(activity['Alumnos inscritos'][level]){
				var updatedList;
				if (username == "keeplearning") {
					const index = activity['Alumnos inscritos'][level].findIndex(student => student.username == username);
					updatedList = activity['Alumnos inscritos'][level];
					updatedList = updatedList.splice(index, 1);
					console.log("ELIMINANDO UNO DE LOS KEEPLEARNING");
				} else {
					updatedList = activity['Alumnos inscritos'][level].filter(student => student['username'] !== username);
				}
				
				activity['Alumnos inscritos'][level] = updatedList;
				this.inscribedStudents = updatedList;
				console.log(activity);
				this.data.updateAlumnosInscritos(activity['_id'], activity['Alumnos inscritos']).subscribe(res => {
					
					res['Plazas ocupadas'] = {
						...res['Plazas ocupadas'],
						[level]: {
							cantidad: res['Alumnos inscritos'][level].length,
							ocupacion: ((res['Alumnos inscritos'][level].length / res['Numero de plazas']) >= 0.65) ? 'ocupao' 
									 : ((activity['Alumnos inscritos'][level].length / activity['Numero de plazas']) >= 0.20) && (0.65 > (activity['Alumnos inscritos'][level].length / activity['Numero de plazas'])) ? 'medio' : 'libre'
						}
					}
					
					this.selectedEvent = res;
					console.log(this.selectedEvent);
				});
			}
		});
		this.updateMyEvents(username);
	}

	startStudentInscription(){
		this.inscribeCustomStudent = !this.inscribeCustomStudent;
	}

	inscribirAlumnoExterno(form) {
		const selectedLevel = (this.a1a2FilterModal) ? 'A1/A2' :
							  (this.a2b1FilterModal) ? 'A2/B1' :
							  (this.b1b2FilterModal) ? 'B1/B2' :
							  (this.b2c1FilterModal) ? 'B2/C1' : 'NO LEVEL';

		let students;
		if(this.selectedEvent['Alumnos inscritos'][selectedLevel]){
			students = [...this.selectedEvent['Alumnos inscritos'][selectedLevel], {
				nombre: form['value']['fullName'],
				username: form['value']['username']
			}];
		} else {
			students = [
					{
					nombre: form['value']['fullName'],
					username: form['value']['username']
				}
			];
		}
		this.selectedEvent['Alumnos inscritos'][selectedLevel] = students;
		this.inscribedStudents = students;

		this.data.updateAlumnosInscritos(this.selectedEvent['_id'], this.selectedEvent['Alumnos inscritos']).subscribe(res => {
					
			res['Plazas ocupadas'] = {
				...res['Plazas ocupadas'],
				[selectedLevel]: {
					cantidad: res['Alumnos inscritos'][selectedLevel].length,
					ocupacion: ((res['Alumnos inscritos'][selectedLevel].length / res['Numero de plazas']) >= 0.65) ? 'ocupao' : ((this.selectedEvent['Alumnos inscritos'][selectedLevel].length / this.selectedEvent['Numero de plazas']) >= 0.20) && (0.65 > (this.selectedEvent['Alumnos inscritos'][selectedLevel].length / this.selectedEvent['Numero de plazas'])) ? 'medio' : 'libre'
				}
			}
			
			this.selectedEvent = res;
			form.reset();
		});
	}

	activitiesLogout(){
		this.auth.logout();
		location.reload(true);
	}

	// Game Letter functions
	sendFristTry(form) {
		const response = form['value']['firstTry'];
	
		if(response.toLowerCase().trim() === this.gameLetter['correctWord'].toLowerCase().trim()) {
			const toasts = {
			  type: 'success',
			  message: `¡Muy bien! ¡${response} es correcta!`
			}
			this.modal.newToast(toasts);
			this.gameLetter['counter']++;
			this.gameLetter['wordsCorrected'].push(`${this.gameLetter['wordToCheck']}-${this.gameLetter['correctWord']}`);
			form.reset();
			if(this.gameLetter['counter'] == this.gameLetter['prizeAmount']) {
			  this.gameInfo['winnerModal'] = true;
			  this.gameInfo['firstTryStep'] = false;
			} else {
			  this.gameLetter.closeModal();
			}
		  } else {
			const toasts = {
			  type: 'error',
			  message: `¡Prueba otra vez!`
			}
			this.modal.newToast(toasts);
		  }
	  }

	  sendWinner(form){
		// console.log(form['value']['email']);
		this.gameInfo['winnerModal'] = false;
		this.gameInfo['afterMailMsg'] = true;
		this.data.sendShirtVoucher({email: form['value']['email']}).subscribe(res => {
		  console.log(res);
		});
		this.gameInfo.closeModal();
	  }

	// I build an increasing range for the given numbers, inclusive.
	private range(from: number, to: number): number[] {
		var values = [];
		for (var i = from; i <= to; i++) {
			values.push(i);
		}
		return (values);
	}
}


