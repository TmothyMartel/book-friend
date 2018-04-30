'use strict'

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
    success: function(data) {
        showGoogleBooksResults(data);
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

function resultsRender(result) {
  return `
          
              <li class="col-2">
                <img class="book-cover" src="${result.volumeInfo.imageLinks.thumbnail}" alt="book cover">
                <p class="book-title">${result.volumeInfo.title}</p>
                <p class="book-synopsis">${result.volumeInfo.description}</p>
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

                
                //<p class="book-title">${result.Similar.Info[0].Name}</p>
                //<p class="book-description">${result.Similar.Info[0].wTeaser}</p>

function showGoogleBooksResults(data) {
    const bookViewResult = data.items[0].volumeInfo;
    bookInfoViewRender(bookViewResult);
    const results = data.items.map((item, index) => resultsRender(item));
  $('.results').prop('hidden', false).html(results);
}

// function showTasteDiveResults(data) {
//   const results = resultsRender(data);
//   console.log(results);
//   //.map((item, index) => resultsRender(item));
 
// }





function userSearchEventListener() {
    $('#js-search-form').on('click', 'button.search.button', event => {
        event.preventDefault();
        const queryTarget = $('#js-search-form').find('input.js-search-bar');
        const query = queryTarget.val();
        queryTarget.val("");
        googleApiSearch(query, showGoogleBooksResults);
        //tastediveApiSearch(query);

    });
}

$(userSearchEventListener());



// $('#js-home-view').on('click', function() {
// 		$('.home-view').show();
// 		$('.book-view').hide();
// 		$('.recommend-view').hide();
// 	});

// $('#js-book-view').on('click', function() {
// 		$('.book-view').show();
// 		$('.home-view').hide();
// 		$('.recommend-view').hide();
// 	});

// $('#js-recommend-view').on('click', function() {
// 		$('.recommend-view').show();
// 		$('.home-view').hide();
// 		$('.book-view').hide();
// 	});