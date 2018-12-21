

// ----- v i s u ---------------------------------------------------------------
// -----------------------------------------------------------------------------


// ----- visu.cover ------------------------------------------------------
$.widget("sv.cover", $.sv.widget, {

  initSelector: '[data-widget="extra.cover"]',

  options: {

  },
    _update: function(response){
        var cover = response[0]+'&'+Math.floor(Math.random()*1000);
        console.log("Cover:" + cover);
        this.element.attr('src', cover);
        }
});


// ----- visu.minsymbol -----------------------------------------------------------
$.widget("sv.minsymbol", $.sv.widget, {

  initSelector: 'span[data-widget="extra.minsymbol"]',

  options: {

  },
  _events: {
    'update': function (event, response) {
      event.stopPropagation();
    }
  },
  _update: function (response) {
        var bit = (this.element.attr('data-mode') == 'and');
        if (response instanceof Array) {
            for (var i = 0; i < response.length; i++) {
                if (this.element.attr('data-mode') == 'and') {
                    bit = bit && (response[i] >= this.element.attr('data-val'));
                }
                else {
                    bit = bit || (response[i] >= this.element.attr('data-val'));
                }
            }
        }
        else {
            bit = (response == this.element.attr('data-val'));
        }

        if (bit) {
            this.element.show();
        }
        else {
            this.element.hide();
        }
    }

});
