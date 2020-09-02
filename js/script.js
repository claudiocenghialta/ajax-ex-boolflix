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
    var datiRicerca = "";
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: "GET",
        data: {
            api_key: "f55f5e2e7cdc1cc61c195d269b630b9c",
            language: "it-IT",
            query: datiRicerca,
            include_adult: "false"
        },
        success: function (resp) {
            console.log(resp);
        },
        error: function (resp) {
            alert('errore')
            console.log(resp);

        },
    })

    // var source = document.getElementById("entry-template").innerHTML;
    // var template = Handlebars.compile(source);

    // var context = { title: "My New Post", body: "This is my first post!" };
    // var html = template(context);





});