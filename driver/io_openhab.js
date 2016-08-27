/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Lukas Bauhaus
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


var io = {

	adress: '',

	port: '',


	init: function (address, port) {
		io.address = address;
		io.port = port;
	},

	atmosphereRequest: null,

	read: function (item) {
		$.ajax({  url: 'driver/io_openhab.php?cmd=getState&item=' + item,
			type: 'GET',
			dataType: 'text',
			async: true,
			cache: false,
		})
			.done(function (response) {
				widget.update(item, response);
			});
	},

	write: function (item, val) {
		io.put(item, val);
	},


	trigger: function (name, val) {
		// not supported
	},

	run: function (realtime) {
		io.RefreshAllItems();
		if (realtime == 1){

            if (io.atmosphereRequest != null) {
                $.atmosphere.subscribe(io.atmosphereRequest);
                io.atmosphereRequest = null;
            }

	    	io.atmosphereRequest = new $.atmosphere.AtmosphereRequest();

            io.atmosphereRequest.url = "http://" + this.address + ":" + this.port + "/rest/items?type=json";
            io.atmosphereRequest.contentType = "application/json";
            io.atmosphereRequest.headers = {"Accept": "application/json", "type": "json"};
            io.atmosphereRequest.transport = 'websocket';
            io.atmosphereRequest.fallbackTransport = 'long-polling';


            io.atmosphereRequest.onMessage = function (message) {
                if(message.status == "200") {
                    var changedItem = obj = JSON.parse(message.responseBody);
                    var item = widget.listeners();

                    for (var i = 0; i < widget.listeners().length; i++) {
                        var currentItem = item[i];
                        if (currentItem == changedItem.name) {
                            widget.update(currentItem, changedItem.state);
                        }
                    }

                }

			};

 			var subSocket = $.atmosphere.subscribe(io.atmosphereRequest);

		}
	},

	RefreshAllItems: function() {
		var items = '';

		// only if anyone listens
		if (widget.listeners().length) {
			      
			var item = widget.listeners();
			
			for (var i = 0; i < widget.listeners().length; i++) {
				var currentItem = item[i];
				io.read(currentItem);
			}
			

		}
	},

    put: function (item, val) {
        var url = 'driver/io_openhab.php?cmd=setState&item=' + item + '&state=' + val;

        $.ajax({
            url: url,
            type: 'GET',
            async: true,
            cache: false,
            data: val
        })
				.done(function (response) {
				    widget.update(item, response);
				});

    },

};
