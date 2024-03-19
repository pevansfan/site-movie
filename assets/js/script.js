const API_KEY = 'e1cf9a9a248b7e3c0190bee2623c9b47';

var app = new Vue({
    el: '#app',
    data: {
        selectedGenre: '', // Genre sélectionné de l'utilisateur
        genres: [], // Liste des genres de films (qui seront récupérées à partir de l'API TMDB)
        movies: [], // Liste des films (qui seront récupérées à partir de l'API TMDB)
        votingFinished: false, // Au départ le vote n'a pas encore été validé
        voteResults: [] // Résultats comportant la liste des films selon les préférences de l'utilisateur
    },
    methods: {
        async fetchMovieGenres() { //Permet de récupérer les genres des films de l'API TMDB
            const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`); // fetch permet de manipuler les requêtes et les réponses de l'API TMDB (ici les catégories) en utilisant ma clé API personnel
            const data = await response.json(); // On enregistre les données dans un fichier JSON
            this.genres = data.genres; // Variable contenant les catégories
        },
        async searchMoviesByGenre() {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${this.selectedGenre}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc`); // On récupère les films selon le genre choisi par l'utilisateur et classé par ordre de votes en utilisant également ma clé API personnel
            const data = await response.json(); // On enregistre les données dans le même fichier JSON précédent
            this.movies = data.results.slice(0, 10); // On affiche que les 10 premiers films avec le plus de votes
        },
        finishVote() {
            // On sauvegarde des votes dans le local storage
            localStorage.setItem('voteResults', JSON.stringify(this.movies.map(movie => ({ movie: movie.title })))); // Cette ligne utilise localStorage.setItem() pour stocker les données sous la clé 'voteResults'. Ensuite, les résultats sont transformés en chaîne JSON à l'aide de JSON.stringify(). Dans cet exemple, this.movies.map() crée un nouveau tableau en parcourant chaque élément de this.movies (la liste des films) et en extrayant le titre de chaque film avec movie.title. Pour chaque film, un objet est créé avec la propriété movie.title

            // On marque le vote comme terminé et on affiche les résultats
            this.votingFinished = true;
            this.loadVoteResults();
        },
        loadVoteResults() {
            // On charge les résultats du vote à partir du local storage
            const storedResults = localStorage.getItem('voteResults');
            if (storedResults) { // s'il existe des données dans le locale storage
                this.voteResults = JSON.parse(storedResults); //  On parse (parcourt) la chaîne JSON récupérée en un objet JavaScript à l'aide de JSON.parse() et les assigne à la propriété voteResults, et permet d'afficher les résultats du vote à l'utilisateur.
            }
        }
    },
    created() {
        this.fetchMovieGenres();
    }
});

function showPopup() { // Au click du bouton pour terminer le vote, on affiche une pop-up qui dure 4 secondes
    document.getElementById('popup').style.display = 'flex';
    setTimeout(function () {
        document.getElementById('popup').style.display = 'none';
    }, 4000);
}
