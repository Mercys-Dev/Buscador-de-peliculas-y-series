const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY
    }
});

// Helpers

function createMovies(movies, container){
    container.innerHTML = '';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () =>{
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w200/' + movie.poster_path);


        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategory(categories, container){
    container.innerHTML = "";

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () =>{
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}


// Llamados a la API

async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    trendingPreviweMoviesContainer.innerHTML = "";
    
    createMovies(movies, trendingPreviweMoviesContainer);

    console.log({data, movies});
}

async function getCategoriesPreview(){
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    createCategory(categories, previweCategoriesContainer);

    console.log({data, categories});
}

async function getMoviesByCategory(id){
    const {data} = await api('discover/movie', {
        params:{
            with_genres: id,
        },
    });
    const movies = data.results;
    
    createMovies(movies, genericSection);

    console.log({data, movies});
}

async function getMoviesBySearch(value){
    const {data} = await api('search/movie', {
        params:{
            query: value,
        },
    });
    const movies = data.results;
    
    createMovies(movies, genericSection);

    console.log({data, movies});
}

async function getTrendingMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    trendingPreviweMoviesContainer.innerHTML = "";
    
    createMovies(movies, genericSection);

    console.log({data, movies});
}


async function getMovieById(id){
    const {data: movie} = await api('movie/' + id);

    // const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    //  console.log(movieImgUrl);
    //  headerSection.style.background = `
    //      linear-gradient(
    //          180deg, 
    //          rgba(0, 0, 0, 0.35) 19.27%, 
    //          rgba(0, 0, 0, 0) 29.17%
    //          ),
    //      url(${movieImgUrl})`;

    
    // headerSection.style.backgroundSize = 'cover';
    // // headerSection.style.backgroundRepeat = 'no-repeat';
    // // headerSection.style.backgroundPosition = 'center';
    headerImage.innerHTML = "";
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container-header');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img_header');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path);


    movieContainer.appendChild(movieImg);
    headerImage.appendChild(movieContainer);
    // headerImage.style.backgroundSize = 'cover';


    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategory(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id){
    const {data} = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
    relatedMoviesContainer.scroll(0,0);
    
}