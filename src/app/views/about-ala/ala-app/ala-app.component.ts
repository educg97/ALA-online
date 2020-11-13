import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { DrawComponent } from 'src/app/utils/draws';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { ScrollComponent } from 'src/app/utils/scroll';

@Component({
  selector: 'app-ala-app',
  templateUrl: './ala-app.component.html',
  styleUrls: ['./ala-app.component.scss']
})
export class AlaAppComponent implements OnInit {

  constructor(
    public titleService: Title,
    private meta: Meta,
    public data: DataService,
    public draws: DrawComponent,
    public scroll: ScrollComponent,
    public windowSize: WindowSizeComponent
  ) {
    // Open Graph tags - the four first tags are required, the description is optional
		this.meta.updateTag({ property: 'og:title', content: 'Flash Class es la mejor app para aprender inglés en 2021 ⚡' });
		this.meta.updateTag({ property: 'og:type', content: 'website' });
		this.meta.updateTag({ property: 'og:url', content: 'https://www.americanlanguage.online/app-aprender-ingles' });
		this.meta.updateTag({ property: 'og:image', content: 'https://www.americanlanguage.online/assets/images/flash-logos/app-flash-logo-2.png' });
    this.meta.updateTag({ property: 'og:description', content: '✔️ La aplicación más recomendada para aprender inglés con lecciones en vídeo y clases con profesores nativos a distancia 👩‍🏫 Clases de inglés de conversación al instante con la mejor aplicación para hablar inglés cuando quieras.' });
  }

  showStar: boolean;
  headquarterPosition: number = 0;
  dotsHeadquarters: any = [];

  ngOnInit() {
    this.titleService.setTitle('Flash Class es la mejor app para aprender inglés en 2021 ⚡');
    this.meta.updateTag({name: 'description', content: '✔️ La aplicación más recomendada para aprender inglés con lecciones en vídeo y clases con profesores nativos a distancia 👩‍🏫 Clases de inglés de conversación al instante con la mejor aplicación para hablar inglés cuando quieras.'});
    this.draws.getNumberCounter(this.draws.low_probability);
    this.showStar = this.draws.showStar;
  }

  ngAfterViewInit() {
    this.dotsHeadquarters = this.scroll.dotsGenerator('slider-headquarters');
    this.setScrollListener('#slider-headquarters');
  }

  scrollComponent(parentId: string, position: number) {
    this.headquarterPosition = position;
    const parent = document.getElementById(parentId);
    parent.scrollLeft = position*this.windowSize.windowSize;
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          this.headquarterPosition = Math.round(index);
				} else if (scroll == 0) {
          this.headquarterPosition = 0;
					return 1;
				}
			})
		})
  }

}
