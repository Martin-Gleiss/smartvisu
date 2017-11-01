// ----- grid.initiate --------------------------------------------------------
var gridInitiate = function () {
    var columns = 8;    // Anzahl der Spalten
    var rows = 4;       // Anzahl an Zeilen
    var margin = 10;    // Abstand zwischen den Elementen
    var paddingContainer = 20; // Abstand zum Rand
    var footer = Math.round($('div[data-role="footer"]').height());
    if (footer < 40 ) { footer = 40; }
    //footer = footer + margin;
    var size = Math.round(($(window).width() - ((columns - 1) * margin) - (2 * paddingContainer) ) / columns);

    var contentHeight = rows * size + ((rows - 1) * margin);

    if (contentHeight > ($(window).height() - footer - + 2 * paddingContainer)) {
        var size = Math.round(($(window).height() - footer - ((rows - 1) * margin) - (2 * paddingContainer)) / rows);
        contentHeight = rows * size + ((rows - 1) * margin); 
    }    

    var contentWidth = columns * size + ((columns - 1) * margin);
    var offsetx = Math.round((($(window).width() - paddingContainer - contentWidth) / 2) );
    var offsety = Math.round((($(window).height() - footer - contentHeight - 2 * paddingContainer) / 2) );
    
    //alert('Size: ' + size + ' Offset X: ' + offsetx + ' Offset Y: ' + offsety);

    $('div', $('.container')).each(function () {
        var varRow = $(this).attr('data-row');
        var varCol = $(this).attr('data-col');
        var varSizex = $(this).attr('data-sizex');
        var varSizey = $(this).attr('data-sizey');
        if (varRow && varCol) {
            //alert('Row: ' + varRow + ' Col: ' + varCol + ' Size X: ' + varSizex + ' Size Y: ' + varSizey);
            
            // Set position
            //$(this).offset({top: (varRow * (size + margin) + offsety), left: (varCol * (size + margin) + offsetx)});
            $(this).css('top', ((varRow - 1) * size + (varRow * margin) + offsety));
            $(this).css('left', ((varCol - 1) * size + (varCol * margin) + offsetx));
            
            // Set width
            $(this).width((varSizex * size) + ((varSizex - 1) * margin));
            $(this).height((varSizey * size) + ((varSizey - 1) * margin));
        }
    });
};
