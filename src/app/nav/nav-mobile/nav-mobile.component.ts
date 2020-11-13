import { Component, OnInit } from '@angular/core';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { ModalComponent } from 'src/app/utils/modal';
import { AuthComponent } from 'src/app/utils/auth.component';
import { ScrollComponent } from 'src/app/utils/scroll';
import { DataService } from 'src/app/data.service';
import { Filters } from 'src/app/utils/filters';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SubmenuComponent } from 'src/app/utils/submenu';
import { Google } from 'src/app/utils/google';
import { CourseComponent } from 'src/app/views/courses/course/course.component';

@Component({
	selector: 'app-nav-mobile',
	templateUrl: './nav-mobile.component.html',
	styleUrls: ['./nav-mobile.component.scss'],
	animations: [
		trigger('toastOnOff', [
			state('in', style({transform: 'translateX(80vw)'})),
			transition(':enter', [
				style({transform: 'translateX(-80vw)'}),
				animate('600ms ease-in-out')
			]),
			transition(':leave', 
				animate('600ms ease-in-out', style({transform: 'translateX(-80vw)'}))
			)
		]),
		trigger('submenuInOut', [
			state('in', style({opacity: '1'})),
			transition(':enter', [
				style({opacity: '0'}),
				animate('300ms ease-in-out')
			]),
			transition(':leave', 
				animate('300ms ease-in-out', style({opacity: '0'}))
			)
		])
	] 
})
export class NavMobileComponent implements OnInit {

	constructor(
		public window_util: WindowSizeComponent,
		public modal: ModalComponent,
		public auth: AuthComponent,
		public scroll: ScrollComponent,
		public data: DataService,
		public filter: Filters,
		public submenu: SubmenuComponent,
		public google: Google,
		public course: CourseComponent
	) { }

	loginRespond: object;
	loggedAulaUser: object = JSON.parse(localStorage.getItem('aulaUser'));
	private toggle: number = 0;
	certModal: boolean;

	ngOnInit() {
		this.auth.checkIfLogged();
	}

	ngAfterViewInit(){
	}

	toggleMenu(){
		this.toggle = 1-this.toggle;
		if (this.toggle){
			this.scroll.disable();
		} else {
			this.scroll.enable();
		}
		let hamburger = document.getElementById("hamburger")
		hamburger.classList.toggle('open');
		hamburger.classList.toggle('red');
		hamburger.classList.toggle('blue');
		document.querySelector('.static-menu').classList.toggle('active');
		document.querySelector('.section-container').classList.toggle('active');
	}

	onLogin(modalType: string){
		this.modal.openModal(modalType);
		this.scroll.disable();
	}
	onLogout(){
		this.data.logoutAulaUser();
		this.auth.logout();
		this.loggedAulaUser = null;
	}

	closeLoginModal(){
		this.modal.closeModal();
		this.scroll.enable();
	}

	changeCertificationModalStatus() {
		this.certModal = !this.certModal;
	}

	onSubmitLogin(form) {
		const user = {
			username: form.value.username,
			password: form.value.password
		}
		this.auth.loginAndSave(user)
		.then(res => {
			let username = this.auth['user']['username'].split('');
			let code = username.filter((letter) => {
				if(isNaN(parseInt(letter))){
					return letter;
				}
			})
			code = code.join('');
			let userLocal = JSON.parse(localStorage.getItem('aulaUser'));
			userLocal = {
				...userLocal,
				code: code
			}
			localStorage.setItem('aulaUser', JSON.stringify(userLocal));
			this.modal.closeModal();
			form.reset();
		});
		this.data.loginAulaUser(user)
			.subscribe(res => {
				if(res['data']){
					this.loggedAulaUser = {
						...res['data'],
						realLevel: this.data.formatLevel(res['data']['level'])
					}
					
					localStorage.setItem('aulaUser', JSON.stringify(this.loggedAulaUser));
					// console.log(this.loggedAulaUser);
					
					this.modal.closeModal();
					form.reset();
					const toasts = {
						type: 'success',
						message: 'Sesión iniciada'
					}
					this.modal.newToast(toasts);

					// Aquí empezamos a ver la distinción entre empresas y alumnos
					// console.log('emp', this.auth.user);
					  
				} else {
					// console.log('error');
					const toasts = {
						type: 'error',
						message: 'Usuario o contraseña incorrectos'
					}
					this.modal.newToast(toasts);
				}
			});
	}

	openAppointmentModal(kindOfModal: string){
		this.modal.openModal(kindOfModal);
		this.scroll.disable();
	}
	toggleSubmenu(str: string){
		if(this.submenu.submenu === ''){
			this.submenu.openSubmenu(str);
		} else {
			this.submenu.closeSubmenu();	
		}
		
	}

	trackingPhoneCallGAnav(){
		window.location.href='tel:914455511';
		(<any>window).ga('send', 'event', {
			eventCategory: 'llamadaNav',
			eventLabel: 'nav',
			eventAction: 'call',
			// eventValue: 10
		  });
		  this.google.phoneBtn();
		
	}

	setCourse(course_id) {
		// Set the statistics
		this.data.getCourse(course_id).subscribe(course => {
			this.data.setCourseStatistics(course_id, {
				"accesos": parseInt(course['Accesos']) + 1
			});
		});

		sessionStorage.setItem('course', course_id);
		this.course.getMasterCourse();
	}

}
