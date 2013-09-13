$(document).delegate('[data-widget="calc.calculate"]', {
    'update': function (event, response) {
        calculated = 0;
        for (var i = 0; i < response.length; i++) {
            if ($(this).attr('data-mode') == 'sub') {
                calculated = calculated - response[i];
            } else { 
                calculated = calculated + response[i];
            }
        }
        if ($(this).attr('data-mode') == 'avg') {
            calculated = calculated / i ;
        }
        calculated =   eval($(this).attr('data-calcstart') + calculated + $(this).attr('data-calcend'));
        if ($(this).attr('data-round') != '') {
            calculated = calculated.toFixed($(this).attr('data-round'));
        }
        $("#" + this.id ).html(calculated + $(this).attr('data-unit'));
    }
});

