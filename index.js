'use strict'

let state = {
  books: [],
  recommendations: [],
  lastView: ".home-view",
  currentView: ".home-view"
}

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
        success:  callback,
        type: 'GET'
    });
}

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
        jsonpCallback: 'showTasteDiveResults',
        dataType: 'jsonp'
    });
}

function resultsRender(result, index) {
    return `
          <li>
              <div class="js-book-view" data-index="${index}">
               <img class="list-book-cover js-book-view-link" 
                  src="${result.volumeInfo.imageLinks ? result.volumeInfo.imageLinks.thumbnail : "No image available"}" 
                  alt="image of book cover">
               <div class="book-info-link list-synopsis-container">
                 <h3 class="list-book-title shadows">${result.volumeInfo.title}</h3>
                 <p class="list-book-synopsis">${result.volumeInfo.description?result.volumeInfo.description:"No description available"}</p>
                 <p><small>click to read more</small>...</p>
              </div>
            </div>
          </li>
          `
}

function bookInfoViewRender(result) {
    $('.book-cover').attr('src', `${result.imageLinks.thumbnail}`);
    $('.book-title').text(`${result.title}`);
    $('.book-author').text(`${result.authors}`);
    $('#book-description').text(`${result.description}`);
    $('.book-publisher').text(`${result.publisher}`);
    $('.book-pages').text(`${result.pageCount}`);
    $('.book-category').text(`${result.categories[0]}`);
}

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
    showPage(state.lastView);
  })
}

function showGoogleBooksResults(data) {
   state.books = data.items;
    const results = state.books.map((item, index) => resultsRender(item, index));
    $('.results').prop('hidden', false).html(results);
    showBookView();
}

function userSearchEventListener() {
    $('#js-search-form').on('click', 'button.search.btn', event => {
        event.preventDefault();
        const queryTarget = $('#js-search-form').find('input.js-search-bar');
        const query = queryTarget.val();
        queryTarget.val("");
        $('.book-title').text(query);
        googleApiSearch(query, showGoogleBooksResults);
        showPage('.search-result-view');
    });
}

// tastedive api functions

function showGoogleBook(data) {
    state.books = data.items;
     const bookViewResult = state.books[0].volumeInfo;
    bookInfoViewRender(bookViewResult);
    showPage('.book-view');
}

function showTasteDiveBookView() {
  $('.book-info-link').on('click',  event => {
   event.preventDefault();
   let index = $(event.currentTarget).attr('data-index');
   let title = $(event.currentTarget).find('.list-book-title').text();
   googleApiSearch(title, showGoogleBook);
});
}

function tastediveRender(item, index) {
     return `
          <li>
              <div class="js-td-book-view" data-index="${index}">
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
  const recoResults = state.recommendations.map((item, index) => tastediveRender(item, index));
  $('.td-results').prop('hidden', false).html(recoResults);
 showTasteDiveBookView();
}

function userRecommendEventListener() {
    $('#js-search-form').on('click', 'button.recommend.btn', event => {
        event.preventDefault();
        const tDQueryTarget = $('#js-search-form').find('input.js-search-bar');
        const tDQuery = tDQueryTarget.val();
        tDQueryTarget.val("");
        tastediveApiSearch(tDQuery);
        showPage('.tastedive-search-result-view')
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
  $(page).show();
}

function handleEventListeners() {
  $('.search-result-view').hide();
  $('.tastedive-search-result-view').hide();
  userSearchEventListener();
  userRecommendEventListener();
  backButtonEventListener();
}

$('#js-home-view').on('click', function() {
    showPage('.home-view');  
});

$(handleEventListeners);
