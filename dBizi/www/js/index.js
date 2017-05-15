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
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
  initialize(position.coords.latitude, position.coords.longitude);
}

function onError(error) {
  alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}



var map;
var myLatlng;


function initialize(lat, long) {
  myLatlng = new google.maps.LatLng(lat, long);
  var mapOptions = {
    zoom: 13,
    center: myLatlng
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  //muestra donde esta el usuario en el mapa
  var markerUser = new google.maps.Marker({
    position: myLatlng,
    map: map,
    label: "1",
    //TODO  Change url image to locally
    icon: 'https://image.ibb.co/dxZFkk/persona.png',
  });

  //TODO cambiar estos datos por reales
  var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h3>Ayuntamiento</h3>' +
    '<div id="bodyContent">' +
    '<p><b>8 bicicletas disponibles</b></p>' +
    '<p><b>7 bases libres</b></p>' +
    '</div>' +
    '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });


  //obtiene todos las estaciones de servicio actuales
  $.ajax({
    url: 'http://dbizi.esy.es/respuesta.php',
    type: 'POST',
    data: {
      "query": "markers"
    },
    dataType: 'json',
    error: function(jqXHR, text_status, strError) {
      alert("no connection");
    },
    timeout: 60000,
    success: function(data) {
      $.each(data, function(index, element) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(element.lat, element.long),
          map: map,
          //TODO  Change url image to locally
          icon: 'https://image.ibb.co/eUnwrQ/rsz_536_200.png',
          label: element.numero,
          title: element.nombre
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });


      });
    }
  });

}

/* MENU LATERAL */
var estado = "cuerpo";

$('#cuerpo').click(function(e) {
  if (estado == "menu") {
    document.getElementById("cuerpo").className = 'page transition center';
    estado = "cuerpo";

  }
});

function menu() {
  document.getElementById("cuerpo").className = 'page transition right';
  estado = "menu";
  console.log("desplazado");

}

/* MENU LATERAL */
