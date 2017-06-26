$(document).ready(function(){
	//create a new WebSocket object.
	var wsUri = "ws://ec2-35-176-101-5.eu-west-2.compute.amazonaws.com:9000/chat/server.php";
	websocket = new WebSocket(wsUri);
	$('select').material_select();

	websocket.onopen = function(ev) { // connection is open
		$('#preloaderChat').remove();
		$('#sendReport-btn').removeClass("disabled")
		$('#send-btn').removeClass("disabled")
	}

	$('#send-btn').click(function(){ //use clicks message send button
		var mymessage = $('#message').val(); //get message text
		var myname = $('#name').val(); //get user name

		if(myname == ""){ //empty name?

			Materialize.toast('Escribe un nombre', 3000);
			document.getElementById("name").focus();
			return;
		}
		if(mymessage == ""){ //emtpy message?
			Materialize.toast('Escribe un mensaje', 3000);
			document.getElementById("message").focus();
			return;
		}
		document.getElementById("input-name").style.visibility = "hidden";


		var objDiv = document.getElementById("message_box");
		objDiv.scrollTop = objDiv.scrollHeight;
		//prepare json data
		var msg = {
		type : "userMessage",
		message: mymessage,
		name: myname,
		color : '2196f3' //TODO ESTE COLOR ALEATORIO
		};
		//convert and send data to server
		websocket.send(JSON.stringify(msg));
		$('#message').val(''); //reset text
	});

	$('#sendReport-btn').click(function(){ //use clicks message send button


		var myname = $('#name').val();
		var numeroBici = $('#numberBici').val();
		var estadoBici = $( "#estadoBici option:selected" ).text();
		var informacionBici = $('#infoBici').val();

		if(myname == ""){ //empty name?

			Materialize.toast('Escribe tu nombre en el chat primero', 3000);
			$( "#chatTab" ).trigger( "click" );
			document.getElementById("name").focus();
			return;
		}
		if(numeroBici == "" || estadoBici == ""){ //emtpy message?
			Materialize.toast('rellena los campos obligatorios', 3000);
			return;
		}
		document.getElementById("input-name").style.visibility = "hidden";


		var objDiv = document.getElementById("message_box");
		objDiv.scrollTop = objDiv.scrollHeight;
		//prepare json data
		var msg = {
		type : "report",
		numeroBici: numeroBici,
		estadoBici : estadoBici,
		informacionBici : informacionBici,
		name: myname,
		};
		//convert and send data to server
		websocket.send(JSON.stringify(msg));
		$( "#chatTab" ).trigger( "click" );

	});

	//#### Message received from server?
	websocket.onmessage = function(ev) {
		var msg = JSON.parse(ev.data); //PHP sends Json data
		var type = msg.type; //message type
		var umsg = msg.message; //message text
		var uname = msg.name; //user name
		var ucolor = msg.color; //color

		if(type == 'usermsg')
		{
			var posted = msg.posted;
			var postedDay = posted.substring(8,10);
			var postedMonth = posted.substring(5,7);
			var postedHour = posted.substring(11,16);
			var showedDate = postedDay+"/"+postedMonth+" "+postedHour;
			$('#message_box').append("<div><span class=\"user_name\" style=\"color:#"+ucolor+"\">("+showedDate+")"+uname+"</span> : <span class=\"user_message\">"+umsg+"</span></div>");
		}
		if(type == 'system')
		{
			$('#message_box').append("<div class=\"system_msg\">"+umsg+"</div>");
		}


		var objDiv = document.getElementById("message_box");
		objDiv.scrollTop = objDiv.scrollHeight;
	};

	websocket.onerror	= function(ev){$('#message_box').append("<div class=\"system_error\">Ha ocurrido un error - "+ev.data+"</div>");};
	websocket.onclose 	= function(ev){$('#message_box').append("<div class=\"system_msg\">Conexión cerrada</div>");};
});
