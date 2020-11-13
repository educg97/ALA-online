import { Component, OnInit, Input } from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { WindowSizeComponent } from '../window-size';
import { ScrollComponent } from '../scroll';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-slider-teachers',
  templateUrl: './slider-teachers.component.html',
  styleUrls: ['./slider-teachers.component.scss'],
  animations: [
		trigger('frontContent', [
			state('in', style({ opacity: 1 })),
			transition(':leave',
				animate('300ms ease-in-out', style({ opacity: 0 }))
			)
    ]),
    trigger('backContent', [
			state('in', style({ opacity: 1 })),
			transition(':leave',
				animate('300ms ease-in-out', style({ opacity: 0 }))
			)
    ]),
    trigger('arrowLeft', [
			transition(':enter', [
        style({ left: '-20px' }),
				animate('300ms ease-in-out', style({ left: '20px' }))
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ left: '-20px' }))
      ])
    ]),
    trigger('arrowRight', [
			transition(':enter', [
        style({ right: '-20px' }),
				animate('300ms ease-in-out', style({ right: '20px' }))
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ right: '-20px' }))
      ])
		])
	]
})
export class SliderTeachersComponent implements OnInit {

  constructor(
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public data: DataService
  ) { }

  @Input() public webpage: string;

  floating: boolean;
  floatingJeff: boolean = false;
  teacherPosition: number = 0;
  showArrowRight: boolean = true;
  jeffFlipped: boolean = false;
  teachers: any[] = [];

  ngOnInit() {
      this.data.getTeachers().subscribe(res => {
      const teachers = [].map.call(res, teacher => {
        teacher['name'] = teacher['Nombre'];
        teacher['picture'] = 'https://api.americanlanguage.es' + teacher['Foto']['url'];
        teacher['city'] = teacher['Ciudad'];
        teacher['flag'] = teacher['Pais'].map(flag => 'https://api.americanlanguage.es' + flag['url']);
        teacher['caption'] = teacher['FrontSide'];
        teacher['interests'] = teacher['BackSide'];
        teacher['flipped'] = false;
        teacher['toefl'] = teacher['Toefl'];
        teacher['toeflText'] = teacher['TextoToefl'];

        return teacher;
      });

      this.teachers = teachers.filter(t => t['Mostrar']);
      if(this.webpage !== 'preparacion-toefl') {
        this.teachers = this.teachers.sort((a, b) => {
          if (a['name'] > b['name']) {
            return 1;
          } else if (a['name'] < b['name']) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    });
  }
  
  ngAfterViewInit() {
    if(!this.windowSize.isDesktop) {
      this.setScrollListener('#slider-teachers-flipping');
    }
  }

  flipTeacher(index: number) {
    this.teachers[index]['flipped'] = !this.teachers[index]['flipped'];
    this.floating = true;
    setTimeout(() => {
      this.floating = false;
    }, 300);
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          this.teacherPosition = Math.round(index);
				} else if (scroll == 0) {
          this.teacherPosition = 0;
					return 1;
				}
			})
		})
  }

  moveSlider(str: string){
    if(str === 'next'){
      this.teacherPosition++;
    } else if(str === 'prev'){
      this.teacherPosition--;
    }

    const sliderLength = (this.webpage === 'preparacion-toefl') ? this.teachers.filter(teacher => teacher['toefl']).length - 1 : this.teachers.length - 1;
    
    const sliderTeachers = document.getElementById('slider-teachers-flipping');
    const cardWidth = document.querySelector('.single-teacher').clientWidth;
    if(this.windowSize.isDesktop) {
      sliderTeachers.scrollLeft = this.teacherPosition*cardWidth;
    } else {
      sliderTeachers.scrollLeft = this.teacherPosition*this.windowSize.windowSize;
    }

    if(this.teacherPosition*cardWidth >= (sliderLength)*cardWidth){
      this.showArrowRight = false;
    } else {
      this.showArrowRight = true;
    }
  }

  flipJeff() {
    this.jeffFlipped = !this.jeffFlipped;

    this.floatingJeff = true;
    setTimeout(() => {
      this.floatingJeff = false;
    }, 300);
  }
}
