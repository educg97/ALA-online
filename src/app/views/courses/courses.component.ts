import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Title, Meta } from '@angular/platform-browser';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { Filters } from 'src/app/utils/filters';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { DrawComponent } from 'src/app/utils/draws';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.scss'],
	animations: [
		trigger('courseOnOff', [
			state('in', style({ opacity: '1' })),
			transition(':enter, :leave', [
				style({ opacity: '0' }),
				animate('600ms ease-in-out')
			])
		]),
		trigger('littleBallGroup', [
			state('in', style({ bottom: '90px' })),
			transition(':enter', [
				style({ bottom: '20px' }),
				animate('100ms ease-in-out')
			]),
			transition(':leave', [
				animate('100ms ease-in-out', style({ bottom: '20px' }))
			])
		]),
		trigger('littleBallGoal', [
			state('in', style({ bottom: '140px' })),
			transition(':enter', [
				style({ bottom: '20px' }),
				animate('200ms ease-in-out')
			]),
			transition(':leave', [
				animate('200ms ease-in-out', style({ bottom: '20px' }))
			])
		]),
		trigger('littleBallType', [
			state('in', style({ bottom: '190px' })),
			transition(':enter', [
				style({ bottom: '20px' }),
				animate('300ms ease-in-out')
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ bottom: '20px' }))
			])
		]),
		trigger('expansionLine', [
			state('in', style({ width: '250px' })),
			transition(':enter', [
				style({ width: '0' }),
				animate('300ms ease-in-out')
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ width: '0' }))
			])
		]),
		trigger('bubbleInOut', [
			state('in', style({ bottom: '15px' })),
			transition(':enter', [
				style({ bottom: '-200px' }),
				animate('300ms ease-in-out')
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ bottom: '-200px' }))
			])
		])
	]
})
export class CoursesComponent implements OnInit {

	constructor(
		public data: DataService,
		public titleService: Title,
		private meta: Meta,
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		public filters: Filters,
		public windowSize: WindowSizeComponent,
		public draws: DrawComponent

	) {
		this.titleService.setTitle('Más de 50 cursos de Inglés en Madrid | American Language Online');
		this.meta.updateTag({name: 'description', content: 'Los mejores cursos de inglés en Madrid ✔️. Consulta entre más de 50 cursos de inglés recomendados, clases de inglés para adultos, empresas y jóvenes.'});
		this.api = this.data.getApi();

		// Open Graph tags - the four first tags are required, the description is optional
		this.meta.updateTag({ property: 'og:title', content: 'Los mejores cursos de inglés en Madrid | American Language Online' });
		this.meta.updateTag({ property: 'og:type', content: 'website' });
		this.meta.updateTag({ property: 'og:url', content: 'https://www.americanlanguage.es/cursos-ingles-madrid' });
		this.meta.updateTag({ property: 'og:image', content: 'https://www.americanlanguage.es/assets/images/banners/50-cursos.jpg' });
		this.meta.updateTag({ property: 'og:description', content: 'Los cursos de inglés mejor valorados de Madrid 📓. Más de 50 cursos que se adaptan a ti. Clases de inglés para adultos, empresas y jóvenes.' });
	}

	// @Input() switch: boolean;


	// Variables
	courseData: any;
	courses: Object[] = [];
	markdown: any;
	api: string;
	newFilter: number = 1;
	singleCounter: number = 0;
	groupCounter: number = 0;
	onlineCounter: number = 0;
	mastercoursesData: any;
	mastercourses: any;
	megacourseData: any;
	megacourse: any;
	isLoading: boolean = true;
	isLeft: boolean = false;


	onlineFilter: boolean;
	groupFilter: boolean;
	singleFilter: boolean;

	preFiltersOn: boolean = false;
	typePrefilter: boolean = false;
	goalPrefilter: boolean = false;
	groupPrefilter: boolean = false;

	isNaN: Function = isNaN;

	showBubble: boolean;
	modernest: any;
	mastercoursesOffset: number[] = [];
	currentScroll: number = window.scrollY;

	courseURL: string;

	visibleCounter: number = 0;

