import { Component, OnInit } from '@angular/core';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { Filters } from 'src/app/utils/filters';
import { Config } from 'src/app/utils/config';
import { Google } from 'src/app/utils/google';
import { ModalComponent } from '../../utils/modal';
import { AuthComponent } from '../../utils/auth.component';
import { DataService } from '../../data.service';
import { ScrollComponent } from '../../utils/scroll';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CourseComponent } from 'src/app/views/courses/course/course.component';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	animations: [
		trigger('logo', [
			transition(':enter', [
        	style({ opacity: 0 }),
				animate('100ms ease-in-out', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('100ms ease-in-out', style({ opacity: 0 }))
      		])
		]),
		trigger('redBanner', [
			transition(':enter', [
        	style({ opacity: 0 }),
				animate('300ms ease-in-out', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ opacity: 0 }))
      		])
		]),
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
export class NavComponent implements OnInit {

	constructor(
		public window_util: WindowSizeComponent,
		public filters: Filters,
		public config: Config,
		public modal: ModalComponent,
		public auth: AuthComponent,
		public data: DataService,
		public scroll: ScrollComponent,
		public google: Google,
		public course: CourseComponent
	) { }

	bannerHeight: number;
	links: NodeListOf<HTMLElement>;
	logo: boolean;
	redBanner: boolean;
	loginRespond: object;
	loggedAulaUser: object = JSON.parse(localStorage.getItem('aulaUser'));

	ngOnInit() {
		this.addListeners();
	}

	ngAfterViewInit() {
		if (this.window_util.isDesktop) this.getElements();
	}

	private addListeners() {
		this.window_util.observable.subscribe(win => {
			if (win['isDesktop']) this.getElements();
		})
		this.scroll.observable.subscribe(scr => {
			if (this.window_util.isDesktop) {
				// console.log("window.pageYOffset -->", window.pageYOffset);
				this.links.forEach(link => {
					if (this.calculateHeight(link.offsetLeft) <= window.pageYOffset) {
						link.classList.add('text-blue-gray');
					} else {
						link.classList.remove('text-blue-gray');
					}
				})
				if (this.scroll['scroll'] < 380 || this.window_util['windowSize'] < 1150){
					this.logo = false;
				} else {
					this.logo = true;
				}

				if (window.pageYOffset > 97){
					this.redBanner = false;
					// console.log("window.pageYOffset -->", window.pageYOffset);
				} else {
					this.redBanner = true;
					// console.log("window.pageYOffset -->", window.pageYOffset);
				}
			}
		})
	}

	private calculateHeight(width) {
		// tan(10deg) = 0.1763269807
		return this.bannerHeight - (0.1763269807 * width);
	}

	private getElements (){
		this.bannerHeight = document.getElementById('nav-shape').clientHeight;
		this.links = document.getElementById('menu-links').children[0].querySelectorAll('.link');
		// this.logo = document.getElementById('nav-logo-sticky');
	}

	onLogin(modalType: string) {
		this.modal.openModal(modalType);
		this.scroll.disable();
	}
	onLogout() {
		this.data.logoutAulaUser();
		this.auth.logout();
		this.loggedAulaUser = null;
	}

	closeLoginModal() {
		this.modal.closeModal();
		this.scroll.enable();
	}

	openCertificationModal() {
		this.modal.openModal('certificationCourseSelection');
		this.scroll.disable();
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
					if (isNaN(parseInt(letter))) {
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
				if (res['data']) {
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
