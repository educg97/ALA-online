import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Filters } from 'src/app/utils/filters';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { DrawComponent } from 'src/app/utils/draws';
import { Router, NavigationEnd, RoutesRecognized, RouterState } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	// Variables
	text: Object;
	showStar: boolean;
	render: boolean;


	constructor(
		public titleService: Title,
		private meta: Meta,
		public data: DataService,
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		// public filters: Filters,
		public draws: DrawComponent,
		private router: Router
	) {
		this.router.events.subscribe(() => {
			if(window.location.pathname === '/') {
				this.render = true;
			} else {
				this.render = false;
			}
		});
		this.titleService.setTitle('Aprende inglés online desde el mejor sitio web de aprendizaje de inglés a distancia');
		this.meta.updateTag({ property: 'description', content: 'El mejor sitio web para aprender inglés online 💻, con los 5 cursos de inglés online más recomendados, exámenes oficiales de inglés online y la mejor app para aprender inglés 📱.' });
		
		// Open Graph tags - the four first tags are required, the description is optional
		this.meta.updateTag({ property: 'og:title', content: 'Aprende inglés online desde el mejor sitio web de aprendizaje de inglés a distancia' });
		this.meta.updateTag({ property: 'og:type', content: 'website' });
		this.meta.updateTag({ property: 'og:url', content: 'https://www.americanlanguage.online/' });
		this.meta.updateTag({ property: 'og:image', content: 'assets/images/banners/mejor-academia-ingles-online.jpg' });
		this.meta.updateTag({ property: 'og:description', content: 'El mejor sitio web para aprender inglés online 💻, con los 5 cursos de inglés online más recomendados, exámenes oficiales de inglés online y la mejor app para aprender inglés 📱.' });
	}

	ngOnInit() {
		this.draws.getNumberCounter(this.draws.high_probability);
		this.showStar = this.draws.showStar;
	}

	openCertificationModal() {
		this.modal.openModal('certificationCourseSelection');
		this.scroll.disable();
	}

	closeFilterModal() {
		this.modal.closeModal();
		this.scroll.enable();
	}

}
