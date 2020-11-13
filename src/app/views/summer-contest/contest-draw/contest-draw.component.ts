import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-contest-draw',
  templateUrl: './contest-draw.component.html',
  styleUrls: ['./contest-draw.component.scss']
})
export class ContestDrawComponent implements OnInit {

  constructor(public data: DataService) { }

  winnersExcluded: any[] = [];
  rawWinners: any;
  participantsDraw: string[] = [];
  participationsList: Object[] = [];
  winner: string;

  ngOnInit() {
    this.getSummerContestPlayers();
  }

  getSummerContestPlayers() {
    this.data.getSummer2020ContestPlayers().subscribe(
        res => {
            let sortedPlayers = this.sortPlayersByScore(res);
            // Se quitan de la lista de participantes del sorteo random a los 10 ganadores (para que no puedan ganar el concurso y el concurso random también)
            this.winnersExcluded = sortedPlayers.slice(12, sortedPlayers.length - 1);

            // Añade las participaciones de los jugadores
            this.getParticipationsList(this.winnersExcluded);
        }
    );
  }

  sortPlayersByScore(arrayOfPlayers): Array<any> {
    return [].sort.call(arrayOfPlayers, (a, b) => {
        if (a['Puntos'] < b['Puntos']) {
            return 1;
        } else if (a['Puntos'] > b['Puntos']) {
            return -1;
        } else {
            return 0;
        }
    });
  }

  getParticipationsList(arrayOfPlayers): Array<any> {
      // Por cada 10 soles encontrados se añade una participación para ganar en el sorteo random
      return [].forEach.call(arrayOfPlayers, winner => {
          for(let i = 0; i <= winner['Puntos']; i+=10){
              let participation = {
                  email: winner['email'],
                  Telefono: winner['Telefono']
              }
              this.participationsList.push(participation);
          }
    });
  }

  getSummer2020ContestWinner() {
    const randomNum = Math.floor(Math.random() * this.participationsList.length);
    let winner = {
        Nombre: "",
        email: this.participationsList[randomNum]['email'],
        Telefono: this.participationsList[randomNum]['Telefono'],
    }

    console.log("winner...", winner)

    this.data.findUserSummer2020Contest(winner).subscribe(
        res => {
            this.winner = res[0]['Nombre'];
            this.participationsList = this.participationsList.filter(participation => participation['email'] != winner['email']);
            console.log("participations", this.participationsList)
        },
        err => console.error(err)
    );
  }

}
