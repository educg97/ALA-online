import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Converter } from 'showdown';
import { environment } from 'src/environments/environment';
import { Config } from 'src/app/utils/config';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		public http: HttpClient,
		public config: Config
	) { }
		
	api: string = environment.apiURL;
	// api: string = 'http://18.200.76.225/';
	converter: Converter = new Converter;
	headers: Object = {
		headers: new HttpHeaders().set('Content-Type', 'application/json')
	}

	getApi() {
		// Returns the api URL
		return this.api;
	}

	getCourses() {
		// Gets all the courses ordered by accesses
		return this.http.get(this.api + '/courses?_sort=Accesos:DESC');
	}

	getCourse(id) {
		// Gets one course given an ID
		return this.http.get(this.api + '/courses/' + id);
	}

	getOpinions() {
		// Gets all the opinions of all the courses
		return this.http.get(this.api + '/opinions?_limit=10000000');
	}

	getOpinionsByCourse(mastercourse_id) {
		return this.http.get(this.api + '/opinions?mastercourse=' + mastercourse_id);
	}

	getMarkdown(markdown: string) {
		// Transforms a markdown into HTML
		return this.converter.makeHtml(markdown);
	}

	getMasterCourses() {
		// Gets all the mastercourses
		return this.http.get(this.api + '/mastercourses');
	}

	getSingleEvent(id) {
		return this.http.get(`${this.api}/events/${id}`, this.headers);
	}

	updateAlumnosInscritos(eventId, update) {
		return this.http.put(environment.localAPI + '/events/' + eventId, {
			alumnos: update
		}, this.headers);
	}
	getMasterCourse(id) {
		// Gets one mastercourse given an ID
		return this.http.get(this.api + '/mastercourses/' + id);
	}

	getMasterCourseByUrl(url) {
		// Gets a mastercourse based on its URL
		return this.http.get(this.api + '/mastercourses', { params: { 'URL': url } });
	}

	getCourseImage(id) {
		// TODO gets all images from a course
		return this.http.get(this.api + '/courses', { params: { '_id': id } });
	}

	setCourseStatistics(id, statistics) {
		// Sets the course statistics
		return this.http.put(environment.localAPI + '/metadata/' + id, statistics)
	}

	login() {
		return this.http.get(environment.localAPI + '/login/api');
	}

	getEvents() {
		return this.http.get(this.api + '/events?_limit=10000000', this.headers);
	}

	// Delete
	validateCaptcha(token) {
		return this.http.post(environment.localAPI + '/captcha/verify', { token: token }, this.headers);
	}

	loginAulaUser(user) {
		return this.http.post('https://curso-ingles.americanlanguage.es/aula/main/ala/backend/slim-ala-aula/public/api/v1/index.php/login/web/', {
			//body
			username: user.username,
			password: user.password
		}, this.headers); 
	}

	logoutAulaUser() {
		localStorage.removeItem('aulaUser');
	}

	getCompanies() {
		return this.http.get(this.api + '/companies', {
			headers: new HttpHeaders()
				.set('Content-Type', 'application/json')
		});
	}

	getAppointments() {
		return this.http.get(this.api + '/citas?_limit=10000000', this.headers);
	}

	newAppointment(appointment: object) {
		return this.http.post(this.api + '/citas', {
			// body
			Nombre: appointment['Nombre'],
			Apellidos: appointment['Apellidos'],
			Fecha: appointment['Fecha'],
			Mensaje: appointment['Mensaje'],
			Hora: appointment['Hora_cita'],
			Telefono: appointment['Telefono'],
			Curso: location.href.split('/').pop()
		}, this.headers);
	}

	getConfig() {
		return this.http.get(this.api + '/configs', this.headers);
	}

	// Mail
	sendEmail(mailData: Object) {
		return this.http.post(environment.localAPI + '/mail/send', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendEmailAppointment(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/appointment', {data: mailData, hooman: this.config.hooman}, this.headers);
	}
	
	sendEmailCompany(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/company', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendEmailDraw(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/draw', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendMailComment(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/comment', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendMailTutoria(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/tutoria', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendMailHorse(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/horse-game', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendMailFlag(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/usa-flag-game', {data: mailData, hooman: this.config.hooman}, this.headers);
	}
	
	sendMailMultimedia(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/book-multimedia', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendEmailActivityInscription(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/inscribed-activity', {data: mailData, hooman: this.config.hooman}, this.headers);
	}
	
	sendEmailActivityUnsusbscription(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/unsubscribe-activity', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendEmailSummer2020Contest(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/sorteo2020', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	sendBoughtCourseAdmin(mailData: Object){
		return this.http.post(environment.localAPI + '/mail/buyCourse', {data: mailData, hooman: this.config.hooman}, this.headers);
	}
	// End Mail

	getTests(level: string) {
		return this.http.get(this.api + '/tests?Nivel=' + level, this.headers);
	}

	getBlogEntries() {
		return this.http.get(this.api + '/blogs?_sort=FechaDePublicacion:DESC&_limit=100000000', this.headers);
	}

	getSinglePost(id: string) {
		return this.http.get(this.api + '/blogs/' + id, this.headers);
	}

	getPostsByPag(start: number) {
		return this.http.get(this.api + '/blogs?_sort=FechaDePublicacion:DESC&_start=' + start + '&_limit=10', this.headers);
	}

	newComment(comment: Object){
		return this.http.post(this.api + '/comments', {
			// body
			Autor: comment['author'],
			Texto: comment['comment'],
			Blog: comment['post']
		}, this.headers);
	}

	getCoursesDates(){
		return this.http.get(this.api + '/dates', this.headers);
	}

	getDraws(){
		return this.http.get(this.api + '/sorteos');
	}

	updateDraw(drawId: string, updatedData: Object){
		const fullPremiados = {
			...updatedData['premiados'],
			hooman: this.config.hooman
		}
		return this.http.put(environment.localAPI + '/sorteos/' + drawId,  {
			premiados: fullPremiados,
			counter: updatedData['counter']
		}, this.headers);
	}

	updateDrawStrapi(drawId: string, updatedData: Object) {
		const fullPremiados = {
			...updatedData['premiados'],
			hooman: this.config.hooman
		}
		return this.http.put(this.api + '/sorteos/' + drawId,  {
			Premiados: fullPremiados,
			Counter: updatedData['counter']
		}, this.headers);
	}

	getUserData(){
		return this.http.get(environment.localAPI + '/get-user-data', this.headers);
	}

	newNotFoundError(error: Object){
		return this.http.post(this.api + '/notfoundpages', { url: error }, this.headers);
	}

	getErrors(){
		return this.http.get(this.api + '/notfoundpages?_limit=100000000');
	}

	getFunFacts(){
		return this.http.get(this.api + '/funfacts');
	}

	getSchedules(){
		return this.http.get(this.api + '/schedules');
	}

	// Blocking specific times for the level test appointment
	editLevelTestDaySchedule(data){
		return this.http.post(this.api + '/customappointments', data, this.headers);
	}

	updateLevelTestDaySchedule(data){
		return this.http.put(this.api + '/customappointments', data, this.headers);
	}

	getCustomSchedules(){
		return this.http.get(this.api + '/customappointments');
	}

	// Horse contest
	createPlayer(player: Object){
		return this.http.post(this.api + '/horses', player, this.headers);
	}

	getPlayers(){
		return this.http.get(this.api + '/horses?_limit=100000000', this.headers);
	}

	updatePlayer(id, player){
		return this.http.put(this.api + '/horses/' + id, player, this.headers);
	}

	getHorsesByMail(mail) {
		// Gets a player based on its mail
		return this.http.get(this.api + '/horses', { params: { 'Email': mail } });
	}
	// Game contest
	sendShirtVoucher(mailData: Object) {
		return this.http.post(environment.localAPI + '/mail/game-letter', {data: mailData, hooman: this.config.hooman}, this.headers);
	}

	getQuestions(){
		return this.http.get(this.api + '/questions?_limit=100000000', this.headers);
	}

	// Teachers for sliders
	getTeachers() {
		return this.http.get(this.api + '/teachers?_limit=100000000', this.headers);
	}

	// Companies balls
	getCompanyBalls() {
		return this.http.get(this.api + '/empresas?_limit=100000000', this.headers);
	}

	// Universities testimonials
	getUniversities() {
		return this.http.get(this.api + '/universities?_limit=100000000', this.headers);
	}

	// Asociations testimonials
	getAsociations() {
		return this.http.get(this.api + '/asociations?_limit=100000000', this.headers);
	}

	// English Contest
	getEnglishQuestions() {
		return this.http.get(this.api + '/engquestions?_limit=100000000', this.headers);
	}

	getFlagPlayers(){
		return this.http.get(this.api + '/flagplayers?_limit=100000000', this.headers);
	}

	getFlagPlayersByMail(mail: string) {
		return this.http.get(this.api + '/flagplayers', { params: { 'Email': mail } });
	}

	createFlagPlayer(player: Object){
		return this.http.post(this.api + '/flagplayers', player, this.headers);
	}

	updateFlagPlayer(id, player){
		return this.http.put(this.api + '/flagplayers/' + id, player, this.headers);
	}

	// Spanish Contest
	getSpanishQuestions() {
		return this.http.get(this.api + '/espquestions?_limit=100000000', this.headers);
	}

	getEspFlagPlayers(){
		return this.http.get(this.api + '/espplayers?_limit=100000000', this.headers);
	}

	getEspFlagPlayersByMail(mail: string) {
		return this.http.get(this.api + '/espplayers', { params: { 'Email': mail } });
	}

	createEspFlagPlayer(player: Object){
		return this.http.post(this.api + '/espplayers', player, this.headers);
	}

	updateEspFlagPlayer(id, player){
		return this.http.put(this.api + '/espplayers/' + id, player, this.headers);
	}

	registerFreeCourseUser(user){
		this.searchFreeCourseUser(user).subscribe(
			res => {
				if (res[0]) {
					console.log("User exists");
				} else {
					console.log("User doesn't exist");
					this.http.post(this.api + '/freecourseusers', user, this.headers).subscribe(
						res => {
							console.log("Nuevo usuario registrado", res);
						}, 
						err => {
							console.error("Error en el POST del usuario:" + err);
						}
					);
				}
			}
		);
	}

	getSummer2020ContestPlayers() {
		return this.http.get(this.api + '/summer2020s?_limit=100000000', this.headers);
	}

	findUserSummer2020Contest(user: Object) {
		return this.http.get(this.api + '/summer2020s', { params: { 'email': user['email'], 'Telefono': user['Telefono'],  } });
	}

	updateUserSummer2020Contest(user_id, user) {
		return this.http.put(this.api + '/summer2020s/' + user_id, {Puntos: user.Puntos}, this.headers);
	}

	registerParticipantSummer2020Contest(user) {
		return this.http.post(this.api + '/summer2020s', user, this.headers);
	}

	sendCheckoutData(data) {
		return this.http.post(environment.localAPI + '/checkout', data, this.headers);
	}

	searchFreeCourseUser(user: Object) {
		return this.http.get(this.api + '/freecourseusers', { params: { 'Name': user['Name'], 'Email': user['Email'] } });
	}

	searchSeleccionPersonal(username: string) {
		return this.http.get(this.api + '/selecciondepersonals', { params: { 'NombreCompleto': username} });
	}

	setSeleccionPersonalDate(username: string) {
		this.searchSeleccionPersonal(username).subscribe(
			res => {
				if (res[0] && res[0].FechaEntrada == undefined) {
					let newDate = new Date();
					newDate.setHours(newDate.getHours() - (newDate.getTimezoneOffset() / 60)); // Para la diferencia horaria

					this.http.put(this.api + '/selecciondepersonals/' + res[0]._id, {FechaEntrada: newDate.toISOString()}, this.headers).subscribe(
						res => console.log("Fecha establecida: ", newDate.toISOString()),
						err => console.error(err)
					)
				} else {
					console.log("User doesn't exist or has a date setted");
				}
			},
			err => console.error(err)
		);
	}

	searchLevelTestUser(email: string) {
		return this.http.get(this.api + '/leveltests', { params: { 'email': email} });
	}

	setLevelTestScore(levelTest: Object) {
		return this.http.put(this.api + '/leveltests/' + levelTest['user_id'], {level: levelTest['level'], 'lt-date': levelTest['level_date'], score: levelTest['score']}, this.headers);
	}

	getLevelTestList(company: string) {
		return this.http.get(this.api + '/leveltests', { params: { 'company': company} });
	}

	formatLevel(level: string) {
		if ((level == '0-0') || (level == '0-FB') || (level == 'FB') || (level == 'FB-1,2') || (level == '1,2') || (level == '1,2-1,2') || (level == '1,2-1,3') || (level == '1,3') || (level == '1,3-1,3')) {
			return 'A1';
		} else if ((level == '1,3-2,1') || (level == '2,2-2,2') || (level == '2,1') || (level == '2,1-2,2') || (level == '2,2') || (level == '2,2-2,2') || (level == '2,2-2,3') || (level == '2,3') || (level == '2,3-2,3')) {
			return 'A2';
		} else if ((level == '2,3-3,1') || (level == '3,3-3,3') || (level == '3,1') || (level == '3,1-3,2') || (level == '3,2') || (level == '3,2-3,2') || (level == '3,2-3,3') || (level == '3,3') || (level == '3,3-3,3')) {
			return 'B1';
		} else if ((level == '3,3-4,1') || (level == '4,4-4,4') || (level == '4,1') || (level == '4,1-4,2') || (level == '4,2') || (level == '4,2-4,2') || (level == '4,2-4,3') || (level == '4,3') || (level == '4,3-4,3')) {
			return 'B2';
		} else if ((level == '4,3-5,1') || (level == '5,5-5,5') || (level == '5,1') || (level == '5,1-5,2') || (level == '5,2') || (level == '5,2-5,2') || (level == '5,2-5,3') || (level == '5,3') || (level == '5,3-5,3')) {
			return 'C1';
		} else if ((level == '5,3-6,1') || (level == '6,6-6,6') || (level == '6,1') || (level == '6,1-6,2') || (level == '6,2') || (level == '6,2-6,2') || (level == '6,2-6,3') || (level == '6,3') || (level == '6,3-6,3')) {
			return 'C2';
		} else {
			return 'C1';
		}
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
	  
	  format(text: string) {
		return text.trim().split('\n').join('<br>');
	  }
}
