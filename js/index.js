/**
 * Utility functions to check if the oucu If the oucuField is left empty or a value is incorrent
 * @param {type} fieldId
 * @param {type} defaultValue
 * @returns {jQuery}
 */
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
function isNumber(str) {
    return str.length === 1 && str.match(/[0-9]/);
}

// Validate the OUCU starts with a letter and ends with a number
function getOucu(oucuField){
	var value = $('#' + oucuField).val();
        if (!(isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)))) {
            alert("Please enter the correct OUCU number");
            return "";
        }
   
	    return value;
}
		
//Alert a user if a field input is empty
function get_name_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
       alert("Please enter all order details");
    }
    return value;
}

//Alert a user if a agreedPrice field input is empty
function get_amount(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
       alert("Please enter the widget price");
    }
    return value;
}

//Alert a user if a field input is empty
function get_number(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
       alert("Please enter number of widgets");
    }
    return value;
}

//Alert a user if a clientID input is empty
function get_client(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
       alert("Please enter the Client ID");
    }
    return value;
}
/**
 * Main class
 */
var app = {
    initialize: function() {
        this.bindEvents();
    },
	
	// Prepare the device ready before trying to show map
    bindEvents: function() {
             document.addEventListener('deviceready', this.onDeviceReady, false); 
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
		console.log(navigator.notification); 
    },

	// Update DOM on receivedEvent
    receivedEvent: function (id) {
        function MegaMaxSale() {
            

		// global variables 
		var counter = 0;
		var currentWidgetId;
		var clientId;
		var orderLatitude;
		var orderLongitude;
		var currentDate;
		var currentOrderId;
		var widgetPrice;
		var clientAddress;
		
	   /**
		* Display the image, description and price of  the first widget initially 
		*/
		function displayWidgetInitially(){
			var img = document.getElementById('widgetImage');
			img.src = 'http://137.108.93.222/openstack/images/widget1.jpg'; 
			var widgetOneDescription = document.getElementById('description').innerHTML = "Brass Self-Tapping Wood Screw 20mm";
			var widgetOnePrice = document.getElementById('agreedPrice').value = "10";
			currentWidgetId = 8;
			var oucu = document.getElementById('oucu').value = "zy235806";
			var oucu = document.getElementById('numberOfWidgets').value = "2";
			var oucu = document.getElementById('clientID').value = "102";
		} 
		 
		var map;		 
		/**
		 * Display the map initially set to the location of the user
		 */
        function displayMapInitially() {
            var onSuccess = function(position) {
				var div = document.getElementById("mapCanvas");
				div.width = window.innerWidth-20;
				div.height = window.innerHeight*0.8-40;
				map = plugin.google.maps.Map.getMap(div);
				map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady, false);     
				function onMapReady() {                                                 
					plugin.google.maps.Map.setDiv(div);                                      
					var currentLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					// Add a marker on the map at the current location of the user
					map.addMarker({
						'position': currentLocation,
						'title': "Your current location"
					}, function (marker) {
						marker.showInfoWindow();
					});
					map.setCenter(currentLocation);
					map.setZoom(15);
					map.refreshLayout();
					map.setVisible(true);
                }                                                                       
			  };
            var onError = function(error) {
               alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
             };
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});        
         }
		  
		  
		/**
          * Display the Map location according to the location of the current sale
          * 
          */
        function updateOrderMap(sAddress) {
			alert('step 1');
			map.clear();
			var currentOrderAddress = sAddress;
            var onSuccess = function(position) {
                var div = document.getElementById("mapCanvas");
                div.width = window.innerWidth-20;
                div.height = window.innerHeight*0.8-40;
                if (currentOrderAddress != undefined) {
						/* Get details of the salesperson location of the matched taxi hiring
						* from the RESTful web service
						*/
						$.get('http://nominatim.openstreetmap.org/search/<' + currentOrderAddress + '>?format=json&countrycode=gb', 
							callbackOneFuncWithData);
						// Callback function to extract longitute and lattitude for the address
						function callbackOneFuncWithData(data){
						// Get all longitutes and lattitudes of the address
							for (var i=0; i<data.length; i++) {
								var counter = data[0];
								var saleOneLat = counter.lat;
								var saleOneLon = counter.lon;
								// Use the longitudes and lattitudes of the address to update the map 
								var saleOneLoc = new plugin.google.maps.LatLng(saleOneLat, saleOneLon);
								// Add a marker on the map for the address of the address on the map 
								map.addMarker({
								'position': {lat: saleOneLat, lng: saleOneLon},
								'title': "Order's location",
								'icon': 'blue'
								}, function (marker) {
								marker.showInfoWindow();
								});
								// Set the map to show the address
								map.setCenter(saleOneLoc);
								map.setZoom(15);
								map.refreshLayout();
								map.setVisible(true);
							}
							
						}
					}
				  //}
            };
            var onError = function(error) {
              alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});       
          }
		  

		/**
          * Display the Map location according to the location of the current sale and today's orders
          * 
          */
        function showSaleLocation(todayClientsAddresses, currentClient) {
			var currentAddress = currentClient;
			var addresses = todayClientsAddresses;
			var onSuccess = function(position) {
                var div = document.getElementById("mapCanvas");
                div.width = window.innerWidth-20;
                div.height = window.innerHeight*0.8-40;
                map = plugin.google.maps.Map.getMap(div);                        
                map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady, false);     
                function onMapReady() {                                                
					plugin.google.maps.Map.setDiv(div);                                      
					var currentCustomerLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					if (currentAddress != undefined) {
						/* Get details of the location of the current location of the salesperson
						 * from the RESTful web service 
						 */
						$.get('http://nominatim.openstreetmap.org/search/<' + currentAddress + '>?format=json&countrycode=gb', 
							callbackFuncWithData);
						// Callback function to extract longitute and lattitude for the address
						function callbackFuncWithData(data){
						// Get all longitutes, lattitudes and names of the addresses
							for (var i=0; i<data.length; i++) {
								var counter = data[0];
								var saleLat = counter.lat;
								var saleLon = counter.lon;
								// Use the longitudes and lattitudes of the addresses to update the map 
								var saleLoc = new plugin.google.maps.LatLng(saleLat, saleLon);
								// Add a marker on the map for the address of a salesperson location on the map 
								map.addMarker({
								'position': {lat: saleLat, lng: saleLon},
								'title': "Current client location"
								}, function (marker) {
								marker.showInfoWindow();
								});
								// Set the map to show matched addresses
								map.setCenter(saleLoc);
								map.setZoom(15);
								map.refreshLayout();
								map.setVisible(true);
							}	
							// Get today's client addresses from REST web service
							for (var i=0; i<addresses.length; i++) {
								var clientAddress = addresses[i];		
								$.get('http://nominatim.openstreetmap.org/search/<' + clientAddress + '>?format=json&countrycode=gb', 
								callbackAddresses);
								function callbackAddresses(data){	
									for (var j=0; j<data.length; j++) {
										var addressCounter = data[j];
										var addressLat = addressCounter.lat;
										var addressLon = addressCounter.lon;
										// Add markers to show today's sales locations
										map.addMarker({
										'position': {lat: addressLat, lng: addressLon},
										'title': "Order"
										}, function (marker) {
											marker.showInfoWindow();
										});
										map.setCenter(saleLoc);
										map.setZoom(15);
										map.refreshLayout();
										map.setVisible(true);
									}
								}
							}
						}
                    }  							
				 }				  
            };
            var onError = function(error) {
				alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});       
          }
		  
	
	   /**
		* Update the display when the Next and Prev Widget buttons are pressed
		*/
		function updateDisplay(counter){
			// Fetch the salesperson id from the "oucu" input field 
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var currentWidget;
			// Get the widgets details from REST API
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
			// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the widget catalogue');
					} else {
					   /*Update the display with the widget image, description and asking price according 
						*to the number of times Next and Prev Widget buttons has been pressed
						*/
						var img = document.getElementById('widgetImage');
						img.src = obj.data[counter].url;
						var currentWidget = obj.data[counter].id
					    var widgetDescription = document.getElementById('description').innerHTML = obj.data[counter].description;
						widgetPrice = document.getElementById('agreedPrice').value = obj.data[counter].pence_price;	
						currentWidgetId = currentWidget;
				}
			})
		}

					
		/** 
		 *  Navigate the widgets catalogue with Next Widget button 
		 *  and display the widget images, description and asking price.
		 */
		this.nextWidget = function(){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU=' + oucu + '&password=' + oucuPassword,
               function (data) {
			// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the widget catalogue');
					// Counter to count the number of click on the Next Widget button
					} else if (counter<obj.data.length-1){
						counter +=1;
					}
					else{
					counter = 0;
					}
					// Callback function to update the display when the Next Widget button has been pressed
					updateDisplay(counter);	
				}
			 )
		}

		/** 
		 *  Navigate the widgets catalogue with Prev buttons
		 *  and display of widget images, description and asking price
		 */
		this.prevWidget = function(){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			// Get all widgets from REST API
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the widget catalogue');
					// Counter to count the number of click on the Prev Widget button
					} else if (counter>0){
						counter -=1;
					}
					else{
						counter = obj.data.length-1;
					}
				// Callback function to update the display when the Prev Widget button has been pressed
				updateDisplay(counter);	
				}
			 )
		}	


		/**
		 *	Callback function to get today's clients addresses
		 */ 
		function getClientsAddresses(tdateClients, currentSale){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var currentClient = currentSale;
			var todayClients = tdateClients;
			var todayClientsAddresses = [];
			//Get all clients details from REST API
			$.get('http://137.108.93.222/openstack/api/clients/?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the clients details');
						} else {
							// Check if the Id is today's client's Id and get their addresses
							for (var i=0; i<todayClients.length; i++) {
								var todayClientId = todayClients[i];
								for (var j=0; j<obj.data.length; j++) {
									var tdateClient = obj.data[j].id;
									var todayClientAddress = obj.data[j].address;
									if(tdateClient == todayClientId){
										todayClientsAddresses.push(todayClientAddress);
									}
								}
							}
							showSaleLocation(todayClientsAddresses, currentClient);
						}
				}
			)
		}
							
		/**
		*	Callback function to get Ids of clients today's orders
		*/
		function callBackfunctionSales(todaySalesIds, currentSaleAddress){
			var tdateClients = [];
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var todaySales = [];
			var currentSale = currentSaleAddress;
			todaySales = todaySalesIds;
			// Get all orders from REST API
				$.get('http://137.108.93.222/openstack/api/orders?OUCU=' + oucu + '&password=' + oucuPassword,
					function (data) {
					// Parse the string received from the web server into a JavaScript object
						var obj = $.parseJSON(data);
						if (obj.status == "fail" || obj.status == "error") {                
							alert('Attempt failed to access the orders');
						} else 
						{			
							for (var i=0; i<todaySales.length; i++) {
							var tsaledateId = todaySales[i];
							for (var j=0; j<obj.data.length; j++) {
								var tdateId = obj.data[j].id;
								var tdateClient = obj.data[j].client_id;
								var tdateDate = obj.data[j].date;
								// If the order id is one of today's orders add the client Id to tdateClients array
								if(tsaledateId == tdateId){
									tdateClients.push(tdateClient);
								}
							}
						}
					// Callback to get today's clients addresses
					getClientsAddresses(tdateClients, currentSale);
						}
					}
				)
		}
		
		/**
		 *	Callback function to get orders from today
		 */		
		function getTodaySales(currentDate, currentSale){
			var todaySalesIds = [];	
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var currentSaleDate = currentDate;
			var saleAddress = currentSale;
			// Get the year, month and date of today's date
			var today = currentSaleDate.slice(0, 11);
			$.get('http://137.108.93.222/openstack/api/orders?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the orders');
					} else 
					{
					for (var i=0; i<obj.data.length; i++) {
						//If the date of the order is today's date then add it to todaySalesIds array
						var sdate = obj.data[i].date;
						var sDay = sdate.slice(0, 11);
						var ids = obj.data[i].id;
						if(sDay == today){	
							todaySalesIds.push(ids);
						}
					}
				// Callback function to get Ids of clients of today's orders
				callBackfunctionSales(todaySalesIds, saleAddress);
				}
			})
		}

			// global variables 
			var clientName;
			var totalOrder = [];
			var vat;
			var total;
			var subtotal;
			
		/**
		* Start new order and get the current order Id number
		*/
		this.placeNewOrder = function(){
			vat = 0;
			subtotal = 0;
			total = 0;
			document.getElementById("orderDetails").innerHTML = "";
			totalOrder = [];
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			clientId = get_client('clientID');
			// Post the new order details to REST API
			$.post('http://137.108.93.222/openstack/api/orders/',{OUCU: oucu, password: oucuPassword, client_id: clientId
				},function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to start new order for client ' + clientId);
					} else{
						// Update the value of currentOrderId, orderLatitude, orderLongitude and currentDate variable
						currentOrderId = obj.data[0].id;
						orderLatitude = obj.data[0].latitude;
						orderLongitude = obj.data[0].longitude;
						currentDate = obj.data[0].date;	
						var oucu = getOucu('oucu'); 
						var oucuPassword = '';
						// Get the details of the client of the current order
						$.get('http://137.108.93.222/openstack/api/clients/' + clientId + '?OUCU=' + oucu + '&password=' + oucuPassword,
							function (data) {
							// Parse the string received from the web server into a JavaScript object
								var obj = $.parseJSON(data);
								if (obj.status == "fail" || obj.status == "error") {                
									alert('Attempt failed to access the client details' + clientId);
								} else{
								var clientName = obj.data[0].name;
								var saleAddress = obj.data[0].address;	
								// Callback function to get details of today's orders
								getTodaySales(currentDate, saleAddress);
								}
							})
					}
				}
				)
		}
		
		function callbackCurrentLatLon(clientDetails, clientAddress, currentDate, totalOrder, subtotal, vat, total){
					var addressLonLat = clientAddress;
					var currentClientDetails = clientDetails;
					var currentClientDate = currentDate; 
					var currentTotalOrder = totalOrder; 
					var currentSubtotal = subtotal; 
					var currentVat = vat;
					var currentTotal = total;
					var saleAddressLat;
					var saleAddressLon;
					$.get('http://nominatim.openstreetmap.org/search/<' + addressLonLat + '>?format=json&countrycode=gb', 
							callbackAddressFunction);
							// callback function to extract longitute and lattitude for the address
							function callbackAddressFunction(data){
							// Get all longitutes, lattitudes and names of the address
								for (var i=0; i<data.length; i++) {
									var counter = data[0];
									saleAddressLat = counter.lat;
									saleAddressLon = counter.lon;
									alert('saleAddressLat '+ saleAddressLat +' saleAddressLon '+saleAddressLon);							
								}
						// Update the orderDetails field with current order details
							document.getElementById("orderDetails").innerHTML =  "Dear " + currentClientDetails + "<br>" + "<p></p>"
								+ "Your order at " + clientAddress + "<br>" + "on " + currentClientDate + " is:"+"<br>" + "<p></p>"
								+  currentTotalOrder.join("<br>") + "<br>" + "<p></p>"+ "Subtotal:" + currentSubtotal + 
								"<br>" + "VAT: " + currentVat + "<br>"  + "Total: " + currentTotal + "<br>" + "Longitude: " + saleAddressLon 
								+"<br>" + "Latitude: " + saleAddressLat ;								
							}							
		}
		
		

			// global variables 
			var clientDetails;
			var clientAddress;
			
		/**
		 *	Update the orderDisplay field with current order details
		 */
		function updateCurrentOrder(order, listOfOrder, priceOfOrder){
			var myOrder;
			var listOfWidgets = listOfOrder;
			// Change the price of the widget to number
			var orderPrice = parseInt(priceOfOrder);
			var currentClient = clientId;
			var stringList = "'" + listOfWidgets + "'";
			// Add a selected widget to the order when the Add to Order button is pressed
			totalOrder.push(stringList);
			// Calculate subtotal, VAT and total cost of order
			subtotal = subtotal + orderPrice;
			vat = subtotal*20/100;
			total = subtotal + vat;
			longit = orderLongitude;
			latit = orderLatitude;
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			// Get the details of the client of the current order
			$.get('http://137.108.93.222/openstack/api/clients/' + currentClient + '?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
				// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the client details' + currentClient);
					} else{

						clientDetails = obj.data[0].name;
						clientAddress = obj.data[0].address;
						callbackCurrentLatLon(clientDetails, clientAddress, currentDate, totalOrder, subtotal, vat, total);
						
						
					}
				})
		}

		/**
		 *	Add a current widget to a current order
		 */
		this.addToOrder = function(){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			// Get price and number of widgets from the user's input fields
			var amount = get_amount('agreedPrice');
			var numWidgets = get_number('numberOfWidgets');
			var myCurrentOrder = [];
			// Get the current widget and order Id numbers
			var orderId = currentOrderId;
			var widgetId = currentWidgetId;
			// Post the details of the widget to REST API
			$.post('http://137.108.93.222/openstack/api/order_items/',{OUCU: oucu, password: oucuPassword, order_id: orderId, widget_id: widgetId, number: numWidgets, pence_price: amount
				},function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to add order with order id '+ orderId + 'widget id ' + widgetId);
					} else{
						//Calculate the cost of the order
						var finalPrice = amount*numWidgets;
						// Create a string with details of a widget added to the order
						myCurrentOrder = numWidgets + '(widget ' +  widgetId +') x '  + amount + 'GBP  =  ' + finalPrice + 'GBP';
						// Callback function to update the display with order details
						updateCurrentOrder(orderId, myCurrentOrder, finalPrice);	
							}
						}
				)
			}
			
		
			
		/**
		* Callback function to calculate and display orders when a Prev or Next buttons are pressed
		*/
		function updateSaleDisplay(todaysOrder, client, clientAddress, saleAddressLat, saleAddressLon, counterDate, todayWidgetTotal){
				var myOrderTotal = [];
				var mySale;
				var mySubtotal = 0;
				var myVat = 0;
				var myTotal = 0;
				var mylistOfWidgets = todaysOrder;
				var myDate = counterDate;
				// Change the price of the widget to number
				var myOrderPrice = parseInt(todayWidgetTotal);
				var myClient = client;
				var myClientAddressLat = saleAddressLat;
				var myClientAddressLon = saleAddressLon;
				alert( 'saleAddressLat '+saleAddressLat +' saleAddressLon '+saleAddressLon+'  myClientAddressLat '+ myClientAddressLat +' myClientAddressLon '+myClientAddressLon);
				var myClientAddress = clientAddress;
				var myList = "'" + mylistOfWidgets + "'";
				// Add a selected widget to the order when the Add to Order button is pressed
				myOrderTotal.push(myList);
				// Calculate subtotal, VAT and total cost of order
				mySubtotal = mySubtotal + myOrderPrice;
				myVat = mySubtotal*20/100;
				myTotal = mySubtotal + myVat;		
				// Update the orderDetails field with current order details
				document.getElementById("orderDetails").innerHTML =  "An Order placed by " + myClient + "<br>" + "<p></p>"
								+ " at " + myClientAddress + "<br>" + "on " + myDate + " is:"+"<br>" + "<p></p>"
								+  myOrderTotal.join("<br>") + "<br>" + "<p></p>"+ "Subtotal:" + mySubtotal + 
								"<br>" + "VAT: " + myVat + "<br>"  + "Total: " + myTotal + "<br>" 
								+ "Longitude: " + myClientAddressLon  
								+"<br>" + "Latitude: " + myClientAddressLat ;
				updateOrderMap(myClientAddress);
				
			}	

		function CallBackFunctionLonLat(todaysOrder, client, clientAddress, counterDate, todayWidgetTotal){
					var saleAddressLat;
					var saleAddressLon;
					var orderLatLon = todaysOrder;
					var clientLatLon = client;
					var addressLonLat = clientAddress;
					var counterLonLat = counterDate;
					var totalLatLon = todayWidgetTotal;
					$.get('http://nominatim.openstreetmap.org/search/<' + addressLonLat + '>?format=json&countrycode=gb', 
							callbackAddressFunction);
							// Callback function to extract longitute and lattitude for the address
							function callbackAddressFunction(data){
							// Get all longitutes, lattitudes and names of the address
								for (var i=0; i<data.length; i++) {
									var counter = data[0];
									saleAddressLat = counter.lat;
									saleAddressLon = counter.lon;
									alert('saleAddressLat '+ saleAddressLat +' saleAddressLon '+saleAddressLon);							
								}
									updateSaleDisplay(orderLatLon, clientLatLon, addressLonLat, saleAddressLat, saleAddressLon, counterLonLat, totalLatLon);			
							}
								
								
		}
			

		// Global variable
		var todayDates = [];
		
	   /**
		* Callback function to calculate and display orders when a Prev or Next buttons are pressed
		*/
		function calculateSales(salesCount, todaySaleId){
			alert('calculateSales ');
			var todaysOrder = [];
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var dateOrderDate;
			todaysOrder = todaySaleId;
			var dateOrderCount = salesCount;
			
			// Get the client details
			var todaysSale = todaySaleId[dateOrderCount];
			// Get details of today's order from Restful API
			alert('todaysSale '+todaysSale);
			$.get('http://137.108.93.222/openstack/api/orders/' + todaysSale + '?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
				// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the orders');
					} else 
					{
						// Get id, date and client id of each order
						counterId = obj.data[0].id;
						counterDate = obj.data[0].date;
						counterClient = obj.data[0].client_id;
						//Get each client details
						$.get('http://137.108.93.222/openstack/api/clients/' + counterClient  + '?OUCU=' + oucu + '&password=' + oucuPassword,
							function (data) {
							// parse the string received from the web server into a JavaScript object
							var obj = $.parseJSON(data);
							if (obj.status == "fail" || obj.status == "error") {                
								alert('Attempt failed to access the client details');
							} else {
								//Update the display with the widget image, description and asking price according 
								//to the number of times Next and Prev Widget buttons has been pressed
								var client = obj.data[0].name;
								var clientsAddress = obj.data[0].address;
								//get order_id and order details for each order
								$.get('http://137.108.93.222/openstack/api/order_items?OUCU=' + oucu + '&password=' + oucuPassword + '&order_id=' + todaysSale,
									function(data){
									// Parse the string received from the web server into a JavaScript object
										var obj = $.parseJSON(data);
										if (obj.status == "fail" || obj.status == "error") 
										{                
											alert('Attempt failed to access the order items');
										} else{
											// Get widget Id, number of widgets and Price for each order
											var todayWidgetId = obj.data[0].widget_id;
											var todayWidgetNumber = 0;
											todayWidgetNumber = obj.data[0].number;
											var todayWidgetPrice = 0;
											todayWidgetPrice = obj.data[0].pence_price;
											// Calculate the total price for each widget
											todayWidgetTotal = todayWidgetNumber*todayWidgetPrice;
											// Create a string with details of each order
											todaysOrder = todayWidgetNumber + '(widget ' +  todayWidgetId +') x '  + todayWidgetPrice + 'GBP  =  ' + todayWidgetTotal + 'GBP';
											CallBackFunctionLonLat(todaysOrder, client, clientAddress, counterDate, todayWidgetTotal);
										}
									}
								)
							}
						}
						)
					}
				}
			)
		}
		
		// Global variables	
		var todaySaleId = [];	
		var saleCounter = 1;
		
	   /**
		* Callback function with a counter to count orders when Next Order button is pressed
		*/
		function callBackfunctionNextIds(allIds){
			var myIdsDate;
			var myIds=[];
			myIds = allIds;
			// Counter for orders when the Next Order button is pressed
			if (saleCounter<myIds.length-1){
				saleCounter +=1;
			}
			else{
				saleCounter = 0;
			}
				// Counter for orders on the same day whne the Next Order button is pressed
				calculateSales(saleCounter, myIds);
		}
			
	   /**
		* Callback function with a counter to count orders when Prev Order button is pressed	
		*/		
		function callBackfunctionPrevIds(allIds){
			var myIdsDate;
			var myIds=[];
			myIds = allIds;
			// Counter for orders when the Prev Order button is pressed
			if (saleCounter>0){
				saleCounter -=1;
			}
			else{												
				saleCounter = myIds.length-1;;					
				}				
				// Callback function to update the display when the Prev Order button is pressed
			calculateSales(saleCounter, myIds);
		}		
				
		/** 
		 * Navigating today's orders with Next Order button 
		 *  and displaying each order details.
		 */
		this.nextOrder = function(){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var sdate;
			var allIds = [];
			var ids;
			// Reset the orderDetails field
			document.getElementById("orderDetails").innerHTML = "";
			// Get all orders from Restful API
			$.get('http://137.108.93.222/openstack/api/orders?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
					// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the orders');
					} else 
					{
						for (var i=0; i<obj.data.length; i++) {

							ids = obj.data[i].id;
								allIds.push(ids);
						}
					//Callback function with a counter to count orders when Next Order button is pressed
										alert('allIds '+ allIds);
					callBackfunctionNextIds(allIds);
					}
			})
		}
				
		/** 
		 * Navigating orders with Prev Order button 
		 *  and displaying each order details.
		 */
		this.prevOrder = function(){
			var oucu = getOucu('oucu'); 
			var oucuPassword = '';
			var sdate;
			var allIds = [];
			var ids;
			document.getElementById("orderDetails").innerHTML = "";
			$.get('http://137.108.93.222/openstack/api/orders?OUCU=' + oucu + '&password=' + oucuPassword,
				function (data) {
				// Parse the string received from the web server into a JavaScript object
					var obj = $.parseJSON(data);
					if (obj.status == "fail" || obj.status == "error") {                
						alert('Attempt failed to access the orders');
					} else 
					{
					for (var i=0; i<obj.data.length; i++) {
						ids = obj.data[i].id;	
							allIds.push(ids);
					}
					//Callback function with a counter to count orders when Prev Order button is pressed
					callBackfunctionPrevIds(allIds);
					}
			})
		}
			
        // Update the Google map initially
       displayMapInitially();
		
		// Display widget with the widget Id = 8 initially
		displayWidgetInitially();

      }
      this.megaMaxSale = new MegaMaxSale();
    }    
};
app.initialize();