var App = angular.module('Movie', ['jQueryScrollbar']);

App.config(function($httpProvider, $routeProvider , $locationProvider) {
        $routeProvider
            // route for the home page
          .when('', {
                templateUrl : 'pages/listmovies.html',
                controller  : 'TestController',
                reloadOnSearch: false
            })
             // route for the detail page
            .when('/detail/:id', {
                templateUrl : 'pages/detailmovie.html',
                controller  : 'TestDetailController'
            })

            $httpProvider.defaults.useXDomain = true;
            $httpProvider.useApplyAsync = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];


    });
//Custom encudeURIComponent filter
App.filter('encodeURIComponent', function($window) {
    return $window.encodeURIComponent;
});

//Debounce
App.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this); 
            }, interval);
        };
    }; 
});
//error image source
App.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
       attrs.$observe('ngSrc', function(value) {
            if (!value && attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
      });
    }
  }
});

App.controller('TestDetailController' , function($scope , $http , $routeParams) {
  $scope.loadDetailPage = function() {
        $http.get('https://yts.ag/api/v2/movie_details.json?movie_id=' + $routeParams.id + '&with_cast=true')
         .then(function(res){
           $scope.moviedetail = res.data.data.movie;     
            console.log($scope.moviedetail);

        });    
  };
});
App.controller('TestController', function($scope, $http, $q, debounce) {
      $scope.page = 1 ;
      $scope.limit = 48;
      $scope.searcha = "0";
      $scope.sortArray = [
      {val : "title" , title: "Title"},
      {val : "year" , title: "Year"},
      {val : "rating" , title: "Rating"},
      {val : "download_count" , title: "Trending"},
      {val : "date_added" , title: "Date added"},
      {val : "like_count" , title: "Popularity"}
      ];
      $scope.genreArray = [
      {val : "all", title: "All Genre's"},
      {val : "action", title: "Action"},
      {val : "adventure", title: "Adventure"},
      {val : "animation", title: "Animation"},
      {val : "biography", title: "Biography"},
      {val : "comedy", title: "Comedy"},
      {val : "crime", title: "Crime"},
      {val : "documentary", title: "Documentary"},
      {val : "drama", title: "Drama"},
      {val : "family", title: "Family"},
      {val : "fantasy", title: "Fantasy"},
      {val : "film-noir", title: "Film-Noir"},
      {val : "history", title: "History"},
      {val : "horror", title: "Horror"},
      {val : "music", title: "Music"},
      {val : "musical", title: "Musical"},
      {val : "mystery", title: "Mystery"},
      {val : "romance", title: "Romance"},
      {val : "sci-fi", title: "Sci-Fi"},
      {val : "short", title: "Short"},
      {val : "sport", title: "Sport"},
      {val : "thriller", title: "Thriller"},
      {val : "war", title: "War"},
      {val : "western", title: "Western"}
      ]
      $scope.genrevalue = $scope.genreArray[0].val; //default value genre
      $scope.selectedGenreIndex = 0; //default genre index
      $scope.genretitle = $scope.genreArray[0].title; //default genre title

      $scope.sortvalue = $scope.sortArray[4].val; //default value sort
      $scope.selectedSortIndex = 4; //default sort index
      $scope.sorttitle = $scope.sortArray[4].title; //default sort title

      

      $scope.changegenre = function(genre , index) {
        $scope.genrevalue = genre.val;
        $scope.genretitle = genre.title;
        $scope.selectedGenreIndex=index;
        $scope.GenreOpen = false;
        $scope.loadPage();

      }
      $scope.changesort = function(sort, index) {
        $scope.sortvalue = sort.val;
        $scope.sorttitle = sort.title;
        $scope.selectedSortIndex=index;
        $scope.SortOpen = false;
        $scope.loadPage();
      }

      $scope.getStars = function(rating) {
          // Get the value
          var val = parseFloat(rating);
          // Turn value into number/100
          var size = val/10*100;
          return size + '%';
      }

      $scope.jqueryScrollbarOptions = {
              "disableBodyScroll" : "true",
              "onUpdate":function(container){
                  setTimeout(function(){
                      // scroll to bottom. timeout required as scrollbar restores
                      // init scroll positions after calculations
                      container.scrollTop(container.prop("scrollHeight"));
                  }, 10);
              },
              
      };
      $scope.loadPage = function() {
        //$scope.searchMovie   = '';
      $scope.page = 1 ;

        $http.get('https://yts.ag/api/v2/list_movies.json?callback=JSON_CALLBACK' + '&quality=720p' + "&sort_by=" + $scope.sortvalue + '&genre='+ $scope.genrevalue +'&query_term=' + $scope.searcha + '&page='+ $scope.page + '&limit='+ $scope.limit )
         .then(function(res){
           $scope.movies = res.data.data.movies;     
           $scope.pages = Math.round(res.data.data.movie_count / $scope.limit);   
            console.log('https://yts.ag/api/v2/list_movies.json?callback=JSON_CALLBACK' + '&quality=720p'  + '&sort_by=' + $scope.sortvalue + '&genre=' + $scope.genrevalue + '&query_term=' + $scope.searcha + '&page='+ $scope.page + '&limit='+ $scope.limit );

        });       
         
      };
      // NOT USED JUST FOR TESTING 
      $scope.getAllPages = function() {
        //$scope.searchMovie   = '';
        var httpArray = [];
        $scope.movies = [];
        $http.get('https://yts.ag/api/v2/list_movies.json?page=1&limit=50')
         .then(function(res){
           $scope.pages = Math.round(res.data.data.movie_count / $scope.limit);    
            //get the other pages
              for (var i=2; i < $scope.pages; i++){
                      httpArray.push($http.get('https://yts.ag/api/v2/list_movies.json?' + 'quality=720p' + "&sort_by=" + $scope.sortvalue + '&genre=' + $scope.genrevalue + '&page='+ i + '&limit='+ $scope.limit ))
                      // .then(function(response) {
                      //    $scope.movies = $scope.movies.concat(response.data.data.movies);
                      //  });                         
              }      
                $q.all(httpArray).then(function(data) {
                      for (var a=0; a < data.length ; a++){
                           $scope.movies = $scope.movies.concat(data[a].data.data.movies);                      
                      }
              });   

          });    
      };
      $scope.nextPage = function() {
          if ($scope.page < $scope.pages) {
             $scope.page++;
             $http.get('https://yts.ag/api/v2/list_movies.json?callback=JSON_CALLBACK' + '&quality=720p'  + '&sort_by=' + $scope.sortvalue + '&genre=' + $scope.genrevalue + '&query_term=' + $scope.searcha + '&page='+ $scope.page + '&limit='+ $scope.limit)
             .then(function(res){
                   $scope.movies= $scope.movies.concat(res.data.data.movies);
                   console.log('https://yts.ag/api/v2/list_movies.json?callback=JSON_CALLBACK' + '&quality=720p' + '&sort_by=' + $scope.sortvalue + '&genre=' + $scope.genrevalue + '&query_term=' + $scope.searcha + '&page='+ $scope.page + '&limit='+ $scope.limit);
              });
           };
      };
       $scope.previousPage = function() {
          if ($scope.page > 1) {
              $scope.page--;
              $scope.loadPage();
          }
       };
       $scope.close = function() {
          document.getElementById('video').load();
          document.getElementById('overlay').setAttribute('class', 'hidden'); //disable overlay
          document.getElementById('loading').classList.remove('hidden') //show loading icon
          document.getElementById('loading').classList.add('visible'); //show loading icon
          document.getElementById('video').setAttribute('controls', 'false'); //disable controls
          document.getElementById('video').setAttribute('class', 'hidden'); //hide video
          document.getElementById('progress').setAttribute('class', 'hidden'); //hide progressbar
          document.getElementById('graph').setAttribute('class', 'hidden'); //hide Graph
          client.remove($scope.torrentId, function callback (err) {
              console.log("removed " + $scope.torrentId);
              clearInterval($scope.interval);
              document.getElementById('log').append("Destroyed Torrent: " );
          })
       };
       $scope.go = function(hash, title) {     
          $scope.torrentId = "magnet:?xt=urn:btih:" + hash + "&dn=" + encodeURI(title) + "&tr=" + encodeURIComponent("wss://tracker.fastcast.nz") + "&tr=" + encodeURIComponent("wss://tracker.openwebtorrent.com") + "&tr=" + encodeURIComponent("wss://tracker.btorrent.xyz");
         // $scope.torrentId = torrentId;
          //&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io
          //magnet:?xt=urn:btih:7D63796263E6C926E540EBA1CA1D461C2F5D1470&dn=David+and+Goliath+%282016%29+%5B720p%5D+%5BYTS.AG%5D&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337
         document.getElementById('overlay').setAttribute('class', 'visible'); //show overlay
         document.getElementById('graph').setAttribute('class', 'visible'); //show Graph
         document.getElementById('log').append("Adding New Torrent: " + title);
         client.add($scope.torrentId , function (torrent) {
            // Check if the the array for a mkv or mp4 file
            for (var i = 0; i < torrent.files.length; i++) {        
                if (torrent.files[i].name.substr(torrent.files[i].name.length - 3 , 3) == "mkv" || torrent.files[i].name.substr(torrent.files[i].name.length -3 , 3) == "mp4") {
                    var file = torrent.files[i];
                    console.log(file.name);
                    document.getElementById('log').append("Torrent Found: " + file.name);
                }        
            }

       
            var width = 0;
            var bar = document.getElementById("bar"); 
            var progress = document.getElementById("progress"); 
            document.getElementById('graph').setAttribute('class', 'visible'); //show graph
            torrent.on('wire', function(wire, addr) {
                        document.getElementById('loading').classList.add('hidden'); //hide loading icon
                        document.getElementById('loading').classList.remove('visible'); //hide loading icon

                         document.getElementById('log').append("Connecting to peer: " + wire.remoteAddress.toString());

                        //console.log("WIRE event from: " + wire.remoteAddress.toString());
                        //console.log("Peer id: " + wire.peerId.toString());
                        var id = wire.peerId.toString();
                        
                         window.graph.add({ id: id, name: wire.remoteAddress || 'Unknown' })
                         window.graph.connect('You', id)
                         wire.once('close', function () {
                           window.graph.disconnect('You', id);
                           window.graph.remove(id);
                         });            
            });

            file.renderTo('#video', function (err, elem) {
                    document.getElementById('loading').classList.add('hidden'); //hide loading icon
                    document.getElementById('loading').classList.remove('visible'); //hide loading icon
                    document.getElementById('video').setAttribute('controls', 'true'); //enable controls
                    document.getElementById('video').setAttribute('class', 'visible'); //show video
                    document.getElementById('progress').setAttribute('class', 'visible'); //show progressbar
                    document.getElementById('graph').setAttribute('class', 'hidden'); //show graph
                    document.getElementById('log').append("Added Torrent now playing: " + $scope.torrentId);
                    console.log("added torrent:" + $scope.torrentId);
                    //LOADING BAR
                    $scope.interval = setInterval(function(){
                      if (width < 100 ){
                            //console.log('progress: ' + torrent.progress)
                            width = torrent.progress * 100;
                            //console.log(width);
                            bar.style.width = width + '%'; 
                          }else {
                            clearInterval($scope.interval)
                          }
                      },1000);

            });  // append the file to the DOM 

        })

       };

       //Search movie
       
        $scope.$watch('search', debounce(function() {
            //if it's '' pass 0 else pass the value of the searchbox and load the first page
            if ($scope.search != null && $scope.search != '' && typeof $scope.search != 'undefined'){
              //  $scope.submitSearch();
                  $scope.searcha = $scope.search;
                  $scope.loadPage();
            }
            else if ($scope.search == '' && $scope.search != null && typeof $scope.search != 'undefined') {
                 $scope.searcha = "0";
                 $scope.loadPage();
            }
        },350), true);

          
});


/* ENDLESS SCROLL JQUERY */
var isWorking = 0;
$(window).scroll(function() {
  if(isWorking==0)  {
    if  ($(window).scrollTop() >= (($(document).height() - $(window).height()) - $('#bazinga').innerHeight() -100)  ) {
        isWorking= 1;
        angular.element($("#TestController")).scope().nextPage();
        setTimeout(function(){isWorking=0},1000);

    }
  }
});







