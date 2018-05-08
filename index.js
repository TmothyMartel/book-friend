'use strict'

let state = {
    books: [],
    recommendations: [],
    lastView: ".home-view",
    currentView: ".home-view"
}

// google book api AJAX request
function googleApiSearch(searchTerm, callback) {
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes",
        data: {
            q: `${searchTerm}`,
            maxResults: 6,
            orderBy: 'relevance'
        },
        error: function(error) {
            console.log('error', error);
        },
        success: callback,
        type: 'GET'
    });
}

// tastedive api AJAX request
function tastediveApiSearch(tastediveSearchTerm) {
    $.ajax({
        url: "https://tastedive.com/api/similar?",
        data: {
            q: `${tastediveSearchTerm}`,
            type: "books",
            info: 1,
            limit: 12,
            k: "304808-authorse-BD8LBICQ",
        },
        error: function(error) {
            console.log('error', error);
        },
        jsonpCallback: 'showTasteDiveResults',
        dataType: 'jsonp'
    });
}

function resultsRender(result, index) {
    return `
          <li role="listitem">
              <div class="js-book-view" data-index="${index}">
               <img class="list-book-cover js-book-view-link" 
                  src="${result.volumeInfo.imageLinks ? result.volumeInfo.imageLinks.thumbnail : "place-holder.svg"}" 
                  alt="image of book cover">
               <a href="#"><div class="book-info-link list-synopsis-container">
                 <h3 class="list-book-title shadows">${result.volumeInfo.title}</h3>
                 <p class="list-book-synopsis">${result.volumeInfo.description?result.volumeInfo.description:"No description available"}</p>
                 <p><small>click to read more</small>...</p>
              </div></a>
            </div>
          </li>
          `
}

function bookInfoViewRender(result) {
    $('.book-cover').attr('src', `${result.imageLinks? result.imageLinks.thumbnail : "place-holder.svg" }`);
    $('.book-title').text(`${result.title}`);
    $('.buy-btn').attr('href', `https://www.barnesandnoble.com/s/${result.title}`);
    $('.book-author').text(`${result.authors?result.authors : "No author listed"}`);
    $('#book-description').text(`${result.description?result.description : "No description available"}`);
    $('.book-publisher').text(`${result.publisher?result.publisher : "No publisher listed"}`);
    $('.book-pages').text(`${result.pageCount?result.pageCount : "no page count listed"}`);
    $('.book-category').text(`${result.categories ? result.categories[0] : "unavailable"}`);
    const bookTitleQuery = `${result.title}`;
    bookViewRecommendEvenListener(bookTitleQuery);
}

// event listener to show individual book information
function showBookView() {
    $('.js-book-view').on('click', event => {
        event.preventDefault();
        let index = $(event.currentTarget).attr('data-index');
        const bookViewResult = state.books[index].volumeInfo;
        bookInfoViewRender(bookViewResult);
        showPage('.book-view');
    });
}


function backButtonEventListener() {
    $('.back-btn').on('click', event => {
        event.preventDefault();
        $('.no-result').hide();
        showPage(state.lastView);
    });
}

function showGoogleBooksResults(data) {
    state.books = data.items;
    if (state.books.length === 0) {
        $('.no-result').show();
        $('.search-result-view').hide();
    } else {
        const results = state.books.map((item, index) => resultsRender(item, index));
        $('.results-view').prop('hidden', false).html(results);
        $('.no-result').hide();
        showBookView();
    }
}

// event listener for google books api search button
function userSearchEventListener() {
    $('#js-search-form').on('click', 'button.search.btn', event => {
        const queryTarget = $('#js-search-form').find('input.js-search-bar');
        const query = queryTarget.val();
        if (query === '') {
            console.log('invalid search');
        } else {
            event.preventDefault();
            queryTarget.val("");
            $('.book-title').text(query);
            googleApiSearch(query, showGoogleBooksResults);
            $('#book-display').show();
            showPage('.search-result-view');
        }
    });
}

// Tastedive api functions

//  accesses the single book view from recommend view by
//  preforming a google book api search with the tastedive result
function showGoogleBook(data) {
    state.books = data.items;
    const bookViewResult = state.books[0].volumeInfo;
    bookInfoViewRender(bookViewResult);
    showPage('.book-view');
}

// clicking on a link in recommend view will show singular book view from google api.
function showTasteDiveBookView() {
    $('.book-info-link').on('click', event => {
        event.preventDefault();
        let index = $(event.currentTarget).attr('data-index');
        let title = $(event.currentTarget).find('.list-book-title').text();
        googleApiSearch(title, showGoogleBook);
    });
}

function tastediveRender(item, index) {
    return `
          <li role="listitem">
              <div class="js-td-book-view" data-index="${index}">
              <img class="list-book-cover" src="place-holder.svg" alt="drawing of a book">
               <div class="book-info-link list-synopsis-container">
                 <h3 class="list-book-title shadows">${item.Name}</h3>
                 <p class="list-book-synopsis">${item.wTeaser}</p>
                 <p><small>click to read more</small>...</p>
              </div>
            </div>
          </li>
          `;
}


function showTasteDiveResults(data) {
    state.recommendations = data.Similar.Results;
    if (state.recommendations.length === 0) {
        $('.no-result').show();
        $('.tastedive-search-result-view').hide();
    } else {
        const recoResults = state.recommendations.map((item, index) => tastediveRender(item, index));
        $('.td-results').prop('hidden', false).html(recoResults);
        $('.no-result').hide();
        showTasteDiveBookView();
    }
}

// event listener to run tastedive api search from search bar
function userRecommendEventListener() {
    $('#js-search-form').on('click', 'button.recommend.btn', event => {
        const tDQueryTarget = $('#js-search-form').find('input.js-search-bar');
        const tDQuery = tDQueryTarget.val();
        if (tDQuery === '') {
            console.log('invalid search');
        } else {
            event.preventDefault();
            tDQueryTarget.val("");
            $('.book-title').text(tDQuery);
            tastediveApiSearch(tDQuery);
            $('#book-display').show();
            showPage('.tastedive-search-result-view');
        }
    });
}


// render results in single book view

function bookViewRecommendEvenListener(title) {
    $('#js-button-control').on('click', 'button.book-view-recommend', event => {
        event.preventDefault();
        tastediveApiSearch(title);
        $('#book-display').show();
        showPage('.tastedive-search-result-view');
    });
}

function homeViewEvenListener() {
    $('#js-home-view').on('click', function() {
        $('#book-display').hide();
        showPage('.home-view');
    });
}

function showPage(page) {
    state.lastView = state.currentView;
    state.currentView = page;
    $('.search-result-view').hide();
    $('.tastedive-search-result-view').hide();
    $('.results').hide();
    $('.home-view').hide();
    $('.book-view').hide();
    $('.book-view-recommend-results').hide();
    $(page).fadeIn(700).show();
}

function handleEventListeners() {
    homeViewEvenListener();
    userSearchEventListener();
    userRecommendEventListener();
    backButtonEventListener();
    showPage('.home-view');
}


$(handleEventListeners);