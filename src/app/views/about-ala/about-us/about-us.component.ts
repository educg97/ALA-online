import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Title, Meta } from '@angular/platform-browser';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ScrollComponent } from 'src/app/utils/scroll';
import { ModalComponent } from 'src/app/utils/modal';
import { DrawComponent } from 'src/app/utils/draws';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  animations: [
		trigger('factInOut', [
			state('in', style({ opacity: 1 })),
			transition(':enter', [
				style({ opacity: 0 }),
				animate('300ms ease-in-out')
			]),
			transition(':leave',
				animate('300ms ease-in-out', style({ opacity: 0 }))
			)
		])
	]
})
export class AboutUsComponent implements OnInit {

  constructor(
    public data: DataService,
    public modal: ModalComponent,
    public titleService: Title,
    private meta: Meta,
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public draws: DrawComponent
    ) {
      // Open Graph tags - the four first tags are required, the description is optional
      this.meta.updateTag({ property: 'og:title', content: 'Conoce American Language Online | Enseñando inglés desde 1968' });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:url', content: 'https://www.americanlanguage.online/sobre-nosotros' });
      this.meta.updateTag({ property: 'og:image', content: 'https://www.americanlanguage.online/assets/images/banners/academia-ingles-adultos.jpg' });
      this.meta.updateTag({ property: 'og:description', content: 'Las 3 academias de inglés mejor valoradas 💯. Los expertos recomiendan nuestras academias de idiomas ✔ | American Language Online' });
    }

    dotsHeadquarters: any = [];
    headquarterPosition: number = 0;
    funFacts: any;
    selectedFact: number = 0;
    showStar: boolean;

    showHorse: boolean;

  ngOnInit() {
    this.meta.updateTag({name: 'description', content: 'Las 3 mejores academias de inglés. Academias de idiomas recomendadas por expertos ✔️: American Language Online. ¡Aprende inglés online!'});
    this.titleService.setTitle('Las mejores Academias de inglés online para Adultos | American Language Online');
  
    // Check if is this page's turn for the Star
    // this.data.getDraws().subscribe(k => {
    //   const num = Math.random();
    //   console.log('Academias: ', num);
    //   if(num >= this.draws.high_probability) this.showStar = true;
    // });
    this.draws.getNumberCounter(this.draws.low_probability);
    this.showStar = this.draws.showStar;

    this.data.getFunFacts().subscribe(res => {
      // console.log(res);
      this.funFacts = res;
    });

    if(this.modal.modals === 'horse-contest'){
      this.modal.closeModal();
    }

    // Check if there is some data coming from the horse contest, tho show the horse or not
    const horseStep = Number(sessionStorage.getItem('horse-step'));
    if(horseStep == 4) {
      this.showHorse = true;
    }
  }

  ngAfterViewInit() {
    this.dotsHeadquarters   = this.scroll.dotsGenerator('slider-headquarters');
    this.setScrollListener('#slider-headquarters');

    if(window.location['search'] === '?juego=true') {
      const gameLetter = document.getElementById('gameLetter');
      gameLetter.scrollIntoView();
    }
  }

  scrollComponent(parentId: string, position: number) {
    if(parentId === 'slider-headquarters'){
      this.headquarterPosition = position;
    }
    const parent = document.getElementById(parentId);
    parent.scrollLeft = position*this.windowSize.windowSize;
  }

  goToForm(){
    const mainForm = document.getElementById('main-contact-form');

    mainForm.scrollIntoView({block: 'center', behavior: "smooth"});
  }

  moveFunFact(str: string){
    if(str === 'next'){
      // this.selectedFact = (this.selectedFact % this.funFacts.length) + 1;
      if(this.selectedFact === this.funFacts.length-1){
        this.selectedFact = 0;
      } else {
        this.selectedFact++;
      }
    } else {
      this.selectedFact = Math.floor((this.funFacts.length  - this.selectedFact) / this.funFacts.length) * this.funFacts.length + ((this.selectedFact - 1) % this.funFacts.length);
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
          if(selector === '#slider-headquarters'){
            this.headquarterPosition = Math.round(index);
          }
				} else if (scroll == 0) {
          if(selector === '#slider-headquarters'){
            this.headquarterPosition = 0;
          }
					return 1;
				}
			})
		})
  }
}
 