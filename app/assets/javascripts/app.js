(function($, Mustache) {

  var template, //Storing mustache template we're grabbing from the DOM.
    $events, //DOM element for appending events, spinners, etc.
    $topic, //Topic search input field.
    months       = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], //Short-hand months for display.
    spinner_opts = { lines: 13, length: 20, width: 10, radius: 60, color: '#333', className: 'spinner' }; //Options for spin.js.

  function showEvents(e) {

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

  function searchEvents(search) {
    return $.ajax({
      url:"https://api.meetup.com/2/open_events/?callback=?",
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

  function getFavorites(){
    return $.ajax({
      url: window.BASE_URL + "favorites",
      dataType:"json"
    });
  };


  function showFavorites(e) {
    if (e !== undefined) {
      e.preventDefault();
    }

    new Spinner(spinner_opts).spin($events[0]);

    getFavorites().then(fetchEvents, ajaxError)
  };

  function fetchEvents(favorites) {
    var event_ids = favorites.results.map(function(result){ return result.id })

    $.ajax({
      url:"https://api.meetup.com/2/events/?callback=?",
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

  function renderEvents(events, favorites) {
    if (typeof(events.results) !== "undefined" && events.meta.count > 0) {

      for(var i=0, len=events.results.length; i<len; i++) {
        var e = events.results[i];
        var date = new Date(e.time);
        e.month = months[date.getMonth()]
        e.date =  date.getDate();
      }

      $events.html(Mustache.render(template, events));
      checkButtons(favorites)

    } else {
      $events.html('<p class="big bold">We couldn\'t find any matching events :(</p>');
    }

  };

  function checkButtons(favorites) {
    var items = $('.item');

    $.each(items, function(i, item){
      var addButton = $(item).find('i[data-action=favorite-add]');
      var removeButton = $(item).find('i[data-action=favorite-remove]');
      var itemID = $(item).attr('data-id');
      var savedItems = favorites.results
      var isSaved = false;

      $.each(savedItems, function(x, saveItem){
        if(saveItem.id == itemID) {
          isSaved = true;
        }
      });

      if(isSaved && addButton) {
        addButton.removeClass('item-add').addClass('item-remove').attr('data-action', 'favorite-remove')
      } else {
        removeButton.removeClass('item-remove').addClass('item-add').attr('data-action', 'favorite-add')
      }
    });
  }

  function ajaxError() {
    $events.html('<p class="big bold">Uh oh. Something went wrong here.</p>');
  };

  function addFavorite(e) {
    e.preventDefault();
    var button = $(this)
    var id = button.closest('li').data('id');
    var url = window.BASE_URL + "favorites"

    var itemJson = {
      favorite: {
        meetup_id: id,
      }
    }

    $.post(url, itemJson).then(function(){
      button.removeClass('item-add').addClass('item-remove').attr('data-action', 'favorite-remove')
    });
  };

  function removeFavorite(e) {
    e.preventDefault();
    var button = $(this)
    var id = button.closest('li').data('id');
    var url = window.BASE_URL + "favorites/" + id;

    $.ajax({
        url: url,
        type: 'DELETE',
    }).done(function(){
      button.removeClass('item-remove').addClass('item-add').attr('data-action', 'favorite-add')
    });
  }

  var init = function() {

    template = $("#meetup-template").html();
    $events = $("#events");
    $topic = $("#topic");
    $events.on('click', 'i[data-action=favorite-add]', addFavorite);
    $events.on('click', 'i[data-action=favorite-remove]', removeFavorite);
    $("#search-button").on("click", showEvents);
    $("#get-favorites-button").on("click", showFavorites);
    showEvents();
  };

  $(init);

})($, Mustache);
