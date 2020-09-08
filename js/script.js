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
    getGeneri();
    datiIniziali('movie');
    datiIniziali('tv');
    $('#logo').click(function () {
        resetData();
        datiIniziali('movie');
        datiIniziali('tv');
    });
    $('#cerca-input').val("");
    $('#cerca-btn').click(iniziaRicerca);
    $('#cerca-input').keyup(function () {
        if (event.which == 13 || event.keyCode == 13) {
            iniziaRicerca();
        };
    });


}); //fine document ready

//INIZIO FUNZIONI

function datiIniziali(tipo) {
    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    if (tipo == 'movie') {
        var ordinamento = 'vote_count.desc';
    } else if (tipo == 'tv') {
        var ordinamento = 'popularity.desc';
    };
    $.ajax({
        url: 'https://api.themoviedb.org/3/discover/' + tipo,
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            sort_by: ordinamento
        },
        success: function (resp) {
            //passo l'array con i risultati alla funzione che stampa l'elenco
            stampaElenco(resp.results, tipo, 8);
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore');
            console.log(resp);
        },
    }) //fine chiamata ajax
}


function iniziaRicerca() {
    //prendo il valore inserito nell'input e lo salvo in una variabile
    var datiRicerca = $('#cerca-input').val();
    //controllo valore stringa 
    if (datiRicerca != "") {
        resetData();
        //lancio funzione per ricerca film e serie tv
        ricercaGlobale(datiRicerca, "https://api.themoviedb.org/3/search/movie", "movie");
        ricercaGlobale(datiRicerca, "https://api.themoviedb.org/3/search/tv", 'tv');
    } else {
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

function stampaElenco(data, type, numRisultati) {
    //elementi per template Handlebars
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    //controllo se ci sono dei risultati (o già stampati su html oppure nell'array)
    if (data.length == 0) {
        errorMessage("nessunRisultato", type);
    } else {
        //ciclo tutti i risultati ottenuti 
        // se numRisultati viene passato filtro al massimo per quel numero di risultati
        var maxRisultati = data.length;
        if (numRisultati != null) {
            maxRisultati = numRisultati;
        }
        for (var i = 0; i < maxRisultati; i++) {
            if (type == 'movie') {
                var titolo = data[i].title;
                var titoloOriginale = data[i].original_title;
            } else if (type == 'tv') {
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
                id: data[i].id,
                title: titolo,
                original_title: titoloOriginale,
                original_language: flags(data[i].original_language),
                vote_average: stars(data[i].vote_average),
                type: type,
                img: img,
                popolarita: data[i].popularity,
                overview: data[i].overview.substring(0, 200) + '[...]'
            };
            if (type == 'movie') {
                // stampo sui template Handlebars ogni risultato del ciclo for
                var html = template(context);
                $('.film-dettaglio').append(html);
            } else if (type == 'tv') {
                // stampo sui template Handlebars ogni risultato del ciclo for
                var html = template(context);
                $('.serie-tv-dettaglio').append(html);
            };
            ricercaDettagli(data[i].id, type)
        };
    }
};
function ricercaDettagli(id, tipo) {
    var url = "https://api.themoviedb.org/3/" + tipo + '/' + id;

    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    $.ajax({
        url: url, //url passato
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            append_to_response: 'credits',
        },
        success: function (resp) {
            //passo l'array con i risultati alla funzione che stampa l'elenco
            var generi = resp.genres;
            var attori = resp.credits.cast;
            stampaDettagli(id, tipo, generi, attori);
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore')
            console.log(resp);

        },
    }) //fine chiamata ajax
}
function stampaDettagli(id, tipo, generi, attori) {
    //elenco attori
    var elencoAttori = '';
    var numAttori = attori.length;
    if (numAttori > 5) {
        numAttori = 5
    }
    //stampo al massimo 5 attori per ogni film o serie tv
    for (var i = 0; i < numAttori; i++) {
        elencoAttori += attori[i].name;
        //se non sono all'ultimo attore aggiiungo una virgola 
        if (i != numAttori - 1) {
            elencoAttori += ', ';
        }
    }

    //elenco generi
    var elencoGeneri = '';
    var concatenaGeneri = '';
    for (var i = 0; i < generi.length; i++) {
        elencoGeneri += generi[i].name;
        concatenaGeneri += generi[i].name;
        //se non sono all'ultimo attore aggiiungo una virgola 
        if (i != generi.length - 1) {
            elencoGeneri += ' ';
            concatenaGeneri += ', ';
        }
    }
    //elementi per template Handlebars
    var source = $("#template-generi-cast").html();
    var template = Handlebars.compile(source);
    var context = {
        genre: concatenaGeneri,
        concatenaGenre: concatenaGeneri,
        cast: elencoAttori,
    };
    console.log(concatenaGeneri.split(', '));
    if (tipo == 'movie') {
        // stampo sui template Handlebars ogni risultato del ciclo for
        var html = template(context);
        $('.film-dettaglio .film-card[data-id="' + id + '"] .film-dati').append(html);
        $('.film-dettaglio .film-card[data-id="' + id + '"]').attr('data-generi', concatenaGeneri);
    } else if (tipo == 'tv') {
        // stampo sui template Handlebars ogni risultato del ciclo for
        var html = template(context);
        $('.serie-tv-dettaglio .film-card[data-id="' + id + '"] .film-dati').append(html);
        $('.serie-tv-dettaglio .film-card[data-id="' + id + '"]').attr('data-generi', concatenaGeneri);

    };
};




function getGeneri() {
    var source = $("#template-select").html();
    var template = Handlebars.compile(source);
    var arrayGenere = [];
    var tipo = 'movie';
    var url = "https://api.themoviedb.org/3/genre/" + tipo + "/list";
    //faccio chiamata ajax sulla base del valore salvato nella variabile passata
    $.ajax({
        url: url, //url passato
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
        },
        success: function (resp) {
            console.log(tipo, resp.genres);
            for (var i = 0; i < resp.genres.length; i++) {
                if (!arrayGenere.includes(resp.genres[i].name)) {
                    arrayGenere.push(resp.genres[i].name);
                    var context = resp.genres[i];
                    var html = template(context);
                    $('#filter-genre').append(html)
                }
            }
            var tipo = 'tv';
            var url = "https://api.themoviedb.org/3/genre/" + tipo + "/list";
            //faccio chiamata ajax sulla base del valore salvato nella variabile passata
            $.ajax({
                url: url, //url passato
                method: "GET",
                data: {
                    api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
                    language: "it-IT",
                },
                success: function (resp) {
                    console.log(tipo, resp.genres);
                    //compilo select con elenco generi
                    for (var i = 0; i < resp.genres.length; i++) {
                        if (!arrayGenere.includes(resp.genres[i].name)) {
                            arrayGenere.push(resp.genres[i].name);
                            var context = resp.genres[i];
                            var html = template(context);
                            $('#filter-genre').append(html)
                        }
                    }
                    //filtro risultati al click sulla select
                    $('#filter-genre option').click(function () {
                        var genere = $(this).html();
                        console.log(genere);
                        if (genere == "All") {
                            $('.film-card').show();

                        } else {

                            $('.film-card').hide();
                            $('.film-card[data-generi="' + genere + '"').show();
                        }

                    })
                },
                error: function (resp) {
                    //segnalo errore e compilo log
                    alert('errore')
                    console.log(resp);
                },
            }) //fine chiamata ajax
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore')
            console.log(resp);
        },
    }) //fine chiamata ajax
}


function errorMessage(tipoErrore, tipoFilmSerie) {

    if (tipoErrore == "ricercaVuota") {
        alert('Attenzione, la ricerca non può essere vuota');
    } else if (tipoErrore == "nessunRisultato") {
        if (tipoFilmSerie == "movie") {
            var messaggioErrore = 'Nessun risultato nella sezione Film';
            $('.film-dettaglio').html(messaggioErrore);
        } else if (tipoFilmSerie == "tv") {
            var messaggioErrore = 'Nessun risultato nella sezione Serie TV';
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
    var flagImg = [
        'en',
        'it'
    ];
    for (var i = 0; i < flagImg.length; i++) {
        if (flagImg.includes(lang)) {
            return '<img class="flags" src="img/flags/' + flagImg[i] + '.svg" alt=""></img>';
        } else {
            return lang;
        }
    };
}


