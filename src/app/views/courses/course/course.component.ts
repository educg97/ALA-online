import { Component, OnInit, Injectable } from '@angular/core';
import { Title, DomSanitizer, SafeResourceUrl, Meta } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { Filters } from 'src/app/utils/filters';
import { ModalComponent } from 'src/app/utils/modal';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { ScrollComponent } from 'src/app/utils/scroll';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { Config } from 'src/app/utils/config';
import { Google } from 'src/app/utils/google';
import { DrawComponent } from 'src/app/utils/draws';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss'],
	animations: [
		trigger('bar', [
			state('in', style({ height: '12px' })),
			transition(':enter', [
				style({ height: '0' }),
				animate('600ms ease-in-out')
			]),
			transition(':leave',
				animate('600ms ease-in-out', style({ height: '0' }))
			)
		])
	]
})

@Injectable({
	providedIn: 'root'
})

export class CourseComponent implements OnInit {

	constructor(
		public data: DataService,
		public titleService: Title,
		private meta: Meta,
		public sanitizer: DomSanitizer,
		public filters: Filters,
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		public windowSize: WindowSizeComponent,
		public config: Config,
		public google: Google,
		public draws: DrawComponent
	) {
		this.api = this.data.getApi();
	}

	api: string;
	public mastercourse: Object;
	public course: Object;
	title: string;
	color: string;
	course_position: number;
	course_block: HTMLElement;
	course_element: HTMLElement;
	course_media: boolean;
	mastercourse_video: SafeResourceUrl;
	course_video: SafeResourceUrl;
	course_width: number;
	max_width: number;
	scrollCourse: number;
	scrollPill: number;
	scroll_index: any;
	loading: boolean;
	test: any;
	mobile: boolean = false;
	urlOriginal: string;
	opinionsPosition: number = 0;
	rangeValueOpinions: number = 0;
	selectedComment: Object;
	jsonSchema: any;
	filtersBack: Filters;

	pill_block: HTMLElement;
	pill_max_width: number;
	pill_element: HTMLElement;
	pill_width: number;
	loading_pill: boolean;
	pill_position: number;
	isLoading: boolean = true;

	showStar: boolean;
	showHorse: boolean = true;

	firstMessageOn: boolean;
	secondMessageOn: boolean;

	isNaN: Function = isNaN;

	url_params: string[] = location.href.split('/').pop().split('#');

	public ngOnInit() {
		this.filtersBack = this.filters;

		this.getMasterCourse();

		this.draws.getNumberCounter(this.draws.high_probability);
		this.showStar = this.draws.showStar;

		if (this.modal.modals === 'horse-contest') {
			this.modal.closeModal();
		}

		// Check if there is some data coming from the horse contest, to show the horse or not
		const horseStep = Number(sessionStorage.getItem('horse-step'));
		if(horseStep == 7) {
		  this.showHorse = true;
		}
	}

	ngOnDestroy() {
		// sessionStorage.removeItem("course");
		this.config.header_image = '';
		this.filters.clearFilters();
		this.filters.setFilters(this.filtersBack);
	}

	ngAfterViewInit() {
		if (document.getElementById(this.url_params[1])) {
			document.getElementById(this.url_params[1]).scrollIntoView();
		}
		this.setCourse(this.course_position);
		this.setScrollListener('.course-buttons');
		this.setScrollListener('.course-block');

		this.getOpinionsMedia();


		const windowHeight = window.outerHeight;
		const docHeight = document.documentElement.scrollHeight;

		if(this.mastercourse && this.mastercourse['slug'] === 'preparacion-toefl'){
			const messages = document.getElementById('faded-messages');
			window.addEventListener('scroll', () => {
				let windowScroll = window.scrollY;
				let messagePlace = messages.offsetTop;
				let topBreakpoint = messagePlace - windowHeight;
	
				if (messagePlace - windowHeight <= windowScroll && messagePlace - windowHeight / 2 >= windowScroll) {
					this.firstMessageOn = true;
					this.secondMessageOn = false;
				} else if (messagePlace - windowHeight <= windowScroll && messagePlace - windowHeight / 2 <= windowScroll) {
					this.firstMessageOn = false;
					this.secondMessageOn = true;
				} else if (windowScroll < topBreakpoint - 300 || windowScroll > messagePlace - 300) {
					this.firstMessageOn = false;
					this.secondMessageOn = false;
				}
			});
		}
	}

	getSchemas() {
		let schema = {};
		let coursesInside = [];
		// this.data.getCoursesDates().subscribe(res => {
		// 	console.log('Fechas', res);
		// });
		[].forEach.call(this.mastercourse['courses'], course => {
			let courseSchema = {
				"name": course['Title'],
				"courseMode": (course['Modalidad Grupo']) ? 'Grupo' : course['Modalidad Individual'] ? 'Individual' : course['Modalidad Online'] ? 'Online' : 'A medida',
				"endDate": course['dates'],
				"location": {
					"@type": "Place",
					"address": "Plaza del Conde del Valle de Suchil, 17"
				},
				"startDate": course['dates']
			}
			coursesInside.push(courseSchema);
		})
		schema = {
			"@context": "http://schema.org/",
			"@id": this.mastercourse['id'],
			"@type": "Course",
			"name": this.mastercourse['Name'],
			"description": this.mastercourse['Descripcion corta'],
			"hasCourseInstance": coursesInside
		}
		this.jsonSchema = schema;
		// console.log(this.mastercourse['courses']);
		// console.log(this.jsonSchema); // no consigo agarrar las fechas
	}

