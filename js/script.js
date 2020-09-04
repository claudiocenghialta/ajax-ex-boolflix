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
        //lancio funzione per ricerca film e serie tv
        ricercaGlobale(datiRicerca, "https://api.themoviedb.org/3/search/movie", "Film");
        ricercaGlobale(datiRicerca, "https://api.themoviedb.org/3/search/tv", 'Serie TV');
    } else {
        resetData();
        //stampo messaggio di errore al posto dell'elenco titoli
        errorMessage("ricercaVuota");
    };
}
function ricercaGlobale(stringaRicerca, url, tipo) {
    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    $.ajax({
        url: url, //url passato
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            query: stringaRicerca, //variabile passata 
            include_adult: "false"
        },
        success: function (resp) {
            //passo l'array con i risultati alla funzione che stampa l'elenco
            stampaElenco(resp.results, tipo);
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
    if (data.length == 0) {
        errorMessage("nessunRisultato", type);
    } else {
        //ciclo tutti i risultati ottenuti
        for (var i = 0; i < data.length; i++) {
            if (type == 'Film') {
                var titolo = data[i].title;
                var titoloOriginale = data[i].original_title;
            } else if (type == 'Serie TV') {
                var titolo = data[i].name;
                var titoloOriginale = data[i].original_name;
            };
            //compilo valore del link al poster del film 
            var img = "https://image.tmdb.org/t/p/w342/" + data[i].poster_path
            if (data[i].poster_path == null) {
                //se non è presente una immagine nel database metto una immagine placeholder
                img = 'img/no-poster.jpg'
            }
            var context = {
                //prendo solo i valori da stampare a video e non tutti i dati ricevuti in risposta alla chiamata
                title: titolo,
                original_title: titoloOriginale,
                original_language: flags(data[i].original_language),
                vote_average: stars(data[i].vote_average),
                type: type,
                img: img
            };
            if (type == 'Film') {
                // stampo sui template Handlebars ogni risultato del ciclo for
                var html = template(context);
                $('.film-dettaglio').append(html);
            } else if (type == 'Serie TV') {
                // stampo sui template Handlebars ogni risultato del ciclo for
                var html = template(context);
                $('.serie-tv-dettaglio').append(html);
            };

        };
    }

};

function errorMessage(tipoErrore, tipoFilmSerie) {
    if (tipoErrore == "ricercaVuota") {
        alert('Attenzione, la ricerca non può essere vuota');
    } else if (tipoErrore == "nessunRisultato") {
        var messaggioErrore = 'Nessun risultato nella sezione ' + tipoFilmSerie;
        if (tipoFilmSerie == "Film") {
            $('.film-dettaglio').html(messaggioErrore);
        } else if (tipoFilmSerie == "Serie TV") {
            $('.serie-tv-dettaglio').html(messaggioErrore);
        }

    };
};
function resetData() {
    // svuoto l'elenco dei film già cercati in precedenza
    $('.film-dettaglio').empty();
    $('.serie-tv-dettaglio').empty();
};


function stars(voto) {
    var resto = voto % 2;
    var votoRounded = Math.floor(voto / 2);
    var stars = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= votoRounded) {
            stars += '<i class="fas fa-star yellow"></i>'; //stella piena
        } else if (resto != 0) {
            stars += '<i class="fas fa-star-half-alt yellow"></i>'; //stella a metà
            resto = 0;
        }
        else {
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
            return '<img class="flags" src="img/flags/' + flagImg[k] + '" alt=""></img>';
        };
    }
    return lang;

}