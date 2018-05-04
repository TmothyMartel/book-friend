'use strict'

let state = {
  books: []
}
function googleApiSearch(searchTerm) {
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
        success: function(data) {
            state.books = data.items;
            showGoogleBooksResults();
        },
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
            limit: 10,
            k: "304808-authorse-BD8LBICQ",
        },
        jsonpCallback: `showTasteDiveResults`,
        dataType: 'jsonp',
    });
}

function resultsRender(result, index) {
    return `
          <li>
              <div class="js-book-view" data-index="${index}">
               <img class="list-book-cover js-book-view-link" 
                  src="${result.volumeInfo.imageLinks.thumbnail}" 
                  alt="image of book's cover">
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
    $('.book-view').show();
    $('.home-view').hide();
    $('.search-result-view').hide();
});
}

function backButtonEventListener() {
  $('.back-btn').on('click', event => {
    event.preventDefault();
    $('.book-view').hide();
    $('.search-result-view').show();
  })
}


function showGoogleBooksResults() {
    const results = state.books.map((item, index) => resultsRender(item, index));
    $('.results').prop('hidden', false).html(results);

    showBookView();
}

// function tastediveRender(item) {
//    <p class="book-title">${result.Similar.Info[0].Name}</p>
//   <p class="book-description">${result.Similar.Info[0].wTeaser}</p>

// }

// function showTasteDiveResults(data) {
//   const recommendations = tastediveRender(data);
//   console.log(results);
//   //.map((item, index) => resultsRender(item));

// }





function userSearchEventListener() {
    $('#js-search-form').on('click', 'button.search.btn', event => {
        event.preventDefault();
        const queryTarget = $('#js-search-form').find('input.js-search-bar');
        const query = queryTarget.val();
        queryTarget.val("");
        googleApiSearch(query);
        $('.search-result-view').show();
        $('.home-view').hide();
        //tastediveApiSearch(query);

    });
}

function handleEventListeners() {
  userSearchEventListener();
  backButtonEventListener();
}

$(handleEventListeners);



$('#js-home-view').on('click', function() {
    $('.home-view').show();
    $('.book-view').hide();
    $('.search-result-view').hide();
});


// $('#js-recommend-view').on('click', function() {
//     $('..search-result-view').show();
//     $('.home-view').hide();
//     $('.book-view').hide();
// });

// 1. Go back from individual books
// 2. Add read more after the book text. 
// 3. Polish details