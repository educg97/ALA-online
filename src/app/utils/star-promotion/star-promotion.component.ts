import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { DrawComponent } from 'src/app/utils/draws';

@Component({
  selector: 'app-star-promotion',
  templateUrl: './star-promotion.component.html',
  styleUrls: ['./star-promotion.component.scss']
})
export class StarPromotionComponent implements OnInit {

  @Output() count = new EventEmitter();

  constructor(
    public data: DataService,
    public scroll: ScrollComponent,
    public modal: ModalComponent,
    public draws: DrawComponent
  ) { }

  starCounter: number;
  drawId: string;
  premiados: Object;
  hideStar: boolean = false;

  userData = {
    Nombre: "",
    email: "",
    Puntos: 1,
    Telefono: "",
    Colaborador: ""
  };

  introductionFirst: boolean = true;
  introductionSecond: boolean;
  introductionThird: boolean;

  backlinksOption: boolean;
  urlsOption: boolean;
  googleSearchOption: boolean;

  googleSearchs = [
    {searchTerm: "Inglés para colegios", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?q=ingl%C3%A9s+para+colegios&oq=ingl%C3%A9s+para+colegios&aqs=chrome..69i57j69i59j0l5j69i60.6061j0j7&sourceid=chrome&ie=UTF-8"},
    {searchTerm: "Inglés para empresas", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk03DTfo3QlO6Z9NZGFVZZrRnUlO8sg%3A1594198441884&ei=qYkFX83INZLJgweEu6ToDg&q=ingl%C3%A9s+para+empresas&oq=ingl%C3%A9s+para+empresas&gs_lcp=CgZwc3ktYWIQAzICCAAyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB46BAgAEEdQ7aYBWJezAWD_uQFoAHACeACAAWiIAcsFkgEDNy4xmAEAoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwiNwdH-o73qAhWS5OAKHYQdCe0Q4dUDCAw&uact=5"},
    {searchTerm: "Curso de inglés en Madrid", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk031kHLPlM1NgeEjBMU2o6Z8XXvTLw%3A1594198466966&ei=wokFX5DCOpLmU4eJk_gO&q=Curso+de+ingl%C3%A9s+en+Madrid&oq=Curso+de+ingl%C3%A9s+en+Madrid&gs_lcp=CgZwc3ktYWIQAzICCAAyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yCAgAEBYQChAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjoECAAQR1CEfliEfmCthQFoAHABeACAAVyIAVySAQExmAEAoAECoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwiQq8yKpL3qAhUS8xQKHYfEBO8Q4dUDCAw&uact=5"},
    {searchTerm: "Academia inglés Madrid", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk01exw9YpNw-h01ohjA7tOq6GA-RxA%3A1594198485529&ei=1YkFX4_rH4G5gwfQ45noDg&q=Academia+ingl%C3%A9s+Madrid&oq=Academia+ingl%C3%A9s+Madrid&gs_lcp=CgZwc3ktYWIQAzICCAAyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB5Q7bQBWO20AWDBuwFoAHAAeACAAXGIAXGSAQMwLjGYAQCgAQKgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwjPqbmTpL3qAhWB3OAKHdBxBu0Q4dUDCAw&uact=5"},
    {searchTerm: "Curso inglés Madrid", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?q=Curso+ingl%C3%A9s+Madrid&oq=Curso+ingl%C3%A9s+Madrid&aqs=chrome..69i57j0l4j69i60l3.340j0j9&sourceid=chrome&ie=UTF-8"},
    {searchTerm: "Academia de inglés en Madrid", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?q=Academia+de+ingl%C3%A9s+en+Madrid&oq=Academia+de+ingl%C3%A9s+en+Madrid&aqs=chrome..69i57j0l4j69i61j69i60j69i61.839j0j9&sourceid=chrome&ie=UTF-8"},
    {searchTerm: "Mejores academias de inglés en Madrid", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk014cjNqzXhMqciNRjWQmC9aA82FmQ%3A1594198570743&ei=KooFX-bsLKKTjLsPl9OI2A4&q=Mejores+academias+de+ingl%C3%A9s+en+Madrid&oq=Mejores+academias+de+ingl%C3%A9s+en+Madrid&gs_lcp=CgZwc3ktYWIQAzICCAAyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB46BAgAEEc6BwgjEOoCECdQ7ocBWOeKAWCgjQFoAXABeACAAWOIAWOSAQExmAEAoAEBoAECqgEHZ3dzLXdperABCg&sclient=psy-ab&ved=0ahUKEwjmqYq8pL3qAhWiCWMBHZcpAusQ4dUDCAw&uact=5"},
    {searchTerm: "Academias de inglés", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk00JSBD7eacH_nUuZFBJLk6hdmCdLA%3A1594198590143&ei=PooFX_GgCI2jUIWynMgO&q=Academias+de+ingl%C3%A9s&oq=Academias+de+ingl%C3%A9s&gs_lcp=CgZwc3ktYWIQAzIECAAQQzICCAAyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIAFCnZFinZGD8aGgAcAB4AIABX4gBX5IBATGYAQCgAQKgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwjxt6rFpL3qAhWNERQKHQUZB-kQ4dUDCAw&uact=5"},
    {searchTerm: "Curso inglés intensivo online", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk02-uIfK3psET2PgNkUvaAjGl5MIuw%3A1594198604899&ei=TIoFX7S3NsmHjLsPzZqmiA8&q=Curso+ingl%C3%A9s+intensivo+online&oq=Curso+ingl%C3%A9s+intensivo+online&gs_lcp=CgZwc3ktYWIQAzICCAAyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB5QkG9YkG9gm3VoAHAAeACAAXiIAXiSAQMwLjGYAQCgAQKgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwi0ja_MpL3qAhXJA2MBHU2NCfEQ4dUDCAw&uact=5"},
    {searchTerm: "American Language Online", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk01UOyxeUjG58jO0cEtOuWfvnIscpg%3A1594198621158&ei=XYoFX_WiCfOHjLsPm5q0qA8&q=American+Language+Online&oq=American+Language+Online&gs_lcp=CgZwc3ktYWIQAzIFCAAQywEyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB5Q_P4BWPz-AWCFgQJoAHAAeACAAWGIAWGSAQExmAEAoAECoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwi1xY_UpL3qAhXzA2MBHRsNDfUQ4dUDCAw&uact=5"},
    {searchTerm: "Cursos Intensivos de Inglés", domain: "www.americanlanguage.online", searchUrl: "https://www.google.com/search?sxsrf=ALeKk01vi1FxSxZ2Y64Ml7_rInHdS3phow%3A1594198655105&ei=f4oFX6n3BYrMgwfUg7LwDg&q=Cursos+Intensivos+de+Ingl%C3%A9s&oq=Cursos+Intensivos+de+Ingl%C3%A9s&gs_lcp=CgZwc3ktYWIQAzICCAAyBwgAEBQQhwIyAggAMgcIABAUEIcCMgIIADICCAAyAggAMgIIADICCAAyAggAUOJ1WOJ1YL94aABwAHgAgAF-iAF-kgEDMC4xmAEAoAECoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwjpsqfkpL3qAhUK5uAKHdSBDO4Q4dUDCAw&uact=5"},
    {searchTerm: "Clases Inglés Empresas", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk01vK_rpjwc8oTqyf2xBU8y47fhHiA%3A1594198671778&ei=j4oFX8uRL8TjgweyyoTYDg&q=Clases+Ingl%C3%A9s+Empresas&oq=Clases+Ingl%C3%A9s+Empresas&gs_lcp=CgZwc3ktYWIQAzIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeUNR6WNR6YK19aABwAHgAgAGYAYgBmAGSAQMwLjGYAQCgAQKgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwiLlaHspL3qAhXE8eAKHTIlAesQ4dUDCAw&uact=5"},
    {searchTerm: "Curso Inglés Empresas", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk02P_k8WfAoTMRQEXRiNum0oHX7KiA%3A1594198689035&ei=oYoFX5rFAZ6fjLsPzPqqmA4&q=Curso+Ingl%C3%A9s+Empresas&oq=Curso+Ingl%C3%A9s+Empresas&gs_lcp=CgZwc3ktYWIQAzIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeUOKEAVjihAFg9ogBaABwAXgAgAFjiAFjkgEBMZgBAKABAqABAaoBB2d3cy13aXo&sclient=psy-ab&ved=0ahUKEwjamb70pL3qAhWeD2MBHUy9CuMQ4dUDCAw&uact=5"},
    {searchTerm: "Inglés en Colegios", domain: "www.americanlanguage.es", searchUrl: "https://www.google.com/search?sxsrf=ALeKk03MzkPRv6gIWGHLjVy9vWw_qX3exQ%3A1594198707834&ei=s4oFX_-rMsGHjLsP5quH2A4&q=Ingl%C3%A9s+en+Colegios&oq=Ingl%C3%A9s+en+Colegios&gs_lcp=CgZwc3ktYWIQAzIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeUNd_WNd_YKKGAWgAcAB4AIABXogBXpIBATGYAQCgAQKgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwi_0bn9pL3qAhXBA2MBHebVAesQ4dUDCAw&uact=5"}
  ];
  randomGoogleSearch = {
    searchTerm: "", 
    domain: "",
    searchUrl: ""
  }

  backlinks = [
    {link: "https://www.imdb.com/user/ur120074447/?ref_=nv_usr_prof_2", guideline1: "“nuestra página web”", guideline2: "en el primer párrafo"},
    {link: "https://americanlanguageonline.shutterfly.com/", guideline1: "“nuestra página web”", guideline2: "en el primer párrafo"},
    {link: "https://kpopselca.com/AmericanLangOnline", guideline1: "“nuestra página web”", guideline2: "en el primer párrafo"},
    {link: "https://www.tripadvisor.com/Profile/AmericanLangOnline", guideline1: "del lado izquierdo", guideline2: "en el cuadro de Intro"},
    {link: "http://www.globalvision2000.com/forum/member.php?action=profile&uid=78943", guideline1: "que se encuentra abajo", guideline2: "en la página bajo “American Language’s Contact Details”"},
    {link: "https://public.bookmax.net/users/americanlanguage/bookmarks", guideline1: "“Cursos de preparación TOEFL Madrid”", guideline2: "en la columna Title"},
    {link: "http://inglesmadrid.over-blog.com/2019/09/apps-para-aprender-vocabulario.html", guideline1: "“academia de inglés en Madrid”", guideline2: "en el segundo párrafo"},
    {link: "https://americanlanguageacademy.jimdofree.com/j%C3%B3venes/", guideline1: "“inglés para niños en Madrid”", guideline2: "en el penúltimo párrafo"}
  ];
  randomBacklink = {
    link: "", 
    guideline1: "",
    guideline2: ""
  }

  urls = [
    {link: "https://www.americanlanguage.online/curso-ingles-online/intensivo", button: "Curso de inglés online"},
    {link: "https://www.americanlanguage.online/curso-ingles-online/particulares", button: "Clases de inglés online"},
    {link: "https://www.americanlanguage.online/examen-ingles-online", button: "Exámen de inglés online"},
    {link: "https://www.americanlanguage.online/", button: "Aprender inglés online"}
  ]
  randomUrl = {link: "", button: ""};

  ngOnInit() {
    this.data.getDraws().subscribe(res => {
      this.starCounter = res[0]['Counter'];
      this.drawId = res[0]['id'];
      this.premiados = res[0]['Premiados'];
      this.count.emit(this.starCounter);
    });
    this.textOption(); // Determina que frase va a poner en la última vista del formulario
  }

  ngAfterViewInit() {
    this.count.emit(this.starCounter);
  }

  openStarModal() {
    this.modal.openModal('sorteo-estrellas');
    this.scroll.disable();
  }

  catchStar() {
    this.data.findUserSummer2020Contest(this.userData).subscribe(
      res => {
        this.introductionFirst = false;
        if (res[0]) {
          // SI EL PARTICIPANTE YA ESTABA REGISTRADO ...
          this.userData.Puntos = res[0].Puntos + 1; // Le añade el Sol que acaba de encontrar
          this.userData.Nombre = res[0].Nombre;

          // Actualiza la puntuación del usuario
          this.data.updateUserSummer2020Contest(res[0]._id, this.userData).subscribe(
            res => {
              // Envía el email al usuario con la nueva puntuación
              // this.sendContest2020Email();
            },
            err => console.error(err) // Si hay algún error al actualizar la puntuación lo imprime por consola
          )
          
          this.introductionThird = true;
        } else {
          // SI ES UN NUEVO PARTICIPANTE ...
          this.introductionSecond = true;
        }
      },
      err => console.error(err)
    );
  }

  back() {
    this.introductionSecond = false;
    this.introductionFirst = true;
  }

  addUserToSummerContest() {
    this.introductionSecond = false;
    this.data.registerParticipantSummer2020Contest(this.userData).subscribe(
      res => {
        // Envía el email al usuario con la nueva puntuación
        this.sendContest2020Email();
      },
      err => console.error(err)
    );
    this.introductionThird = true;
  }

  sendContest2020Email() {
    this.data.sendEmailSummer2020Contest(this.userData).subscribe(
      res => {},
      err => {
        let toasts = {
          type: 'success',
          message: 'Estrella atrapada con éxito'
        };
        // Los emails siempre devuelven err (no se por qué). Si el estatus es 200 es que lo ha enviado bien
        if (err.status != 200) { 
            console.error("Error al mandar el correo: ", err);
            toasts.type = 'error';
            toasts.message = "Algo ha sucedido. Email no enviado";
        }
        this.modal.newToast(toasts);
      }
    )
  }

  textOption() {
    const randomNum = Math.random();
    let randomOption = 0;

    if (randomNum <= 0.33) {
      this.googleSearchOption = true;
      randomOption = Math.floor(Math.random() * (this.googleSearchs.length));
      this.randomGoogleSearch = this.googleSearchs[randomOption];
    } 
    else if(randomNum > 0.33 && randomNum <= 0.66){
      this.backlinksOption = true;
      randomOption = Math.floor(Math.random() * (this.backlinks.length));
      this.randomBacklink = this.backlinks[randomOption];
    } 
    else {
      this.urlsOption = true;
      randomOption = Math.floor(Math.random() * (this.urls.length));
      this.randomUrl = this.urls[randomOption];
    }
  }

  closeStarsModal() {
    this.modal.closeModal();
    this.scroll.enable();
  }

  hideStarIcon() {
    this.hideStar = true;
  }
}