	slideOpinionsPro() {
		const opinionsLength = document.querySelectorAll('.single-comment').length;
		const opinionsSlider = document.getElementById('comment-slider');
		const inputOpinions = document.getElementById('inputRangeCourse');
		opinionsSlider.addEventListener('scroll', () => {
			setTimeout(() => {
				const g = Math.round(opinionsSlider.scrollLeft / this.windowSize.windowSize);
				this.rangeValueOpinions = ((g / opinionsLength) * 100);
				inputOpinions['value'] = Math.round(this.rangeValueOpinions);
			}, 250);
		});
	}

	sortCoursesInside(courses) {
		return [].sort.call(courses, function (a, b) {
			var keyA = a['Prioridad en Mastercourse'],
				keyB = b['Prioridad en Mastercourse'];

			if (keyA > keyB) return 1;
			if (keyA < keyB) return -1;
			return 0;
		});
	}

	public getMasterCourse() {
		let url = '/' + this.url_params[0];
		this.data.getMasterCourseByUrl(url).subscribe(masterdata => {
			let desc = this.data.getMarkdown(masterdata[0]["Description"]).split('</p>');
			desc = desc.join('</p><i class="fas fa-cicle separator">~</i>');
			desc = desc.split('<img');
			desc = desc.join('<img class="image-description-course"');

			// Trying to insert banners between the parapgraphs
			let descBanner = desc.split('inglés.</p>');
			descBanner = descBanner.join('inglés.</p><div><app-nav-banner></app-nav-banner></div>');
			// console.log(descBanner);

			masterdata[0]["Description"] = desc;
			this.setTitle(masterdata[0]["Header Title"] ? masterdata[0]["Header Title"] : "Curso Inglés Online");
			this.meta.updateTag({ name: 'description', content: masterdata[0]["Meta description"] ? masterdata[0]["Meta description"] : "Curso Inglés Online" });

			// Open Graph tags - the four first tags are required, the description is optional
			this.meta.updateTag({ property: 'og:title', content: masterdata[0]["Meta Title"] ? masterdata[0]["Meta Title"] : "Curso Inglés Online" });
			this.meta.updateTag({ property: 'og:type', content: 'website' });
			this.meta.updateTag({ property: 'og:url', content: '' });
			this.meta.updateTag({ property: 'og:image', content: '' });
			this.meta.updateTag({ property: 'og:description', content: masterdata[0]["Meta description"] ? masterdata[0]["Meta description"] : "Curso Inglés Online" });

			this.config.header_image = this.data.api + masterdata[0]['Foto'][1]['url'];

			masterdata[0]['courses'] = this.sortCoursesInside(masterdata[0]['courses']);
			masterdata[0]['Articulo final'] = format(this.data.getMarkdown(masterdata[0]['Articulo final']));
			masterdata[0]['slug'] = masterdata[0]['URL'] ? masterdata[0]['URL'].split('/')[1] : '';


			this.mastercourse = masterdata[0];
			if (this.mastercourse['Video']) {
				this.mastercourse_video = this.sanitizer.bypassSecurityTrustResourceUrl(this.mastercourse['Video']);
			}
			this.mastercourse['courses'] = this.removeDuplicates(this.mastercourse['courses'], 'id');
			this.getOpinionsMedia();
			this.getCourse();
			this.isLoading = false;
		});
		function format(text: string) {
			return text.trim().split('\n').join('<br>').split('<img').join('<img class="final-article-picture"');
		}
	}

	removeDuplicates(originalArray, prop) {
		let newArray = [];
		let lookupObject = {};

		for (let i in originalArray) {
			lookupObject[originalArray[i][prop]] = originalArray[i];
		}

		for (let k in lookupObject) {
			newArray.push(lookupObject[k]);
		}
		return newArray;
	}

	addScrollListeners() {
		this.setScrollListener('.course-buttons');
		this.setScrollListener('.course-block');
	}

	getCourse() {
		let index = 0;
		let course_id = sessionStorage.getItem("course");
		if (sessionStorage.getItem("course")) {
			let temp_index = this.mastercourse['courses'].map(course => { return course._id }).indexOf(course_id);
			if (temp_index > 0) index = temp_index; // if it doesn't find the course or if it doesn't have one, return 0
		}

		this.course_position = index;
		this.setCourse(index);
	}

