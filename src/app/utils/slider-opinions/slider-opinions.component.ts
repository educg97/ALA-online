import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { WindowSizeComponent } from '../window-size';
import { ModalComponent } from '../modal';
import { ScrollComponent } from '../scroll';

@Component({
  selector: 'app-slider-opinions',
  templateUrl: './slider-opinions.component.html',
  styleUrls: ['./slider-opinions.component.scss']
})
export class SliderOpinionsComponent implements OnInit {

  constructor(
    public data: DataService,
    public windowSize: WindowSizeComponent,
    public modal: ModalComponent,
    public scroll: ScrollComponent
  ) { }

  totalNumOpinions: number = 0;
  opinions: any;
	opinionsData: any;
	topRowOpinions: any = [];
	bottomRowOpinions: any = [];
  fadeOut: boolean = false;
  rangeValue: number = 0;
  opinionsPosition: number = 0;
  awardsPosition: number = 1;
  selectedOpinion: number;

  ngOnInit() {
    this.data.getOpinions().subscribe(opinions => {
      [].forEach.call(opinions, op => {
        op['realStars'] = this.formatStars(op['Stars']);
        op['shortComment'] = (op['Comentario'].length > 130) ? op['Comentario'].slice(0, 130) + '...' : op['Comentario'];
        this.totalNumOpinions++;
      });
      this.opinions = opinions;
      this.opinionsData = opinions;
      const halfLength = (this.opinionsData.length % 2 == 0) ? this.opinionsData.length / 2 : (this.opinionsData.length - 1) / 2;

      for (let i = 0; i < halfLength; i++) {
        this.topRowOpinions.push(this.opinionsData[i]);
      }
      for (let k = halfLength; k <= this.opinionsData.length - 1; k++) {
        this.bottomRowOpinions.push(this.opinionsData[k]);
      }

      this.getRandomOpinions();
    });

    if (this.windowSize.isMobile) {
      this.slideOpinions();
    }
    const opinionsRow = document.getElementById('opinions-line');
    const input = document.getElementById('inputRange');
    opinionsRow.addEventListener('scroll', () => {
      setTimeout(() => {
        const r = Math.floor(opinionsRow.scrollLeft / this.windowSize.windowSize);
        this.rangeValue = ((r / this.topRowOpinions.length) * 100);
        input['value'] = Math.floor(this.rangeValue);
        this.opinionsPosition = Math.round((this.rangeValue / 100) * this.topRowOpinions.length) + 1;
      }, 250);
    });
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

  getRandomOpinions() {
    this.fadeOut = true;
    setTimeout(() => {
      this.opinions = [];
      for (let i = 0; i < this.opinionsData.length; i++) {
        const randomNum = Math.floor(Math.random() * 49);
        const randomOpinion = this.opinionsData[randomNum];
        this.opinions.push(randomOpinion);
      }
      this.fadeOut = false;
    }, 800);
  }

  slideAwardsRight() {
    this.awardsPosition = (this.awardsPosition % 5) + 1;
  }

  slideOpinions() {
    setInterval(() => {
      this.slideAwardsRight();
      this.scrollElement('.slider-awards', this.awardsPosition);
    }, 4000);
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

  handleRange(){
		const opinionsRow = document.getElementById('opinions-line');

		const range = event.target['value'];
		const maxPosition = this.topRowOpinions.length;
		this.opinionsPosition = Math.floor((range / 100) * maxPosition);
		opinionsRow.scrollLeft = this.opinionsPosition*this.windowSize.windowSize;
  }
  
  watchOriginal(opinion: any) {
		this.selectedOpinion = opinion['url'];
		this.modal.openModal('original-opinion');
		this.scroll.disable();
	}

  closeOpinionModal(){
		this.modal.closeModal();
		this.scroll.enable();
	}

}