	showStarRange: number[] = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 109, 119, 129, 139, 149, 159, 169, 179, 189, 199, 209];
  	showStar: boolean;
	

	ngOnInit() {
		this.getMastercourses();
		
		if (!this.windowSize.isMobile) {
			// this.getSwitch(true);
			this.isLeft = true;
		}

		this.draws.getNumberCounter(this.draws.high_probability);
		this.showStar = this.draws.showStar;
	}
	
	ngAfterViewInit() {
		window.addEventListener("scroll", () => {
			this.filterBubbleAppear();
			this.getOffsets();
			this.currentScroll = window.scrollY - window.innerHeight/2;
		});
	}

	ngOnDestroy() {
		window.removeEventListener('scroll', () => {
			this.filterBubbleAppear();
		}, false);
	}


	getOffsets() {
		// const modernestMastercourses = document.getElementsByClassName("modernest-mastercourse-container");
		const modernestMastercourses = document.getElementsByClassName("mastercourse-final-container");
		this.modernest = modernestMastercourses;
		this.mastercoursesOffset = [];
		for (let mast of <any>this.modernest) {
			this.mastercoursesOffset.push(mast.offsetTop);
		}
	}

	filterBubbleAppear() {
		const bubble = document.getElementById("outside-filters");
		this.showBubble = (bubble) ? window.scrollY > bubble.offsetTop + 400 : null;
	}

	getSwitch() {
		this.isLeft = !this.isLeft;
	}

	getMastercourses() {
		this.data.getMasterCourses().subscribe(data => {
			[].forEach.call(data, master => {
				this.sortCoursesInside(master['courses']);
				master['URL'] = (master['Name'] == 'Preparación de exámenes') ? '' : master['URL'];
				[].forEach.call(master['courses'], course => {
					course['visible'] = true;

					// Counting number of each kind of Course
					if (course['Modalidad Grupo']) {
						this.groupCounter++;
					}
					if (course['Modalidad Individual']) {
						this.singleCounter++;
					}
					if (course['Modalidad Online']) {
						this.onlineCounter++;
					}

					this.data.getCourse(course['id']).subscribe(res => {
						course['Image'] = res['Image']['url'];
						course['URL'] = res['mastercourse'][0]['URL'];
					});
				});
			});

			this.orderArrays(data);

			this.mastercoursesData = data;
			this.mastercourses = data;
			this.isLoading = false;
			this.getOffsets();
			this.filterMastercourses();
		});
	}

	filterMastercourses() {
		this.mastercourses = [];
		this.visibleCounter = 0;
		[].forEach.call(this.mastercoursesData, mastercourse => {
			let res = this.checkCoursesInsideMastercourses(mastercourse['courses'])
			if (res) {
				this.mastercourses.push(mastercourse);
			}
			if(mastercourse['Visible'] && (
				(mastercourse['Para Adultos'] && this.filters['courseFilters']['alumno_adulto']) ||
				(mastercourse['Para Jovenes'] && this.filters['courseFilters']['alumno_joven']) ||
				(mastercourse['Para Empresas'] && this.filters['courseFilters']['alumno_empresas']) ||
				(!this.filters['courseFilters']['alumno_adulto'] && !this.filters['courseFilters']['alumno_joven'] && !this.filters['courseFilters']['alumno_empresas'])
			) && (
				(mastercourse['Para Mejorar'] && this.filters['courseFilters']['objetivo_ingles']) ||
				(mastercourse['Para Certificar'] && this.filters['courseFilters']['objetivo_certificar']) ||
				(mastercourse['Para Trabajo'] && this.filters['courseFilters']['objetivo_empresa']) ||
				(!this.filters['courseFilters']['objetivo_ingles'] && !this.filters['courseFilters']['objetivo_certificar'] && !this.filters['courseFilters']['objetivo_empresa'])
			)) {
				this.visibleCounter++;
			}
		});
		console.log('Mastercourses result: ', this.visibleCounter);
	}

	checkCoursesInsideMastercourses(mastercourse) {
		let counterCourses: number = 0;
		[].forEach.call(mastercourse, course => {
			if (
				(this.onlineFilter && course['Modalidad Online']) ||
				(this.singleFilter && course['Modalidad Individual']) ||
				(this.groupFilter && course['Modalidad Grupo']) ||
				(!this.singleFilter && !this.onlineFilter && !this.groupFilter)) {
				counterCourses++;
			}
		});
		return (counterCourses > 0) ? true : false;
	}

	orderArrays(array: any) {
		[].sort.call(array, function (a, b) {
			var keyA = a['Prioridad'],
				keyB = b['Prioridad'];

			if (keyA > keyB) return 1;
			if (keyA < keyB) return -1;
			return 0;
		});
	}

	sortCoursesInside(courses) {
		[].sort.call(courses, function (a, b) {
			var keyA = a['Prioridad en Mastercourse'],
				keyB = b['Prioridad en Mastercourse'];

			if (keyA > keyB) return 1;
			if (keyA < keyB) return -1;
			return 0;
		});
	}

	toggleFilter(filter) {
		this.filters.courseFilters
		this.filters.setFilter(filter);

		if (filter === 'modalidad_online') {
			this.onlineFilter = !this.onlineFilter;
		} else if (filter === 'modalidad_individual') {
			this.singleFilter = !this.singleFilter;
		} else if (filter === 'modalidad_grupo') {
			this.groupFilter = !this.groupFilter;
		}

		this.filterMastercourses();
	}

	setCourse(course_id) {
		// Set the statistics
		this.data.getCourse(course_id).subscribe(course => {
			this.data.setCourseStatistics(course_id, {
				"accesos": parseInt(course['Accesos']) + 1
			});
		});

		sessionStorage.setItem('course', course_id);
	}

	filterModal() {
		this.modal.openModal('filterCourses');
		this.scroll.disable();
	}

	closeFilterModal() {
		this.modal.closeModal();
		this.scroll.enable();
	}

	togglePreFilters() {
		this.preFiltersOn = !this.preFiltersOn;
	}

	showHorizLine(type: string) {
		if (type === 'type') {
			this.typePrefilter = !this.typePrefilter;
		} else if (type === 'goal') {
			this.goalPrefilter = !this.goalPrefilter;
		} else if (type === 'group') {
			this.groupPrefilter = !this.groupPrefilter;
		}
	}
}
