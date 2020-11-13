import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DrawComponent } from 'src/app/utils/draws';
import { DataService } from 'src/app/data.service';
import { WindowSizeComponent } from 'src/app/utils/window-size';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  constructor(
      public titleService: Title,
      public meta: Meta,
      public data: DataService, 
      public draws: DrawComponent,
      public windowSize: WindowSizeComponent
    ) {}

    starCounter: number;
    showStar: boolean;
    course: Object;
    showByYearDescription: boolean;

    isNaN: Function = isNaN;

  ngOnInit() {
    this.titleService.setTitle('Planes de estudios y precios | American Language Academy');
    this.meta.updateTag({name: 'description', content: '¿Cómo inscribirte en los cursos de inglés de American Language Academy? Escoge la modalidad y consigue tus objetivos ¡Prueba de nivel y matrícula gratis! 🆓'});
    this.draws.getNumberCounter(this.draws.low_probability);
    this.showStar = this.draws.showStar;

    let course_id = sessionStorage.getItem("course");
		if(sessionStorage.getItem("course")){
      this.data.getCourse(course_id).subscribe(course => {
        this.course = course;
      })
    }
  }

  changeShowByYearStatus() {
    this.showByYearDescription = !this.showByYearDescription;
  }
}
