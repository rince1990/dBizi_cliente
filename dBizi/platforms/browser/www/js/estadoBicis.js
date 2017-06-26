$(document).ready(function(){
var estadoBicis;

  $.ajax({
    url: 'http://ec2-35-176-101-5.eu-west-2.compute.amazonaws.com/index.php/Datos/publicarEstadoBicis',
    type: 'POST',

    data: {},
    dataType: 'json',
    error: function(jqXHR, text_status, strError) {
      Materialize.toast('No ha sido posible conectarse, intentelo de nuevo más tarde', 3000);
    },
    timeout: 60000,
    success: function(data) {

      estadoBicis =data;
        $('#preloader').remove();
        $('#send-btn').removeClass("disabled");

    }
  });


  $('#send-btn').click(function(){
    var numeroEscogido = $('#numberBici').val();

    var datosBici = $.grep(estadoBicis, function(element, index){ return element.numeroBici == numeroEscogido; });
    console.log(datosBici);
    $("#tablaBodyDatos").empty();

    for (var i=0;i<datosBici.length;i++){
      $('#tablaDatos > tbody:last-child').append(
              '<tr>'// need to change closing tag to an opening `<tr>` tag.
              +'<td>'+datosBici[i].posted+'</td>'
              +'<td>'+datosBici[i].estadoBici+'</td>'
              +'<td>'+datosBici[i].informacionBici+'</td>'
              +'</tr>');
    }

  });

});
