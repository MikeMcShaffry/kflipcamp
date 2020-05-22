$(function() {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November","December"
    ];


    const dowNames = [
        "SUN", "GTFO", "TUE",
        "WED", "THU", "FRI",
        "SAT"
    ];

    //
    // Event box toggle
    //
    $('.event-list').find('.event').click(function () {
       var clickOnMe = $(this).next().hasClass('open');
       if (!clickOnMe) {
           $('.event-list').find('.openEv').removeClass('open');
       }
       $(this).next().toggleClass('open');
   });


    // Initialize variables
    var $eventList = $(".event-calendar");   // Google calender event-list
    var $listeners = $(".title-bar .count");
    var $currentDj = $(".title-bar .dj");
    var $phone = $(".title-bar .phone");
    var $albumimage = $(".albumimage");
    var $livelinkarea = $(".livelinkarea");
    var $livelink = $(".livelinkarea a");

    // Prompt for setting a username

    let kflipListeners = 0;
    let shoutingFireListeners = 0;
    let whichStreamIsBroadcasting = null;                // Typically KFLIP broadcasts the otto stream, which is stream 1

    var socket = io();


  // Adds the visual chat message to the message list
  const addEvent = (event) => {

      /* For each event, we want to add something like this:
     
          <a href="#" class="event">
              <div class="event-container">
                  <span class="date-container">
                      <span class="date">06<span class="month">Diciembre</span></span>
                      <span class="dia">TUE</span>
                  </span>
                  <span class="detail-container">
                      <span class="title">Los días de diciembre</span>
                      <span class="description">Pequeña descripción del evento</span>

                  </span>
                  </span>
              </div>
          </a>
          <div class='openEv'>
              <span><b>Dia:</b> 06 de Diciembre, 2015</br><b>Hora:</b> 20:30 hrs</br><b>Lugar:</b> Constitución, CL</br><b>Descripción:</b> Tocata Show: Super Buena es una actividad al aire libre con plena disposición de droga.</span>
          </div>
          <div class="spacer"></div>
     */

      var startDate = new Date(event.start.dateTime);
      var endDate = new Date(event.end.dateTime);

      var $a = $('<a href="#" class="event"/>');
      var $eventContainer = $('<div class="flipside-event-container"/>');
      $a.append($eventContainer);

      var $dateContainer = $('<span class="date-container"/>');
      $eventContainer.append($dateContainer);

      var $date = $('<span class="date"/>')
          .text(startDate.getDate());
      var $month = $('<span class="month"/>')
          .text(monthNames[startDate.getMonth()]);
      var $dia = $('<span class="dia"/>')
          .text(dowNames[startDate.getDay()]);

      $date.append($month);
      $dateContainer.append($date);
      $dateContainer.append($dia);


      var $detailContainer = $('<span class="detail-container"/>');
      $eventContainer.append($detailContainer);

      var $title = $('<span class="title"/>')
          .text(event.summary);
      $detailContainer.append($title);

      var localStart = moment(startDate).local();
      var localEnd = moment(endDate).local();
      var $description = $('<span class="description"/>')
          .text(localStart.format('hh:mm a') + ' - ' + localEnd.format('hh:mm a'));
      $detailContainer.append($description);

      var $spacer = $('<div class="spacer"/>');
      $eventContainer.append($spacer);

      $eventList.append($a);

      if (event.description) {
          var $openEv = $('<div class="openEv"/>')
              .text(event.description);
          $eventList.append($openEv);

          var $clickForDetails = $('<span class="click-for-details"/>')
              .text('details...');
          $detailContainer.append($clickForDetails);
      }

      $eventList.append($spacer);

      $a.click(function() {
          var clickOnMe = $(this).next().hasClass('open');
          if (!clickOnMe) {
              $('.event-calendar').find('.openEv').removeClass('open');
          }
          $(this).next().toggleClass('open');
      });

  };


    const updateSchedule = (data, options) => {
        var schedule = JSON.parse(data.message);

        // if the data is malformed just ignore it
        if (!schedule ||
            !schedule.data ||
            !schedule.data.items) {
            console.log('There was some malformed data in the schedule message');
            return;
        }

        $eventList.empty();

        schedule.data.items.forEach(function(event) {
            addEvent(event);
        });

        //$eventList[0].scrollTop = 0;

    };

    const updateListeners = () => {

        let t = '';
        let listeners = kflipListeners; 

        let onShoutingFire = (whichStreamIsBroadcasting &&
            whichStreamIsBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/shoutingfire');
//        if (onShoutingFire) {
//            listeners = shoutingFireListeners;
//        }

        if (listeners === 1) {
            t = "1 Listener";
        } else {
            t = listeners + " Listeners";
        }

        if (onShoutingFire) {
            while (listeners > 50) {
                t += "!";
                listeners -= 30;
            }
        } else {
            while (listeners > 15) {
                t += "!";
                listeners -= 10;
            }
        }

        $listeners.text(t);
    };

  // Socket events



    // Whenever the server emits 'new message', update the chat body
    socket.on('schedule', (data) => {
        updateSchedule(data);
    });

    socket.on('listeners', (data) => {
        kflipListeners = data.count;
        updateListeners();  
    });

    socket.on('shoutingfire', (data) => {
        shoutingFireListeners = data.listeners;
        updateListeners();
    });

    socket.on('newdj', (data) => {
        if (data) {
            setHeaderText(data);
        }
    });


    function setHeaderText(newdj) {

        let dj = newdj;
        let link = '';

        let linkStart = newdj.indexOf('http');
        if (linkStart !== -1) {
            link = newdj.substr(linkStart);
            dj = newdj.substr(0, linkStart - 1);
        }

        if (link) {
            $livelink.attr("href", link);
            $livelinkarea.css({display: "block"});
            $albumimage.css({ display: "none" });
        } else {
            $livelinkarea.css({ display: "none" });
            $albumimage.css({ display: "block" });
        }

        $("head title").text('KFLIP CAMP');

        if (dj !== 'Otto-mation') {
            $currentDj.text(`- LIVE - ${dj}`);
            $("head title").text(`KFLIP CAMP - LIVE - ${dj}`);

        } else if (whichStreamIsBroadcasting && whichStreamIsBroadcasting.listenurl) {

            if (whichStreamIsBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/kflip') {
                $currentDj.text('- A Human DJ is LIVE!');
            } else if (whichStreamIsBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/kflip_auto') {
                $currentDj.text('- on Otto-mation');
            } else if (whichStreamIsBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/shoutingfire') {
                $currentDj.text('- on SHOUTINGFIRE!');
            }
        }
    }


    socket.on('phone',
        (data) => {
            if (data) {
                setPhoneText(data);
            }
        });

    function setPhoneText(data) {
        if (data.displayed === false) {
            $phone.text('');
        } else {
            $phone.text(data.number);
        }
    }


    socket.on('nowplaying', (data) => {
        if (!data.stream) {
            $currentDj.text(" - OFF AIR");
            whichStreamIsBroadcasting = null;
            updateListeners();
        } else {

            let mustUpdateListeners = false;

            if (whichStreamIsBroadcasting &&
                data.stream &&
                whichStreamIsBroadcasting.listenurl !== data.stream.listenurl) {
                mustUpdateListeners = true;
            }

            whichStreamIsBroadcasting = data.stream;

            if (mustUpdateListeners) {
                setHeaderText('Otto-mation');
                updateListeners();
            }

        }
    });


  socket.on('albuminfo',
    (data) => {

        console.log(`New album information received - image ${data.message.image}`);
        if ($albumimage.length > 0) {
            $albumimage.attr("src", data.message.image);
        }

  });

  socket.on('disconnect', () => {

  });

  socket.on('reconnect', () => {

  });


  socket.on('reconnect_error', () => {

  });

});
