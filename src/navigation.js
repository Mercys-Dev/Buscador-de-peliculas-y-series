let page = 1;
let Maxpage;
let infiniteScroll;
let lang = navigator.languages[1];
console.log(lang);

 const countries = [
    {
       name: "Español",
       language: "es",
    },  
    
    {
       name: "Ingles",
       language: "en",
     }, 

     {
        name: "Frances",
        language: "fr",
     }, 

     {
        name: "Portugues",
        language: "pt",
     }, 
 ]



searchFormBtn.addEventListener('click', () =>{
    location.hash = `#search=${searchFormInput.value}`;
});

trendingBtn.addEventListener('click', () =>{
    location.hash = '#trends';
})


 languagesSection.addEventListener('change', (event) => {
      lang = event.target.value;
      console.log(lang);
      homePage();
    });

let historyArray  = []
arrowBtn.addEventListener('click', () =>{
    // history.back();
    // if (document.domain != 'localhost'){
    //     location.hash = '#home';
    // }else{
    //     history.back();
    // }
    
    if (historyArray.length > 1) {
        location.hash = historyArray[historyArray.length - 2];
        historyArray.splice(-2,2);
      } else {
        historyArray.pop();
        location.hash = "#home";
      }
    
})


window.addEventListener('DOMContentLoaded', navigators, false);
window.addEventListener('DOMContentLoaded', getLanguages, false);
window.addEventListener('hashchange', navigators, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigators(){
    console.log({location});

    if (infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith("#trends") 
    || location.hash.startsWith("#search=") 
    || location.hash.startsWith("#movie=") 
    || location.hash.startsWith("#category=")){
        historyArray.push(location.hash)
      }

    if (location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }
    else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }
    else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }else{
        homePage();
    }

    document.documentElement.scrollTop = 0;

    if (infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false})
    }
}

function homePage(){
    console.log('Home');

    headerSection.classList.remove('header-container--long');
    headerSection.classList.add('central-header');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    boxArrow.classList.remove('box-arrow--keep');
    boxArrow.classList.add('inactive');
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    languagesSection.classList.remove('inactive');


    trendingPreviewSection.classList.remove('inactive');
    trendingPreviewSection.classList.add('central');
    likedMovieSection.classList.remove('inactive');
    likedMovieSection.classList.add('central');
    categoriesPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.add('central');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');
    headerImage.classList.add('inactive');


    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
    
}

function categoriesPage(){
    console.log('Categorys!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerSection.classList.add('central-header');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    boxArrow.classList.remove('box-arrow--keep');
    boxArrow.classList.remove('inactive');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    languagesSection.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');
    headerImage.classList.add('inactive');




    const [_, categoryData] = location.hash.split('=') // ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-');
    console.log(categoryName);
    const [part1, part2] = categoryName.split('%20')
    console.log(part1);
    console.log(part2);
    const name = part1 + ' ' + part2;
    console.log(name);
    if(part2 == undefined){
        headerCategoryTitle.innerHTML = part1;
    }else{
        headerCategoryTitle.innerHTML = name;
    }

    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);

}

function movieDetailsPage(){
    console.log('Movie!!')

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    headerSection.classList.remove('central-header');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    boxArrow.classList.add('box-arrow--keep');
    boxArrow.classList.remove('inactive');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    languagesSection.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    footer.classList.add('inactive');
    headerImage.classList.remove('inactive');


    const movieId = decodeURI(location.hash.split("=")[1]); //De esta forma no hay problemas con las peliculas de nombres largos

     var mediaqueryList = window.matchMedia("(min-width: 767px)");
     let size_image;

     if(mediaqueryList.matches) {
         size_image = 'backdrop_path';
     } else{
         size_image = 'poster_path';
     }    

    getMovieById(movieId, size_image);
}

function searchPage(){
    console.log('Search!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerSection.classList.add('central-header');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    boxArrow.classList.remove('box-arrow--keep');
    boxArrow.classList.remove('inactive');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    headerImage.classList.add('inactive');
    languagesSection.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');

    const searchValue = decodeURI(location.hash.split("=")[1]); //De esta forma no hay problemas con las peliculas de nombres largos
    getMoviesBySearch(searchValue);

    infiniteScroll = getPaginatedMoviesBySearch(searchValue);

}

function trendsPage(){
    console.log('TRENDS!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerSection.classList.add('central-header');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    boxArrow.classList.remove('box-arrow--keep');
    boxArrow.classList.remove('inactive');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    headerImage.classList.add('inactive');
    languagesSection.classList.add('inactive');



    trendingPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');


    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}