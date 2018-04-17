'use strict'

// $.ajax({
//    url: "https://www.googleapis.com/books/v1/volumes",
//    data: {
//       q: "lord of the rings"
//    },
//    error: function(error) {
//       console.log('error', error);
//    },
//    success: function(data) {
//      console.log('success', data);
//    },
//    type: 'GET'
// });


// $.ajax({
//   url: "https://tastedive.com/api/similar?",
//   //header: {  'Access-Control-Allow-Origin': 'https://null.jsbin.com/'},
//   data: {
//    q: "lord of the rings",
//    type: "books",
//    info: 1,
//    limit: 10,
//    k: "304808-authorse-BD8LBICQ",
//    callback: { 
//        error: function(error) {
//          console.log('error', error);
//      },
//       success: function(data) {
//        console.log('success', data);
//      }
//    },
//     crossDomain: true,
//    dataType: 'jsonp',
//    method: 'GET'
//  }
// });



	
$('#js-home-view').on('click', function() {
		$('.home-view').show();
		$('.book-view').hide();
		$('.recommend-view').hide();
	});

$('#js-book-view').on('click', function() {
		$('.book-view').show();
		$('.home-view').hide();
		$('.recommend-view').hide();
	});

$('#js-recommend-view').on('click', function() {
		$('.recommend-view').show();
		$('.home-view').hide();
		$('.book-view').hide();
	});