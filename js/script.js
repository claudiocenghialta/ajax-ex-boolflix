/*
https://api.themoviedb.org/3/search/movie
{
    "page": 1,
    "total_results": 67,
    "total_pages": 4,
    "results": [
        {
            "popularity": 50.295,
            "vote_count": 17663,
            "video": false,
            "poster_path": "/jcD6c5vCv5Y5hjneYfjpi7LjKWL.jpg",
            "id": 603,
            "adult": false,
            "backdrop_path": "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            "original_language": "en",
            "original_title": "The Matrix",
            "genre_ids": [
                28,
                878
            ],
            "title": "Matrix",
            "vote_average": 8.1,
            "overview": "Seguendo un tatuaggio sulla spalla di una ragazza, l'hacker Neo scopre che la cosiddetta \"realtà\" è solo un impulso elettrico fornito al cervello degli umani da un'intelligenza artificiale. Per sopravvivere alla catastrofe l'umanità ha infatti avuto bisogno delle macchine, ma queste hanno vinto e necessitano degli uomini come fonte di energia. L'illusione in cui li fanno vivere è quindi finalizzata a \"coltivarli\" meglio. Nessuno è a conoscenza del tempo che è passato da quando il neurosimulatore ha assegnato una data fittizia al tempo. Solo Neo, con l'aiuto del pirata informatico Morpheus e della bella Trinity, può tentare di scoprire la verità, ma non sarà un'impresa facile.",
            "release_date": "1999-03-30"
        },
*/


$(document).ready(function () {
    $('#cerca-input').val("");
    $('#cerca-btn').click(iniziaRicerca);
    $('#cerca-input').keyup(function () {
        if (event.which == 13 || event.keyCode == 13) {
            iniziaRicerca();
        };
    });

}); //fine document ready

//INIZIO FUNZIONI

function iniziaRicerca() {
    //prendo il valore inserito nell'input e lo salvo in una variabile
    var datiRicerca = $('#cerca-input').val();
    //controllo valore stringa 
    if (datiRicerca != "") {
        resetData();
        //lancio funzione per ricerca film
        cercaFilm(datiRicerca);
        cercaSerie(datiRicerca);
    } else {
        resetData();
        //stampo messaggio di errore al posto dell'elenco titoli
        errorMessage("ricercaVuota");
    };
}

function cercaFilm(stringaRicerca) {
    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            query: stringaRicerca, //variabile passata 
            include_adult: "false"
        },
        success: function (resp) {
            //passo l'array con i risultati alla funzione che stampa l'elenco
            stampaElenco(resp.results, 'Film');
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore')
            console.log(resp);

        },
    }) //fine chiamata ajax
}
function cercaSerie(stringaRicerca) {
    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    $.ajax({
        url: "https://api.themoviedb.org/3/search/tv",
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            query: stringaRicerca, //variabile passata 
            include_adult: "false"
        },
        success: function (resp) {
            //passo  l'array con i risultati alla funzione che stampa l'elenco
            stampaElenco(resp.results, 'Serie TV');
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore')
            console.log(resp);

        },
    }) //fine chiamata ajax
}

function stampaElenco(data, type) {
    //elementi per template Handlebars
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    //controllo se ci sono dei risultati (o già stampati su html oppure nell'array)
    if ($('.film-dettaglio').html() == "" && data.length == 0) {
        errorMessage("nessunRisultato");
    } else {
        //resetto il messaggio di errore il messaggio
        //necessario perchè se non trova film inserisce il messaggio 
        //se poi non trova serie tv lo lascio
        //ma nel caso in cui ci sono serie tv il messaggio non deve apparire
        resetErrorMessage();
        //ciclo tutti i risultati ottenuti
        for (var i = 0; i < data.length; i++) {
            if (type == 'Film') {
                var titolo = data[i].title;
                var titoloOriginale = data[i].original_title;
            } else {
                var titolo = data[i].name;
                var titoloOriginale = data[i].original_name;
            };
            var context = {
                //prendo solo i valori da stampare a video e non tutti i dati ricevuti in risposta alla chiamata
                title: titolo,
                original_title: titoloOriginale,
                original_language: flags(data[i].original_language),
                vote_average: stars(data[i].vote_average),
                type: type
            };
            // stampo sui template Handlebars ogni risultato del ciclo for
            var html = template(context);
            $('.film-dettaglio').append(html);
        };
    }

};

function errorMessage(tipo) {
    if (tipo == "ricercaVuota") {
        var messaggioErrore = 'Attenzione, la ricerca non può essere vuota';
    } else if (tipo == "nessunRisultato") {
        var messaggioErrore = 'Attenzione, la ricerca non ha prodotto alcun risultato';
    };
    $('.error-message').html(messaggioErrore);
    $('.error-message').addClass('visible');
};
function resetErrorMessage() {
    $('.error-message').html("");
    $('.error-message').removeClass('visible');
};
function resetData() {
    // svuoto l'elenco dei film già cercati in precedenza
    resetErrorMessage();
    $('.film-dettaglio').empty();
};


function stars(voto) {
    var votoRounded = Math.ceil(voto / 2);
    var stars = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= votoRounded) {
            stars += '<i class="fas fa-star yellow"></i>'; //stella piena
        } else {
            stars += '<i class="far fa-star grey"></i>'; //stella vuota
        }
    };
    return stars;
};

function flags(lang) {
    var flagImg = {
        en: 'en.svg',
        it: 'it.svg'
    };
    for (var k in flagImg) {
        if (k == lang) {
            return '<img class="flags" src="img/' + flagImg[k] + '" alt=""></img>';
        };
    }
    return lang;

}