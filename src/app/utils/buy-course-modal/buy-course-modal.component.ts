declare var Stripe: any;

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from '../modal';
import { ScrollComponent } from '../scroll';
import { environment } from 'src/environments/environment';
import { WindowSizeComponent } from '../window-size';

@Component({
    selector: 'app-buy-course-modal',
    templateUrl: './buy-course-modal.component.html',
    styleUrls: ['./buy-course-modal.component.scss']
})
export class BuyCourseModalComponent implements OnInit {

    // stripe = Stripe(environment.stripe_pk);
    stripe = Stripe(environment.stripe_test_pk);

    style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
    };

    elements = this.stripe.elements();
    card = this.elements.create('card', {style: this.style});

    toast = {
        type: 'success',
        message: 'Has comprado el curso con éxito'
    };

    stripeInfo = {
        stripeEmail: "",
        stripeToken: "",
        stripeAmount: 0,
        stripeDescription: ""
    }

    userCourseInfo = {
        courseName: "",
        schedule: "",
        timetable: "",
        start_week: "",
        num_weeks: 1,
        schedule_value: 1,
        course_price: 0
    }

    termsAndConditions: boolean;
    validForm: boolean;

    user: any = {
        name: "",
        lastname: "",
        address: "",
        email: "",
        house: "",
        city: "",
        country: "",
        state: "",
        CP: "", // Código Postal
        dni: "",
        phoneNumber: "",
        levelTest: "",
        acceptedTermsAndCond: true
        // acceptedTermsAndCond: false
    }

    inputsColor: any = {
        name: "",
        lastname: "",
        address: "",
        email: "",
        house: "",
        city: "",
        country: "",
        state: "",
        CP: "", // Código Postal
        dni: "",
        phoneNumber: "",
        levelTest: "",
        acceptedTermsAndCond: "",
        schedule: "",
        timetable: "",
        num_weeks: "",
        start_week: ""
    }

    currentCourse: any = {
        Title: "",
        "Precio Modulo": 0,
        schedules: [],
        timetables: []
    }

    countries: any[] = [
        {id: "Af", name: "Afganistán"},
        {id: "Al", name: "Alemania"},
        {id: "Au", name: "Australia"},
        {id: "Ar", name: "Argentina"},
        {id: "Ch", name: "Chile"},
        {id: "Chi", name: "China"},
        {id: "Es", name: "España"},
        {id: "Us", name: "Estados Unidos"},
        {id: "Fr", name: "Francia"},
        {id: "Gr", name: "Grecia"},
        {id: "In", name: "Inglaterra"},
        {id: "It", name: "Italia"},
        {id: "Me", name: "México"}
    ];

    optionsPosition: number = 0;

    weekDates = [];

    constructor(
        public data: DataService,
        public modal: ModalComponent,
        public scroll: ScrollComponent,
        public window_util: WindowSizeComponent
    ) { }

    ngOnInit() {
        // this.getCurrentCourse();
        this.initStripeConfig();
        this.getNextWeeks();
    }

    validateInput(value) {
        if (value != "dni") {
            if (this.user[value] != "") {
                this.inputsColor[value] = "green-input";
            } else {
                this.inputsColor[value] = "red-input";
            }
        } else {
            if(this.validateDNI()) {
                this.inputsColor[value] = "green-input";
            } else {
                this.inputsColor[value] = "red-input";
            }
        }
    }

    getCurrentCourse() {
        const id = sessionStorage.getItem("course");
        this.data.getCourse(id).subscribe(
            res => {
                this.currentCourse = res;
                this.currentCourse.schedules = res['courseschedule']['schedules'];
                var schedule_keys = Object.keys(res['courseschedule']['schedules']);
                var json_list = [];
                schedule_keys.forEach(schedule => {
                    json_list.push({"schedule_name": schedule, "schedule_value": res['courseschedule']['schedules'][schedule]})
                });
                this.currentCourse.schedules = json_list;
                this.currentCourse.timetables = Object.values(res['coursetimetable']['Horarios'])
                this.userCourseInfo.courseName = this.currentCourse['Title'];
            },
            err => console.error(err)
        );
    }

    openBuyCourseModal() {
        this.scroll.disable();
        this.getCurrentCourse();
        var modalHidden = document.getElementById("hiddenModal");
        modalHidden.style.display = "initial";
        const sliderOptions = document.getElementById('form-div');
        
        if (this.window_util.isDesktop) {
            sliderOptions.scrollLeft = 0;
        } else {
            sliderOptions.scrollLeft = 0;
        }
        const modal = document.getElementsByClassName('modal')[0];
        modal.scrollTo(0,0);
    }

    closeBuyCourseModal() {
        var modalHidden = document.getElementById("hiddenModal");
		modalHidden.style.display = "none";
		this.scroll.enable();
    }

    initStripeConfig() {
        this.card.mount('#card-element');

        // Handle real-time validation errors from the card Element.
        this.card.on('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
                console.error(event.error.message);
            } else {
                displayError.textContent = '';
            }
        });
    }

    getToken() {
        this.stripe.createToken(this.card).then(
            function(result) {
                if (result.error) {
                    // Inform the user if there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server.
                    console.log('Token acquired!');
                    window.localStorage.setItem('stripe-token', result.token.id);
                    document.getElementById('payButton').style.display = 'initial';
                }
            }
        );
    }

    pay() {
        const stripeToken = window.localStorage.getItem('stripe-token');
        // window.localStorage.removeItem('stripe-token');
        // document.getElementById('payButton').style.display = 'initial';

        this.stripeInfo.stripeEmail = this.user['email'];
        this.stripeInfo.stripeToken = stripeToken;
        this.stripeInfo.stripeAmount = this.currentCourse['Precio Modulo'] * this.userCourseInfo.num_weeks * this.userCourseInfo.schedule_value;
        this.stripeInfo.stripeDescription = "Curso comprado " + this.currentCourse['Title'];

        this.data.sendCheckoutData(this.stripeInfo).subscribe(
            res => {
                this.modal.newToast(this.toast); // Envía la confirmación al usuario
                this.userCourseInfo.course_price = this.currentCourse['Precio Modulo'] * this.userCourseInfo.num_weeks * this.userCourseInfo.schedule_value;
                // Aquí se enviaría el email de compra de un curso a ala@americanlangauge.es
                this.data.sendBoughtCourseAdmin({"user": this.user, "courseData": this.userCourseInfo}).subscribe(
                    res => {},
                    err => {
                        if (err.status != 200) {
                            console.error(err);
                        }
                    }
                );
                this.closeBuyCourseModal();
                window.localStorage.removeItem('stripe-token');
                document.getElementById('payButton').style.display = 'none';
            }, 
            err => {
                if (err.status != 200) {
                    this.toast.type = 'error';
                    this.toast.message = 'Algo no ha ido bien';
                } else {
                    this.closeBuyCourseModal();
                    window.localStorage.removeItem('stripe-token');
                    document.getElementById('payButton').style.display = 'none';

                    this.userCourseInfo.course_price = this.currentCourse['Precio Modulo'] * this.userCourseInfo.num_weeks * this.userCourseInfo.schedule_value;
                    // Aquí se enviaría el email de compra de un curso a ala@americanlangauge.es
                    this.data.sendBoughtCourseAdmin({"user": this.user, "courseData": this.userCourseInfo}).subscribe(
                        res => {},
                        err => {
                            if (err.status != 200) {
                                console.error(err);
                            }
                        }
                    );
                }

                this.modal.newToast(this.toast);
            }
        );
    }

    showTermsAndConditions() {
        this.termsAndConditions = !this.termsAndConditions;
    }

    validateDNI() {
        // Primero se valida si el string que se pasa por el formulario tiene la expresión de un DNI (8 números y una letra)
        if (!(/^\d{8}[a-zA-Z]$/.test(this.user['dni']))){
            return false;
        }

        //Se separan los números de la letra
        var letraDNI = this.user['dni'].substring(8, 9).toUpperCase();
        var numDNI = parseInt(this.user['dni'].substring(0, 8));

        //Se calcula la letra correspondiente al número
        var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
        var letraCorrecta = letras[numDNI % 23];

        if (letraDNI != letraCorrecta){ // Si la letra que ha escrito es incorrecta devuelve false
            return false;
        }
        return true;
    }

    validateFormData() {
        for (let property in this.user) {
            if (property == "dni") {
                const validDNI = this.validateDNI();
                if (!validDNI) {
                    return false;
                }
            }
            else {
                if (this.user[property] == "") {
                    return false;
                }
            }
        }
        return true;
    }
    
    modalAction() {
        this.validateFormData();
        if (!this.validateFormData()) {
            this.validForm = false;

            // Shows error message
            const toasts = {
                type: 'error',
                message: 'Comprueba los datos de nuevo'
            };
            this.modal.newToast(toasts);
        } else {
            this.validForm = true;
            this.getToken();
        }
    }

    moveSlider(str: string) {
        if (str === 'next') {
            this.optionsPosition = 1;
        } else {
            this.optionsPosition = 0;
        }

        const sliderOptions = document.getElementById('form-div');
        const cardWidth = document.querySelector('.scrollable-option').clientWidth;
        if (this.window_util.isDesktop) {
            sliderOptions.scrollLeft = this.optionsPosition*cardWidth;
        } else {
            sliderOptions.scrollLeft = this.optionsPosition*this.window_util.windowSize;
        }
        const modal = document.getElementsByClassName('modal')[0];
        modal.scrollTo(0,0);
    }

    getNextWeeks() {
        var nextMonday = new Date();
        nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
        this.weekDates.push("Semana del " + nextMonday.getDate() + " de " + nextMonday.toLocaleString('default', { month: 'long' }));
        for (var i = 1; i < 5; i++) { // Añade los tres siguientes inicios de semana
            var nextWeek = new Date();
            nextWeek.setDate(nextMonday.getDate() + 7*i);
            this.weekDates.push("Semana del " + nextWeek.getDate() + " de " + nextWeek.toLocaleString('default', { month: 'long' }));
        }
    }

    set_schedule_value() {
        this.userCourseInfo.schedule_value = this.currentCourse['schedules'][this.userCourseInfo.schedule];
        this.currentCourse['schedules'].forEach(schedule => {
            if (schedule['schedule_name'] == [this.userCourseInfo.schedule]) {
                this.userCourseInfo.schedule_value = schedule['schedule_value'];
                return true;
            }
        });
        return false;
    }

}
