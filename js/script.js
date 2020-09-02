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
    $('#cerca-btn').click(iniziaRicerca)
    $('#cerca-input').keyup(function () {
        if (event.which == 13 || event.keyCode == 13) {
            iniziaRicerca();
        }
    })

}); //fine document ready

function iniziaRicerca() {
    //prendo il valore inserito nell'input e lo salvo in una variabile
    var datiRicerca = $('#cerca-input').val();
    //controllo valore stringa 
    if (datiRicerca != "") {
        // svuoto l'elenco dei film già cercati in precedenza
        $('.film-dettaglio').empty();
        //lancio funzione per ricerca film
        cercaFilm(datiRicerca);
    } else {
        // svuoto l'elenco dei film già cercati in precedenza
        $('.film-dettaglio').empty();
        //stampo messaggio di errore al posto dell'elenco titoli
        $('.film-dettaglio').html('Attenzione, la ricerca non può essere vuota');
    }
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
            //elementi per template Handlebars
            var source = document.getElementById("entry-template").innerHTML;
            var template = Handlebars.compile(source);
            //controllo che i risultati non siano zero, quindi non esistono film con quella stringa di ricerca
            if (resp.results.length == 0) {
                $('.film-dettaglio').html('Attenzione, la ricerca non ha prodotto alcun risultato');
            } else {
                //ciclo tutti i risultati ottenuti
                for (var i = 0; i < resp.results.length; i++) {
                    var context = {
                        //prendo solo i valori da stampare a video e non tutti i dati ricevuti in risposta alla chiamata
                        title: resp.results[i].title,
                        original_title: resp.results[i].original_title,
                        original_language: resp.results[i].original_language,
                        vote_average: resp.results[i].vote_average
                    };
                    // stampo sui template Handlebars ogni risultato del ciclo for
                    var html = template(context);
                    $('.film-dettaglio').append(html)

                }
            }
        },
        error: function (resp) {
            //segnalo errore e compilo log
            alert('errore')
            console.log(resp);

        },
    }) //fine chiamata ajax
}