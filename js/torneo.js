
var TEAM_NAME = 'Team Emilia-Romagna';
var calcolaTeamsRun = false;
var calcolaClassificaRun = false;

var matchs = [];
var avversari = [];


function elabora() {
    //carico i nomi degli avversari delle partite non giocate
    //Non si riesce a caricare
    avversari['greek-arena-tournoua-ellados'] = {};
    avversari['greek-arena-tournoua-ellados'].url = 'https://api.chess.com/pub/club/greek-arena-tournoua-ellados';
    avversari['greek-arena-tournoua-ellados'].avatar = 'https://images.chesscomfiles.com/uploads/v1/group/129834.348c79a3.50x50o.252268e92379.jpeg';
    for (var i in matchs) {
        if (matchs[i].avversarioName) {
            if (! avversari[matchs[i].avversarioName]) {
                avversari[matchs[i].avversarioName] = {};
                avversari[matchs[i].avversarioName].url = 'https://api.chess.com/pub/club/' + matchs[i].avversarioName.replace(' ', '-');
                avversari[matchs[i].avversarioName].avatar = '';
            }
        }
    }
    avversari['Rot-Weiß-Hessen'] = {};
    avversari['Rot-Weiß-Hessen'].url = 'https://api.chess.com/pub/club/rot-weiss-hessen';
    avversari['Rot-Weiß-Hessen'].avatar = 'https://images.chesscomfiles.com/uploads/v1/group/267500.ef5cc6bf.50x50o.23741cc730c6.png';
    for (var i in matchs) {
        if (matchs[i].avversarioName) {
            if (! avversari[matchs[i].avversarioName]) {
                avversari[matchs[i].avversarioName] = {};
                avversari[matchs[i].avversarioName].url = 'https://api.chess.com/pub/club/' + matchs[i].avversarioName.replace(' ', '-');
                avversari[matchs[i].avversarioName].avatar = '';
            }
        }
    }
    avversari['gewest-zuid-nederland'] = {};
    avversari['gewest-zuid-nederland'].url = 'https://api.chess.com/pub/club/gewest-zuid-nederland';
    avversari['gewest-zuid-nederland'].avatar = 'https://images.chesscomfiles.com/uploads/v1/group/349123.dc1f4344.50x50o.8e9010b56e1c.jpeg';
    for (var i in matchs) {
        if (matchs[i].avversarioName) {
            if (! avversari[matchs[i].avversarioName]) {
                avversari[matchs[i].avversarioName] = {};
                avversari[matchs[i].avversarioName].url = 'https://api.chess.com/pub/club/' + matchs[i].avversarioName.replace(' ', '-');
                avversari[matchs[i].avversarioName].avatar = '';
            }
        }
    }



    //Carico i dati di tutti i match
    for (var i in matchs) {
        sleep(50);

        if ( matchs[i].id != '' && matchs[i].id != '0')
            caricaMatch(i, 'https://api.chess.com/pub/match/' + matchs[i].id);
    };
}

