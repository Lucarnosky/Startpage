// TimeLine variable for the storage of each timeline
var tlLoading, tlDisplay;
// Terminals variable for the focus
var mainT;
// Soundcloud variables for a) the music player b) the user (connected) c) the current music played
var scPlayer = null;
var scMe = null;
var scCurr = null;


// Init function called at the end of the loading of each components
function init() {

  // Background managment with the plugin backstretch
  // Get 1 images from the var.js array of images for the background
  $("body").backstretch("images/" + images[Math.round(Math.random() * (images.length - 1))], { fade: 300 });

  // Scroll managment for each pannel (smarter screen and after insert of multiple cff informations)
  // Use the plugin mCustomScrollbar.jquery.min.js
  $(".left-pannel, .mid-pannel, .right-pannel").mCustomScrollbar({
    scrollInertia: 300
  });

  // Call of all the function init of each components and size adapter
  initGreetings();
  initWeather();
  initTimeLines();
  initTerminal();
  initSearch();
  initFavorites();
  initRss();
  initSize();

  // Play the loading animation
  tlLoading.play();

  // If all the images are loaded, pause the animation of the loading and call the display timeline
  $("img").on('load', function () {
    tlLoading.pause();
    tlDisplay.play();
  })
  // Old code for the display of the loading animation
  // setTimeout(function() {
  //
  // }, 1210);
}

function initRss() {

  $(feeds).each(function (index, feed) {
    console.log(feed);
    $('#rss-board').append("<p>" + feed[0] + "</p>");
    $('#rss-board').append("<div id='" + index + "'></div>");
    console.log($("#" + index).length);
    $('#rss-board #' + index).FeedEk({
      FeedUrl: feed[1],
      MaxCount: 5,
      DateFormat: 'L',
      DateFormatLang: 'it'
    });
  });
}

// Terminal initialisation
function initTerminal() {
  // Init the terminal with each function available
  mainT = $('.terminal-term.main #main').terminal({
    // Favorite function: f <arg> to open in new tab the favorite
    "f": function (arg1) {
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < favorites[i][1].length; j++) {
          if (arg1 == favorites[i][1][j][2]) {
            var win = window.open(favorites[i][1][j][1], '_blank');
          }
        }
      }
    },
    // CFF part of the terminal
    "cff": {
      // Get the connections for the passed variable of the CFF terminal
      // travel <from> <to> <time> <date>
      "travel": function (fromLocation, toLocation, time, date) {

        var term = this;

        if (date == undefined) date = cffDate();
        if (time == undefined) time = cffTime();

        $.get("http://transport.opendata.ch/v1/connections?from=" + fromLocation + "&to=" + toLocation + "&date=" + date + "&time=" + time,
          function (data) {
            createCFFdata(data);
          });
      },
      // Reset the CFF informations and empty it
      "reset": function () {
        new TimelineMax({ onComplete: function () { $(".informations.cff").remove(); } })
          .to($(".informations.cff"), .2, {
            height: 0,
            autoAlpha: 0
          })
          .timeScale(.5);
      },
      // Display the help for the CFF part
      "help": function () {
        this.echo("\n");
        this.error("travel <from> <to> <?time> <?date>"); this.echo("display the train informations"); this.echo("\n");
        this.error("reset"); this.echo("clean the cff informations"); this.echo("\n");
        this.error("main"); this.echo("goto main terminal"); this.echo("\n");
        this.error("sc"); this.echo("goto soundcloud terminal"); this.echo("\n");
        this.error("cff"); this.echo("goto cff terminal"); this.echo("\n");
        this.echo("\n");
        this.echo("to quit the cff function press CTRL+D");
        this.echo("\n");
      }
    },
    // Help for the terminal
    "help": function () {
      this.echo("\n");
      this.error("f <shortcut>"); this.echo("open the favorites in a new tab"); this.echo("\n");
      this.error("main"); this.echo("goto main terminal"); this.echo("\n");
      this.error("cff"); this.echo("goto cff terminal"); this.echo("\n");
      this.error("img"); this.echo("search image with google images"); this.echo("\n");
      this.echo("\n");
    },
    "img":function(arg1){
      this.echo("\n");
      var win = window.open("https://www.google.it/search?tbm=isch&q="+arg1, '_blank');
    }
  }, {
    greetings: 'Welcome ' + username,
    name: 'main',
    height: 0,
    prompt: username + '@homepage:~$ '
  });
}

