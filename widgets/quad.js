
// ---- QUAD TABS --------------------------------------------------------------
$(document).on("pageshow", function() {
    $(".quad_tab-header").each(function(idx) {
        var height = $(this).parent().innerHeight() - $(this).outerHeight();
        // $(this).siblings(".quad_tab-content").css('height', height);
        console.log('Height '+height);
    });
});

$(document).on("pagecreate", function() {
    $(".quad_tab-header ul li").on("click",function(){
        $(this).parent().find(".ui-btn-active").removeClass("ui-btn-active");
        $(this).addClass("ui-btn-active");
        var newSelection = $(this).children("a").attr("data-tab-class");
        var prevSelection = $(this).parent().parent().attr("data-tab-selection");
        $("."+prevSelection).addClass("ui-screen-hidden");
        $("."+newSelection).removeClass("ui-screen-hidden");
        $(this).parent().parent().attr("data-tab-selection", newSelection);

        $("."+newSelection).find('[data-widget="plot.period"]').each(function(idx) {
            if ($('#' + this.id).highcharts()) {
                $('#' + this.id).highcharts().destroy();
                var values = widget.get(widget.explode($(this).attr('data-item')));
                if (widget.check(values))
                    $(this).trigger('update', [values]);
            }
        });

    });
});

// ---- QUAD SORTING -----------------------------------------------------------
$(document).on("pagecreate", function() {
  $('[id$="sorting"]').each(function() {

  var mylist = $(this);
  var listitems = mylist.children('div').get();
  listitems.sort(function(a, b) {
     var compA = $(a).data('order');
     var compB = $(b).data('order');
     return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
  })

  $.each(listitems, function(idx, itm) { mylist.append(itm); });
  });
});