	setCourse(i: number = 0) {
		this.loading = true;
		let index = this.course_position = i != undefined ? i : this.course_position;

		// Get the course from the mastercourse list of courses
		this.course = this.mastercourse['courses'][index];
		sessionStorage.setItem("course", this.course['_id']);

		const filters = {
			alumno_adulto: this.course['Alumno Adulto'],
			alumno_joven: this.course['Alumno Joven'],
			alumno_empresa: this.course['Alumno Empresa'],
			modalidad_grupo: this.course['Modalidad Grupo'],
			modalidad_individual: this.course['Modalidad Individual'],
			modalidad_online: this.course['Modalidad Online'],
			objetivo_empresa: this.course['Objetivo Ingles para empresas'],
			objetivo_certificar: this.course['Objetivo Certificar tu nivel'],
			objetivo_ingles: this.course['Objetivo Mejorar tu Ingles']
		}
		this.filters.setFilters(filters);

		this.scrollElement('.course-block', index);
		this.scrollElement('.course-buttons', index);
		this.getCourseMedia();
	}

	public setTitle(newTitle: string) {
		this.titleService.setTitle(newTitle);
	}

	getOpinionsMedia() {
		this.data.getOpinionsByCourse(this.mastercourse['_id']).subscribe(res => {
			this.mastercourse['opinions'] = res;
		});
	}

	getCourseMedia() {
		// TODO find a way to just get the image src from the api
		this.data.getCourse(this.course['_id']).subscribe(data => {
			this.course['Horarios'] = format(this.course['Horarios']);
			this.course['Grupos'] = format(this.course['Grupos']);
			this.course['Precio (Texto)'] = format(this.course['Precio (Texto)']);
			this.course['Description'] = this.data.getMarkdown(format(this.course["Description"]));

			function format(text: string) {
				return text.trim().split('\n').join('<br>');
			}

			this.course['Image'] = data['Image'];
			this.course['dates'] = data['dates'];
			// this.course['opinions'] = data['opinions'];
			this.course['faqs'] = data['faqs'];
			this.course['faqs'].forEach(question => {
				question['show'] = false;
			});
			this.setCourseMedia();
			this.slideOpinions();
		});
	}

	setCourseMedia() {
		if (this.course['Video']) {
			this.course_video = this.sanitizer.bypassSecurityTrustResourceUrl(this.course['Video']);
			this.course_media = true;
		} else {
			this.course_media = false;
		}
	}

	scrollElement(selector: string, pos: number) {
		let parent = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		if (parent) {
			let child = elements[pos] as HTMLElement;
			if (child) {
				parent.scrollLeft = child.offsetLeft;
			}
		}
	}

	scrollRelative(direction: "left" | "right") {

		switch (direction) {
			case "left":
				this.scrollElement('.course-buttons', this.course_position - 1);
				this.scrollElement('.course-block', this.course_position - 1);
				break;
			case "right":
				this.scrollElement('.course-buttons', this.course_position + 1);
				this.scrollElement('.course-block', this.course_position + 1);
				break;
		}

	}

	setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
					this.setCourse(Math.round(index));
				} else if (scroll == 0) {
					this.setCourse(0);
					return 1;
				}
			})
		})
	}


	// Opinions
	opinion_counter: number = 1;

	slideOpinions() {
		if (this.mastercourse['opinions'] && this.mastercourse['opinions'].length > 0) {
			this.mastercourse['opinions'].forEach(opinion => {
				opinion['realStars'] = this.formatStars(opinion['Stars']);
				opinion['shortComment'] = (opinion['Comentario'].length > 130) ? opinion['Comentario'].slice(0, 130) + '...' : opinion['Comentario'];
				opinion['Author'] = (opinion['Author'].split(' ').length < 2) ? `${opinion['Author'].split(' ')[0]}A` : opinion['Author'];
			});
		}
	}

	printComment(opinion: any) {
		console.log(opinion);
	}

	formatStars(valuation: number) {
		const overFive = valuation / 2;

		const fullStars = new Array(Math.floor(overFive));
		const halfStar = (overFive % 1 != 0) ? true : false;

		const arrStars = {
			fullStars: fullStars,
			halfStar
		}
		return arrStars;
	}

	seeOriginalOpinion(url) {
		this.modal.openModal('original-opinion');
		this.scroll.disable();
		this.urlOriginal = url;
	}

	closeOpinionModal() {
		this.modal.closeModal();
		this.scroll.enable();
	}

	imgLoaded() {
		this.loading = false;
	}

	handleRangeCourse() {
		const opinionsLength = document.querySelectorAll('.single-comment').length;
		const asociationSlider = document.getElementById('comment-slider');
		const range = event.target['value'];

		this.opinionsPosition = Math.floor((range / 100) * opinionsLength);
		asociationSlider.scrollLeft = this.opinionsPosition * this.windowSize.windowSize;
	}

	openFullOpinion(modal: string, comment: Object) {
		this.selectedComment = comment;
		this.modal.openModal(modal);
		this.scroll.disable();
	}

	// The code below is for tracking this event in Google Analytics
	trackCallGAcourse() {
		window.location.href = 'tel:914455511';
		this.google.phoneBtn();
		(<any>window).ga('send', 'event', {
			eventCategory: 'llamadaCurso',
			eventLabel: 'course',
			eventAction: 'call',
			// eventValue: 10
		});
	}

	openContactModal() {
		this.modal.openModal('contact');
		this.scroll.disable();
	}

	closeContactModal() {
		this.scroll.enable();
		this.modal.closeModal();
	}
}

