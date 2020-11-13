import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/utils/modal';
import { DrawComponent } from 'src/app/utils/draws';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-slider-companies',
  templateUrl: './slider-companies.component.html',
  styleUrls: ['./slider-companies.component.scss']
})
export class SliderCompaniesComponent implements OnInit {

  constructor(
    public modal: ModalComponent,
    public draws: DrawComponent,
    public data: DataService
  ) { }

  showStar: boolean;
  showStarRange: number[] = [8, 18, 28, 38, 48, 58, 68, 78, 88, 98];

  sliderCount: number = 1;
  companies: object[] = []

  ngOnInit() {
    this.data.getCompanyBalls().subscribe(res => {
      this.companies = [].map.call(res, ball => {
        ball['name'] = this.string_to_slug(ball['Nombre']);
        ball['image'] = 'https://api.americanlanguage.es' + ball['Logo']['url'];
        ball['color'] = ball['Color'];
        ball['size'] = ball['Size'];
        ball['alt'] = ball['Texto alternativo imagen'];

        return ball;
      });
      this.companies = this.companies.filter(ball => ball['Mostrar']);
      console.log(this.companies);
    });
  }

  ngAfterViewInit(){
    // const comp = document.getElementById('companies-slider');
    // [].forEach.call(comp.children, (company: HTMLElement, i) => {
    //   company.style.left = "2000px"
    //   setTimeout(() => {
    //     setInterval(() => {
    //       let current = parseInt(company.style.left.substring(0, company.style.left.length - 2))
    //       company.style.left = current - 5 + "px";
    //     }, 100)
    //   }, i*1000);
    // })
  }

  string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  nextSlide(){
    this.sliderCount = (this.sliderCount % 3) + 1;
    console.log(this.sliderCount);
  }

  prevSlide(){
    this.sliderCount = Math.floor((3 + 1 - this.sliderCount) / 3) * 3 + ((this.sliderCount - 1) % 3);
    console.log(this.sliderCount);
  }
}