function caricaMatch(index, url)
{

    console.log('caricaMatch ' + index + ' - ' + url);

    console.log(giocatori);
    //Leggo i dati 
    $.getJSON(url,function(data){

        console.log('caricaMatch. Dati di ' + this.url);

        //Dati Teams
        var dataTeams;
        var dataAvversario;        
        if (data.teams.team1.name == TEAM_NAME) {
            dataTeams = data.teams.team1;
            dataAvversario = data.teams.team2;
        } else {
            dataTeams = data.teams.team2;
            dataAvversario = data.teams.team1;
        }

        //Salvo punteggi
        matchs[index].giocatori = dataTeams.players.length;
        matchs[index].score = dataTeams.score + ' - ' + dataAvversario.score;
        matchs[index].url = data.url;
        matchs[index].avversarioName = dataAvversario.name;
        //Calcolo risultato
        if (data.status == 'registration') {
            matchs[index].risultato = 'In partenza';
            matchs[index].risultatoStyle = 'color:black;font-weight:bold';
            matchs[index].giocatori += ' - ' + dataAvversario.players.length;
        }
        if (data.status == 'in_progress') {
            matchs[index].risultato = 'In corso';
            if (dataTeams.score > dataAvversario.score)
               matchs[index].risultatoStyle = 'color:green';
            if (dataTeams.score < dataAvversario.score)
               matchs[index].risultatoStyle = 'color:red';
            if (dataTeams.score == dataAvversario.score)
               matchs[index].risultatoStyle = 'color:blue';
            //matchs[index].risultatoStyle = 'color:black';
        }
        if (data.status == 'finished') {
            if (dataTeams.score > dataAvversario.score) {
                matchs[index].risultato = 'VINTO';
                matchs[index].risultatoStyle = 'color:green;font-weight:bold';
            }
            if (dataTeams.score < dataAvversario.score) {
                matchs[index].risultato = 'PERSO';
                matchs[index].risultatoStyle = 'color:red;font-weight:bold';
            }
            if (dataTeams.score == dataAvversario.score) {
                matchs[index].risultato = 'PAREGGIO';
                matchs[index].risultatoStyle = 'color:blue;font-weight:bold';
            }
        }

        //Salvo avversario per lettura avatar
        if (avversari.indexOf(dataAvversario.name) == -1) {
            avversari[dataAvversario.name] = {};
            var url;
            url = JSON.stringify(dataAvversario);
            url = url.substring(url.indexOf('@id":"')+6, url.length);
            url = url.substring(0, url.indexOf('"'));
            avversari[dataAvversario.name].url = url;
            avversari[dataAvversario.name].avatar = '';
        }

        //Assegni punti giocatori
        var username = '';
        var risultato = '';
        for (var i in dataTeams.players) {
            username = dataTeams.players[i].username;
            risultato = dataTeams.players[i].played_as_white;
            setPunti(username, risultato);
            risultato = dataTeams.players[i].played_as_black;
            setPunti(username, risultato);
        }

        //Se ho caricato tutti i dati calcolo la classifica
        matchs[index].daCaricare = false;
        for (var i in matchs) {
            if (matchs[i].daCaricare && matchs[i].id != '' && matchs[i].id != '0') {
                console.log('caricaMatch. Match da caricare: ' + i);
                return;
            }
        }
        
        //controllo di non aver già lanciato fase sucessiva
        if (calcolaTeamsRun)
            return;  
            calcolaTeamsRun = true;

        console.log('caricaMatch. Inizio getTeamAvversi');

        //Carico gli avatar degli avversari
            //Cerco l'avatar per tutti i giocatori
        for (var name in avversari) {
            sleep(5);
            //Cerco avatar
            if (! avversari[name].avatar) 
                getTeamAvatar(avversari[name].url);
        }    

    }).error(function(jqXhr, textStatus, error) {
        console.log('ERRORE in lettura dati ' + this.url);
        var index = 0;
        for (var i in matchs) {
            if ('https://api.chess.com/pub/match/' + matchs[i].id == this.url)
                index = i;
        };
        //è andato in errore ricarico i dati
        //Se responseJSON non è valorizzato solo se il record esiste    
        if (! jqXhr.responseJSON)
        {
            console.log('ERRORE ricarico dati: ' + this.url);
            caricaMatch(index, this.url);    
        } else {
                matchs[index].daCaricare = false;
                console.log('ERRORE Match non valida. ' + index);
                console.log('ERRORE Match non valida. ' + index);
                console.log('ERRORE Match non valida. ' + this.url);
                console.log('ERRORE Match non valida. ' + this.url);
            }
              
        });
};

function getTeamAvatar(url)
{
    //Eseguo funzione per ricercare un avatar
    $.getJSON(url,function(data){
            avversari[data.name].avatar = data.icon;    
            
        //Se non ho caricato tuti gli elo  esengo ancora la funzione
        for (var name in avversari) {
            if (! avversari[name].avatar) {
                return;
            }
        }

        if (calcolaClassificaRun)
            return;
            calcolaClassificaRun = true;

        //Stampo la tabelle dei teams
        stampaTeams();

    }).error(function(jqXhr, textStatus, error) {
        //è andato in errore ricarico i dati
        getTeamAvatar(this.url);    
    });

}

function stampaTeams() {

    console.log('AVATR TROVATI --------------------');
    for (var name in avversari) {
        console.log(avversari[name].avatar);
    }
    console.log('AVATR TROVATI --------------------');
        //Stampo la tabelle dei teams
        for (var index in matchs) {
           if ( matchs[index].id != '') { 
                var link = '';
                if  (matchs[index].id != '0') {
                   link = '<a href="' +  matchs[index].url + '" target=”_blank”> <img height="25" width="25" src="img/link.jpg"></a>';
                }
                var avatar = '';
                if (matchs[index].avversarioName && matchs[index].avversarioName != '') {
                    console.log('AVATAR: ' + matchs[index].avversarioName);
                    avatar = '<img class="classifica-avatar" src="' + avversari[matchs[index].avversarioName].avatar + '"><a style="color:black;text-decoration: none;font-weight: normal;" href="https://www.chess.com/club/' + matchs[index].avversarioName.replace(' ', '-') + '" target=”_blank”> ' +   matchs[index].avversarioName + '</a>';
                }
                 var stRiga = '<tr class="classifica-giocatori">' +
                '<td class="classifica-col1">' + matchs[index].giornata + '</td>  ' +
                '<td class="giocatori-col1SEP">  </td>' +
                '<td class="classifica-lega-2">' + matchs[index].data + '</td> ' +
                '<td class="classifica-lega-3" style="border: 0px;"> ' + avatar + '</td>' +
                '<td class="classifica-lega-4">' + matchs[index].giocatori + '</td>' +
                '<td class="classifica-lega-4">' + matchs[index].score + '</td>' +
                '<td class="classifica-lega-4" style="' + matchs[index].risultatoStyle + '">' + matchs[index].risultato + '</td>' +
                '<td class="classifica-col1">' + link +'</td>' +
                '</tr>';

                $('#'+matchs[index].lega).append(stRiga);
                
           }
        }
        
        console.log('caricaMatch. Inizio getAvatar');

         //Ricerco elo e stampo classifica giocatori
        getAvatar();
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }     
