(function($, Mustache) {

  var template, //Storing mustache template we're grabbing from the DOM.
    $events, //DOM element for appending events, spinners, etc.
    $topic, //Topic search input field.
    months       = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], //Short-hand months for display.
    spinner_opts = { lines: 13, length: 20, width: 10, radius: 60, color: '#333', className: 'spinner' }; //Options for spin.js.

  var showEvents = function(e) {

    if (e !== undefined) {
      e.preventDefault();
    }

    //spin.js -- http://fgnass.github.io/spin.js/
    new Spinner(spinner_opts).spin($events[0]);

    var favorites = getFavorites();
    var searchedEvents = searchEvents($topic.val());

    favorites.then(function(favorites){
      searchedEvents.then(function(events){
        renderEvents(events, favorites);
      }, ajaxError)
    }, ajaxError);

  };

  var searchEvents = function (search) {
    return $.ajax({
      url:"http://api.meetup.com/2/open_events/?callback=?",
      data: {
        zip:"10012",
        text: search,
        page:"10",
        key:"6752511f3291b2b182ee4d2ef312",
        time:"1w,"
      },
      dataType:"json"
    });
  }

  var getFavorites = function(){
    return $.ajax({
      url:"http://localhost:3000/favorites",
      dataType:"json"
    });
  };

  var showFavorites = function(e) {
    if (e !== undefined) {
      e.preventDefault();
    }

    new Spinner(spinner_opts).spin($events[0]);

    getFavorites().then(fetchEvents, ajaxError)
  };

  var fetchEvents = function(favorites) {
    var event_ids = favorites.results.map(function(result){ return result.id })

    $.ajax({
      url:"http://api.meetup.com/2/events/?callback=?",
      data: {
        event_id: event_ids.join(','),
        page:"10",
        key:"6752511f3291b2b182ee4d2ef312",
      },
      dataType:"json",
    }).then(function(events){
      renderEvents(events, favorites);
    }, ajaxError);
  };

  var renderEvents = function(events, favorites) {
    // var favorited = {};
    // favorites.forEach(function(favorite){
    //   favorited[favorite.id] = true;
    // })

    if (typeof(events.results) !== "undefined" && events.meta.count > 0) {

      for(var i=0, len=events.results.length; i<len; i++) {
        if (events.results[i].date === undefined) {
          var e = events.results[i];
          var date = new Date(e.time);
          e.month = months[date.getMonth()]
          e.date =  date.getDate();
        }
      }
      $events.html(Mustache.render(template, events));

    } else {

      $events.html('<p class="big bold">We couldn\'t find any matching events :(</p>');

    }

  };

  var ajaxError = function() {

    $events.html('<p class="big bold">Uh oh. Something went wrong here.</p>');

  };

  var addFavorite = function(e) {
    e.preventDefault();
    var url = "http://localhost:3000/favorites"
    var id = $(this).closest('li').data('id');

    var itemJson = {
      favorite: {
        meetup_id: id,
      }
    }

    $.post(url, itemJson);
  };

  var removeFavorite = function(e) {
    e.preventDefault();
    console.log("Remove");
  }

  var init = function() {

    template = $("#meetup-template").html();
    $events = $("#events");
    $topic = $("#topic");
    $events.on('click', 'button[data-action=favorite-add]', addFavorite);
    $events.on('click', 'button[data-action=favorite-remove]', removeFavorite);
    $("#search-button").on("click", showEvents);
    $("#get-favorites-button").on("click", showFavorites);
    showEvents();

  };

  $(init);

})($, Mustache);
