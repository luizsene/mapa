var geocoder;
var map;
var marker;


function initialize() {

	var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
	var options = {
		zoom: 14,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("mapa"), options);

	geocoder = new google.maps.Geocoder();

	marker = new google.maps.Marker({
		map: map,
		draggable: true,
	});

	marker.setPosition(latlng);
}

$(document).ready(function () {

	//initialize();

	function carregarNoMapa(endereco) {
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {

					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					//$('#txtEndereco').val(results[0].formatted_address);
					//$('#txtEndereco').val('');
					//$('#txtLatitude').val(latitude);
                   	//$('#txtLongitude').val(longitude);

					var location = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(location);
					map.setCenter(location);
					map.setZoom(16);
				}
			}
		})
	}

	$("#btnEndereco").click(function() {
		if($(this).val() != "")
			carregarNoMapa($("#txtEndereco").val());
	})

	$("#txtEndereco").blur(function() {
		if($(this).val() != "")
			carregarNoMapa($(this).val());
	})

	google.maps.event.addListener(marker, 'drag', function () {
		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {

				if (results[0]) {

					$('#txtLatitude').val(marker.getPosition().lat());
					$('#txtLongitude').val(marker.getPosition().lng())
					$("#txtNome").val(ui.item.nome);
					$('#txtEndereco').val(results[0].formatted_address);

				}
			}
		});
	});

	$("#txtEndereco").autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {

				$("#txtLatitude").val(item.geometry.location.lat());
				$("#txtLongitude").val(item.geometry.location.lng());

				var oc = {
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng(),
              descricao: (item.description) ? item.description : null,
              nivel_pais: (item.address_components[item.address_components.length - 1]) ? item.address_components[item.address_components.length - 1].short_name : null,
              nivel_estado: (item.address_components[item.address_components.length - 2]) ? item.address_components[item.address_components.length - 2].long_name : null,
              nivel_cidade: (item.address_components[item.address_components.length - 3]) ? item.address_components[item.address_components.length - 3].short_name : null,
              nivel_rua: (item.address_components[item.address_components.length - 4]) ? item.address_components[item.address_components.length - 4].short_name : null,
              nivel_local: (item.address_components[item.address_components.length - 5]) ? item.address_components[item.address_components.length - 5].short_name : null
            }

				var nome = '';//(item.address_components[item.address_components.length - 3].short_name)+"-"+(item.address_components[item.address_components.length - 2].short_name);
					return {
						 label: item.formatted_address, /*SÓ DESCOMENTAR QUE VOLTA APARECER O ENDEREÇO COMPLETO*/
						 value: item.formatted_address, /*SÓ DESCOMENTAR QUE VOLTA A SELECIONAR O ENDEREÇO COMPLETO*/
						//label: oc.nivel_cidade + " - " + oc.nivel_estado,
						//value: oc.nivel_cidade + " - " + oc.nivel_estado,
						nome: nome,
						latitude: item.geometry.location.lat(),
    				longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function (event, ui) {
			$("#txtLatitude").val(ui.item.latitude);
    		$("#txtLongitude").val(ui.item.longitude);

			$("#txtNome").val(ui.item.nome);

			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(16);
		}
	});

	/*$("form").submit(function(event) {
		event.preventDefault();

		var endereco = $("#txtEndereco").val();
		var latitude = $("#txtLatitude").val();
		var longitude = $("#txtLongitude").val();

		alert("Endereço: " + endereco + "\nLatitude: " + latitude + "\nLongitude: " + longitude);
	});*/

});
