'use strict'

$.ajax({
   url: "https://www.googleapis.com/books/v1/volumes",
   data: {
      q: "lord of the rings"
   },
   error: function(error) {
      console.log('error', error);
   },
   success: function(data) {
     console.log('success', data);
   },
   type: 'GET'
});


$.ajax({
  url: "https://tastedive.com/api/similar?",
  //header: {  'Access-Control-Allow-Origin': 'https://null.jsbin.com/'},
  data: {
   q: "lord of the rings",
   type: "books",
   info: 1,
   limit: 10,
   k: "304808-authorse-BD8LBICQ",
   callback: { 
       error: function(error) {
         console.log('error', error);
     },
      success: function(data) {
       console.log('success', data);
     }
   },
    crossDomain: true,
   dataType: 'jsonp',
   method: 'GET'
 }
});