// Set the username and call the clock function for the greetings
function initGreetings() {
  $(".greetings-helloworld .greetings-name").html(username);

  initClock();
}

// Init the weather part and add the weather options
function initWeather() {
  locations.forEach(function (i, e) {
    $.ajax({
      url:'http://api.openweathermap.org/data/2.5/weather?q=Tortona&lang=it&units=metric&appid=e539297397a38a23572a161e96f34f7b',
      success: function (weather) {
        console.log(weather);
        var weatherObj = '<p class="weather" id="' + locations[e] + '">' +
          '<span class="weather-location"></span><br>' +
          '<span class="weather-icon"></span>' +
          '<span class="weather-temperature"></span> <br>' +
          '<span class="weather-description"></span>' +
          '</p>';

        $("#weather-board").append(weatherObj);
        $("#" + locations[e] + " .weather-location").html(weather.name);
        $("#" + locations[e] + " .weather-icon").html('<i class="icon-' + weather.cod + '"></i>');
        $("#" + locations[e] + " .weather-temperature").html(Math.round(weather.main.feels_like) + '&deg; C');
        $("#" + locations[e] + " .weather-description").html(weather.weather[0].description);
      },
      error: function (error) {
        $("#" + locations[e] + "").html('<p>' + error + '</p>');
      }
    });
  });
}

// Animations initialization
function initTimeLines() {
  tlLoading = new TimelineMax({
    repeat: -1
  })
    .from($(".s1"), .4, {
      rotation: "-=180"
    }, "#1")
    .from($(".s2"), .5, {
      rotation: "-=180"
    }, "#1")
    .from($(".s3"), .6, {
      rotation: "-=180"
    }, "#1")
    .from($(".s4"), .7, {
      rotation: "-=180"
    }, "#1")
    .pause();

  tlDisplay = new TimelineMax()
    .to($(".squares"), .2, {
      autoAlpha: 0
    })
    .to($(".squares"), .05, {
      height: 0
    }, "#1")
    .from($(".image"), .2, {
      height: 0
    }, "#1")
    .from($(".image"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .to($(".image"), 0, {
      height: "auto"
    })
    .from($("#greetings-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .from($("#weather-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .from($("#search-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .from($("#favorites-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .from($("#terminal-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    }, "#2")
    .from($("#tabs"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    }, "#2")
    .from($("#rss-board"), .2, {
      autoAlpha: 0,
      marginLeft: "-20"
    })
    .timeScale(1.2)
    .pause();
}

// Clock display
function initClock() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10)
    dd = '0' + dd
  if (mm < 10)
    mm = '0' + mm
  if (h < 10)
    h = '0' + h
  if (m < 10)
    m = '0' + m
  if (s < 10)
    s = '0' + s

  $(".time-hours").html(h);
  $(".time-minutes").html(m);
  $(".time-seconds").html(s);
  $(".date-day").html(dd);
  $(".date-month").html(mm);
  $(".date-year").html(yyyy);

  if (h < 12) {
    $(".greetings-title").html("Buon Giorno");
  } else if (h >= 12 && h < 19) {
    $(".greetings-title").html("Buon Pomeriggio");
  } else {
    $(".greetings-title").html("Buona Sera");
  }

  var t = setTimeout(initClock, 500);
}

// Size update of the app
function initSize() {

  $(".mid-pannel, .left-pannel, .right-pannel").height(document.body.clientHeight - 20);


  var mxHeight = 0;
  $("#favorites-board .favorite").each(function (index, elem) {
    if (mxHeight <= $(elem).height())
      mxHeight = $(elem).height();
  });
  $("#favorites-board .favorite").height(mxHeight);
}

// On ready magueule
$(document).ready(function () {
  init();
  setTimeout(function () {
    initSize();
  }, 2500)
});

// For each resize
$(window).resize(function () {
  initSize();
})
