//Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});



function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item){
        movies = item
    } else{
        movies = {}
    }

    return movies
}

function likeMovie(movie){
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]){
        likedMovies[movie.id] = undefined
        console.log('esta en localstorage')
    } else{
        likedMovies[movie.id] = movie;
        console.log('No esta en el local storage')
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))

    getTrendingMoviesPreview();
    getLikedMovies()
}

// Helpers

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting == true){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
})

function createMovies(movies, container, 
    {lazyLoad = false, 
     efects = false, 
     clean = true
    }){

    if (clean){
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');


        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        if(efects){
            movieImg.classList.add('movie-img--category');
        }
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazyLoad ? 'data-img': 'src', 'https://image.tmdb.org/t/p/w200/' + movie.poster_path);
        movieImg.addEventListener('click', () =>{
            location.hash = '#movie=' + movie.id;
        })

        movieImg.addEventListener('error', () => {
            movieImg.classList.add('movie-img--null');

            movieImg.style.paddingTop = "100px";
            movieImg.style.fontSize = "1.5rem";

        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
         if(efects){
             movieBtn.classList.add('btnBig');
         }
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
        });

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
    const {data} = await api('trending/movie/day', {
        params: {
            language: lang,
          },
    });
    const movies = data.results;

    trendingPreviweMoviesContainer.innerHTML = "";
    
    createMovies(movies, trendingPreviweMoviesContainer, {lazyLoad: true, efects:false, clean: true});

    console.log({data, movies});
}

async function getCategoriesPreview(){
    const {data} = await api('genre/movie/list', {
        params: {
            language: lang,
          },
    });
    const categories = data.genres;

    createCategory(categories, previweCategoriesContainer);

    console.log({data, categories});
}

async function getMoviesByCategory(id){
    const {data} = await api('discover/movie', {
        params:{
            with_genres: id,
            language: lang,
        },
    });
    const movies = data.results;
    Maxpage = data.total_pages;
    console.log(Maxpage);
    
    createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: true});

    console.log({data, movies});
}

function getPaginatedMoviesByCategory(id){
    return async function (){
        const { scrollTop, scrollHeight, clientHeight } =  document.documentElement

        const scrollisBotton =  scrollTop + clientHeight >= scrollHeight - 15
        const pageisNoMax = page < Maxpage;
    
        if (scrollisBotton && pageisNoMax){
            page++;
            const {data} = await api('discover/movie', {
                params:{
                    with_genres: id,
                    page,
                    language: lang,
                },
            });
            const movies = data.results;
        
            createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: false});
        
        }
    }
}

async function getMoviesBySearch(value){
    const {data} = await api('search/movie', {
        params:{
            query: value,
            language: lang,
        },
    });
    const movies = data.results;
    Maxpage = data.total_pages;
    console.log(Maxpage);

    
    createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: true});

    console.log({data, movies});
}

function getPaginatedMoviesBySearch(value){
    return async function (){
        const { scrollTop, scrollHeight, clientHeight } =  document.documentElement

        const scrollisBotton =  scrollTop + clientHeight >= scrollHeight - 15
        const pageisNoMax = page < Maxpage;
    
        if (scrollisBotton && pageisNoMax){
            page++;
            const {data} = await api('search/movie', {
                params:{
                    query: value,
                    page,
                    language: lang,
                },
            });
            const movies = data.results;
        
            createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: false});
        
        }
    }
}

async function getTrendingMovies(){
    const {data} = await api('trending/movie/day', {
        params: {
            language: lang,
          },
    });
    const movies = data.results;
    Maxpage = data.total_pages;

    trendingPreviweMoviesContainer.innerHTML = "";
    
    createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: true});

    // const brnLoadMore = document.createElement('button');
    // brnLoadMore.innerText = 'Cargar mas';
    // brnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(brnLoadMore);

    console.log({data, movies});
}


async function getPaginatedTrendingMovies(){
    const { scrollTop, scrollHeight, clientHeight } =  document.documentElement

    const scrollisBotton =  scrollTop + clientHeight >= scrollHeight - 15
    const pageisNoMax = page < Maxpage;

    if (scrollisBotton && pageisNoMax){
        page++;
        const {data} = await api('trending/movie/day', {
            params: {
                page,
                language: lang,
            },
        });
        const movies = data.results;
    
        createMovies(movies, genericSection, {lazyLoad: true, efects:true, clean: false});
    
    }

    // const brnLoadMore = document.createElement('button');
    // brnLoadMore.innerText = 'Cargar mas';
    // brnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(brnLoadMore);
}


async function getMovieById(id, size){
    const {data: movie} = await api('movie/' + id, {
        params: {
            language: lang,
          },
    });

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

    if(size == 'backdrop_path'){
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path);
    }else{
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/original/' + movie.poster_path);
    }

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
    const {data} = await api(`movie/${id}/similar`, {
        params: {
            language: lang,
          },
    });
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer, {lazyLoad: true, efects:false, clean: true});
    relatedMoviesContainer.scroll(0,0);
    
}

 async function getLanguages() {
     countries.forEach((country) => {

       const languageOption = document.createElement('option');
       languageOption.setAttribute('value', country.language );
       languageOption.setAttribute('for', 'language');

       const languageText = document.createTextNode(country.name);
       languageOption.appendChild(languageText);
   


       languagesSection.appendChild(languageOption);
     });
   };

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesContainer, {lazyLoad: true, efects: false, clean: true})

}