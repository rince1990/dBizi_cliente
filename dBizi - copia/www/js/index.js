var estaciones;
var app = {

  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  $('#debug').text("device ready");
  //TODO instalar cordova.plugins diagnotics para decirle al usuario que active el gps
  /*cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
    $('#debug').text("GPS location is " + (enabled ? "enabled" : "disabled"));
}, function(error){
    $('#debug').text("The following error occurred: "+error);
});*/
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
  $('#debug').text("success");
  initialize(position.coords.latitude, position.coords.longitude);
}

function onError(error) {
  $('#debug').text("error");
  alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}



var map;
var myLatlng;


function initialize(lat, long) {
  $('#preloader').hide()
  myLatlng = new google.maps.LatLng(lat, long);
  var mapOptions = {
    zoom: 13,
    center: myLatlng
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var infowindow = new google.maps.InfoWindow();

  //muestra donde esta el usuario en el mapa
  var markerUser = new google.maps.Marker({
    position: myLatlng,
    map: map,
    label: "1",
    //TODO  Change url image to locally
    icon: 'https://image.ibb.co/dxZFkk/persona.png',
  });


  //obtiene todos las estaciones de servicio actuales
  $.ajax({
    url: 'http://dbizi.esy.es/index.php/datos/publicarDatos',
    type: 'POST',
    data: {},
    dataType: 'json',
    error: function(jqXHR, text_status, strError) {
      alert("no connection");
    },
    timeout: 60000,
    success: function(data) {
      estaciones = data;
      var estacionCercana = {distancia:Number.MAX_SAFE_INTEGER, nombre:"", bicis:0, bases:0};

      $.each(estaciones, function(index, estacion) {
        //ponemos el marcador de la estacion
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(estacion.latitude, estacion.longitude),
          map: map,
          //TODO  Change url image to locally
          icon: 'https://image.ibb.co/eUnwrQ/rsz_536_200.png',
          //label: element.number,
          title: estacion.name
        });

        //Creamos el infowindow
        var contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h3>' + estacion.name + '</h3>' +
          '<div id="bodyContent">' +
          '<p><b>' + estacion.locked + ' bicicletas disponibles</b></p>' +
          '<p><b>' + estacion.free + ' bases libres</b></p>' +
          '</div>' +
          '</div>';


        marker.addListener('click', function() {
          infowindow.setContent(contentString);
          infowindow.open(map, marker);
        });


        //calculamos la estacion más cercana
        43.313688, -1.956075
        //var distancia= getDistanceFromLatLonInKm(lat,long,estacion.latitude,estacion.longitude);
        var distancia= getDistanceFromLatLonInKm(lat,long,estacion.latitude,estacion.longitude);
        if(distancia < estacionCercana.distancia){
          estacionCercana.distancia = distancia;
          estacionCercana.nombre = estacion.name;
          estacionCercana.bicis = estacion.locked;
          estacionCercana.bases = estacion.free;
        }

      });

      $('#nombreCercana').text(estacionCercana.nombre);
      if(estacionCercana.distancia > 1){//mostrar en km si supera el kilometro
        $('#metrosCercana').text("A " + estacionCercana.distancia.toFixed(2) + " kilometros de distancia");
      }else {
        $('#metrosCercana').text("A " + Math.round(estacionCercana.distancia*1000) + " metros de distancia");
      }
      $('#bicisCercana').text(estacionCercana.bicis+ " bicis disponibles");
      $('#basesCercana').text(estacionCercana.bases+ " bases disponibles");

    }
  });





}

/* MENU LATERAL */




function menu() {
      document.getElementById("cuerpo").className = 'page transition right';
        //$('#menubtn').hide();
        $("#cuerpo").css({"border-left": "2px solid black"});

  }

  $('#cuerpo').click(function(e) {

      document.getElementById("cuerpo").className = 'page transition centered';
      //$('#menubtn').show();
      $("#cuerpo").css({"border-left": ""});
  });

/* MENU LATERAL */


//obtiene la distancia entre 2 puntos cartesianos mediante la formula Haversina
//https://en.wikipedia.org/wiki/Haversine_formula
//source: https://goo.gl/y0Jyro
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
