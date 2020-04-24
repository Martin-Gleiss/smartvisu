// ----------------------------------------------------------------------------
// ---   widget_assistant.js   ----------------------------------------------------------
// ----------------------------------------------------------------------------
//
// Widget für das Erstellen von Widget einträge mit Hilfe von Autocomplete und 
// Prüfung der Anzahl Parameter, Hilfstexte werden zu den einzelnen Parameter
// in einem Popup angezeigt.
//
//
// (c) Andre Kohler		- 2020
//
//


var actWidgets = null
var myWidgetList = null
var myWidgetJson = Object()
var cur = Object()
var curLine = Object()
var myItems = []
var myIcons = []
var myWidgets = []
var myCompleteDict = []
var myColorsDict=[]
var items_loaded = false
var icons_loaded = false
var widgets_loaded = false
var NewWindowLoaded = false
var myInterval = null


$( document ).ready(function() {
	myInterval = setInterval(getall,1000);
});

//************************************************************************
//getall - collecting all values for autocomplete
//************************************************************************
function getall()
{
	clearInterval(myInterval)
	get_colors()
	get_widgets()
	get_Icons()
	get_Items()	
}

//************************************************************************
//ChangeDict - set acutal Dict for autocomplete
//************************************************************************

function ChangeDict(cm,selectedDict)
{
	console.log('Change Dict')
	switch (selectedDict)
	{
	case 1:
		registerAutocompleteHelper('autocompleteHint', myItems);
		console.log('Stored Items to Autocomplete dict')
		CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
		document.getElementById("selected_dict").innerHTML = '<strong>Items</strong>'
		break;
	case 2:
		registerAutocompleteHelper('autocompleteHint', myWidgets);
		console.log('Stored Items to Autocomplete dict')
		CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
		document.getElementById("selected_dict").innerHTML = '<strong>Widgets</strong>'
		break;
		
	case 3:
		registerAutocompleteHelper('autocompleteHint', myIcons);
		console.log('Stored Items to Autocomplete dict')
		CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
		document.getElementById("selected_dict").innerHTML = '<strong>Icons</strong>'
		break;
	case 4:
		registerAutocompleteHelper('autocompleteHint', myCompleteDict);
		console.log('Stored Items to Autocomplete dict')
		CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
		document.getElementById("selected_dict").innerHTML = '<strong>ALL</strong>'
		break;
	case 5:
		registerAutocompleteHelper('autocompleteHint', myColorsDict);
		console.log('Stored Items to Autocomplete dict')
		CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
		document.getElementById("selected_dict").innerHTML = '<strong>Colors</strong>'
		break;
	}
}


//************************************************************************
//get_colors - setting Color to dict
//************************************************************************

function get_colors()
{
	myColors=['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque',
			  'black','blanchedalmond','blue','blueviolet','brown','burlywood',
			  'cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk',
			  'crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray',
			  'darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen',
			  'darkorange','darkorchid','darkred','darksalmon','darkseagreen',
			  'darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink',
			  'deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite',
			  'forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod',
			  'gray','green','greenyellow','grey','honeydew','hotpink','indianred',
			  'indigo','ivory','khaki','lavender','lavenderblush','lawngreen',
			  'lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow',
			  'lightgray','lightgreen','lightgrey','lightpink','lightsalmon',
			  'lightseagreen','lightskyblue','lightslategray','lightslategrey',
			  'lightsteelblue','lightyellow','lime','limegreen','linen','magenta',
			  'maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple',
			  'mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise',
			  'mediumvioletred','midnightblue','mintcream','mistyrose','moccasin',
			  'navajowhite','navy','oldlace','olive','olivedrab','orange','orangered',
			  'orchid','palegoldenrod','palegreen','paleturquoise','palevioletred',
			  'papayawhip','peachpuff','peru','pink','plum','powderblue','purple',
			  'RebeccaPurple','red','rosybrown','royalblue','saddlebrown','salmon',
			  'sandybrown','seagreen','seashell','sienna','silver','skyblue',
			  'slateblue','slategray','slategrey','snow','springgreen','steelblue',
			  'tan','teal','thistle','tomato','turquoise','violet','wheat','white',
			  'whitesmoke','yellow','yellowgreen','icon0','icon1']
	myStdColors = ['black','maroon','green','olive','navy','purple','teal','silver',
				'grey','red','lime','yellow','blue','fuchsia','aqua','white','icon0','icon1']
	
	result = myColors
    for (i = 0; i < result.length; i++)
    {
    	myColorsDict.push({ text: "'"+result[i]+"'"  , displayText: ''+result[i]+" | Color" });
    	//myCompleteDict.push({ text: "'"+result[i]+"'", displayText: ''+result[i]+" | Color" });
    }
	result = myStdColors
    for (i = 0; i < result.length; i++)
    {
    	myCompleteDict.push({ text: "'"+result[i]+"'"  , displayText: ''+result[i]+" | Color" });
    }
	document.getElementById("colors_loaded").src = 'pics/led/lamp_green.png'
}

//************************************************************************
//get_Icons - getting the icons via php
//************************************************************************

function get_Icons()
{
	 $.ajax({
		   url: "lib/widget_constructor/widget_constructor.php",
		   method: "GET",
		   dataType: "json",
		   data: {
			   		command : 'load_icons'
			   	 },
		   success: function (result) {
			   console.log("got icons")
	           for (i = 0; i < result.length; i++) {
	        	   if (result[i] != "." && result[i] != "..")
	        		   {
		        	   myIcons.push({ text: "'"+result[i].substring(0,result[i].length-4)+"'", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
		        	   myCompleteDict.push({ text: "'"+result[i].substring(0,result[i].length-4)+"'", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
	        		   }
		        }
				
			   icons_loaded = true
  			   document.getElementById("icons_loaded").src = 'pics/led/lamp_green.png'
		   },
		   error: function (result) {
			   console.log("Error while receiving icons")
		   }
		 });
}

//************************************************************************
// get_Items - getting the items via php
//************************************************************************
function get_Items()
{
	 $.ajax({
		   url: "lib/widget_constructor/widget_constructor.php",
		   method: "GET",
		   dataType: "json",
		   data: {
			   		command : 'load_widgets'
			   	 },
		   success: function (result) {
			   console.log("got items")
	           for (i = 0; i < result.length; i++) {
		        	myItems.push({ text: "'"+result[i]+"'", displayText: result[i]+"() | Item" });
		        	myCompleteDict.push({ text: "'"+result[i]+"'", displayText: result[i]+"() | Item" });
		        }
				
				items_loaded = true
				registerAutocompleteHelper('autocompleteHint', myCompleteDict);
				console.log('Stored Items to Autocomplete dict')
				CodeMirror.commands.autocomplete_items = function(cm)
					{
				     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
					}
				document.getElementById("items_loaded").src = 'pics/led/lamp_green.png'
		   },
		   error: function (result) {
			   console.log("Error while receiving items")
		   }
		 });
}

//************************************************************************
// renders the template with the actual widget
//************************************************************************
function render_template()
{
	 txtCode = widgetCodeMirror.getValue()
	 txtCode = txtCode.replace('\n','')
	 txtCode = txtCode.replace(' ','')
	 newUrl = window.location.href.substr(0,window.location.href.search("=")+1) + 'construct'
	 if (document.getElementById("render_2_Window").checked == false)
		 {
			 $.ajax({
			   url: "lib/widget_constructor/widget_constructor.php",
			   method: "GET",
			   dataType: "json",
			   data: {
				   		command : 'render_inline',
				   		widget : txtCode
				   	 },
			   success: function (result) {
				   console.log("rendered template correct")
				   },
			   error: function (result) {
				   console.log("Error rendering template")
			   }
			 });
			 
			 document.getElementById("render_frame").src=newUrl
		 }
	 else
		 {
		 $.ajax({
			   url: "lib/widget_constructor/widget_constructor.php",
			   method: "GET",
			   dataType: "json",
			   data: {
				   		command : 'render_outline',
				   		widget : txtCode
				   	 },
			   success: function (result) {
				   console.log("rendered template correct")
				   },
			   error: function (result) {
				   console.log("Error rendering template")
			   }
			 });		 
		 
		  if (NewWindowLoaded == false)
			  {
			  window.open(newUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); 
			  NewWindowLoaded = true
			  }
		 }
	   
	 
	 
}


   
//************************************************************************
// getPreview - renders the actual finished widget
//************************************************************************
function getPreview(widget)
{
	render_template();
}

//************************************************************************
//Function to get Widgetlist via Twig -> docu-function
//************************************************************************
function get_widgets()
{
	try
	{
		actWidgets = document.getElementById('widget_list');
	    myWidgetList = actWidgets.dataset.mywidgetlist;
	    myWidgetJson = JSON.parse(myWidgetList);
	    for (widget in myWidgetJson) {
	    	myWidgets.push({ text: widget+"(", displayText: widget+" | Widget" });
			myCompleteDict.push({ text: widget+"(", displayText: widget+" | Widget" });
		}
	    widgets_loaded = true
	    document.getElementById("widgets_loaded").src = 'pics/led/lamp_green.png'
	}
	catch (e)
	{
		console.log('Error while getting widgets')
	}
}

//************************************************************************
// TooltipChecker - displays the Tooltip and the Params for the widget
//************************************************************************

function TooltipChecker(cm)
{
 if (widgets_loaded == false)
	 {
	 get_widgets()
	 }
 CursorPos = cm.getCursor()
 actLine    = CursorPos.line
 actColumn  = CursorPos.ch
 console.log('Line : ' + actLine+ ' Column : '+actColumn)
 txtCode = widgetCodeMirror.getValue()
 txtArray = txtCode.split('\n')
 txtBeforeCursor = ''
 for (var i = 0; i < actLine; i++)
	 {
	 txtBeforeCursor += txtArray[i]
	 }
 txtBeforeCursor += txtArray[i].substr(0,actColumn)
 var myIcon =""
 var myIconVisible = "hidden"
 var myActColor = ""
 if (cm.state.completionActive)
	 {
	  console.log('completionActive is set')
	  try
	  {
	  selectedHint = cm.state.completionActive.widget.selectedHint
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Icon') > 0 )
			  
			 {
		  		console.log('Icon is selected' + cm.state.completionActive.data.list[selectedHint].displayText)
		  		myIcon ="icons/ws/"+cm.state.completionActive.data.list[selectedHint].text.replace("'","").replace("'","")+'.svg'
		  		myIconVisible = "visible"
			 }
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Color') > 0 )
		  
		 {
	  		console.log('Color is selected' + cm.state.completionActive.data.list[selectedHint].displayText)
	  		myActColor ="background-color: "+cm.state.completionActive.data.list[selectedHint].text.replace("'","").replace("'","")+';'
		 }
	  
	  }
	  catch (e)
	  {}
			  
	 }
 else
	 {
	 try
	 {
	 	console.log('nothing to do')
	 	myIcon =""
  		myIconVisible = "hidden"
  		myActColor = ""
	   //  document.getElementById("icon_preview").style.visibility="hidden"
	 }	
	 catch (e) { console.log('nothing to do')}
	 }
 txtCode = txtBeforeCursor
 // Eleminat Commas in Square-Brackets
 newText = ""
 while (txtCode.search("\\[") > 0)
	 {
	 txtBeforeBracket=txtCode.substr(0,txtCode.search("\\[")+1)+']'
	 if (txtCode.search("\\]")>=0)
	  { txtAfterBracket=txtCode.substr(txtCode.search("\\]")) }
	 else
	  {
		 txtAfterBracket=txtCode.substr(txtCode.search("\\[")+1).replace(',','')
	  }
	 newText += txtBeforeBracket 
	 txtCode = txtAfterBracket.substr(1,)
	 }
 txtCode = newText + txtCode
 myToolTip= document.getElementById("overlay")
 // Find the widget-Name
 bracketPos = txtCode.search('\\(')
 if (bracketPos < 1)
	 {
	 myToolTip.style.display = "none"; 
	 return
	 }

 actWidgetName=txtCode.substr(0,bracketPos)
 if(myWidgetJson[actWidgetName] == null)
	 {
	 myToolTip.style.display = "none";
	 return
	 }
 
 AssistantBlock =$('#Assistant_div') 
 BlockPosLeft =  AssistantBlock.position()['left']
 BlockPosTop  = AssistantBlock.position()['top']
 BlockPosHeight = AssistantBlock.height()
 BlockPosWidth  = AssistantBlock.width()
 
 myToolTip.style.top    = BlockPosTop+'px'
 myToolTip.style.left   = 20+'px'
 myToolTip.style.width  = 400+'px'
 myToolTip.style.height = window.innerHeight-200+'px'
 
 
 myToolParam = myWidgetJson[actWidgetName]['params']			// Text für Parmeterliste
 myToolMacro = '<strong>'+actWidgetName+'</strong>\(%param%\)'
 // Build the Param-List
 i=0
 params={}
 for (param in myWidgetJson[actWidgetName]['param'])
	 {
	 	params[("00" + i).slice(-2)] = param
	 	i += 1
	 }
 if (txtCode.search('\\(') >= 0 && txtCode.search('\\)') < 0)
    {
      myToolTipHdl = document.getElementById("overlaytext")

      myToolTip.style.display = "block";
      
      
      CommaCount = txtCode.split(',').length -1
      myText = myToolParam.split(',')
      Counter = 0
      newParam = ''
      actParam = ''
      for (param in myText)
        {

          if (Counter == CommaCount)
            {
              myNewText = '<font color="red">'+ myText[param]+'</font>'
              actParam = myText[param].replace(' ','')
            }
          else
            {
             myNewText = myText[param]
            }
         newParam = newParam + myNewText + ','
         Counter += 1
        }
        newParam=newParam.substr(0,newParam.length-1)
        myDescription = null
        myDescription = myWidgetJson[actWidgetName]['*']
        if (myDescription == null)
        	{ myDescription = myWidgetJson[actWidgetName][' *']}

        myToolTipHdl.innerHTML  =''
        myToolTipHdl.innerHTML +='<table width="100%"><tbody><tr>'+
        						 '<td style="text-align:left;width:50%"><h2>Tooltip</h2></td>'+
        						 '<td style="width:50%;text-align: center;' + myActColor + '">'+
        						 '<img id="icon_preview" src="'+myIcon+'" style="height:60px; width:60px;visibility: '+myIconVisible+';">' +
        						 '</td>'+
        						 '</tr></tbody></table>'
        if (myWidgetJson[actWidgetName].hasOwnProperty("deprecated"))
        	{
        	myToolTipHdl.innerHTML +='<h4 align=left style="color: yellow;">deprecated :'+ myWidgetJson[actWidgetName]['deprecated']+'</h4><br>'        	
        	}
        myToolTipHdl.innerHTML += myToolMacro.replace('%param%',newParam)
        myToolTipHdl.innerHTML +='<br><h3 align=left>Description</h3><br>'+ myDescription
        paramKey = ("00" + CommaCount).slice(-2);
        myToolTipHdl.innerHTML +='<br><h3>aktueller Parameter : '+actParam+'</h3>'
        // Display all the parameters
        for (param in myWidgetJson[actWidgetName]['param'][actParam])
        	{
        	  myToolTipHdl.innerHTML += '<br>' + param + ' - ' + myWidgetJson[actWidgetName]['param'][actParam][param]
        	  //myToolTipHdl.innerHTML += '<br>( Array-Form :'+ myWidgetJson[actWidgetName]['param'][param]['array_form'] + '- ' +
        	  //							' optional :'+ myWidgetJson[actWidgetName]['param'][param]['optional'] + '- ' +
        	  //							' type : :'+ myWidgetJson[actWidgetName]['param'][param]['type'] + ') ' +
        	  //							' <br>'+ myWidgetJson[actWidgetName]['param'][param]['desc']
        	}
         
    }
   else
    {
      myToolTip.style.display = "none";
      //getPreiviw(txtCode)
    }
}



//************************************************************************
// registerAutocompleteHelper - seen at Web-Interface of logics from shNG
//************************************************************************

function registerAutocompleteHelper(name, curDict) {
    CodeMirror.registerHelper('hint', name, function(editor) {
        cur = editor.getCursor();
        curLine = editor.getLine(cur.line);
        var start = cur.ch,
            end = start;

        console.log('Autocomplete called - autocompleteHint')
        var charexp =  /[\w\.$]+/;
        while (end < curLine.length && charexp.test(curLine.charAt(end))) ++end;
        while (start && charexp.test(curLine.charAt(start - 1))) --start;
        var curWord = start != end && curLine.slice(start, end);
        if (curWord.length > 1) {
            curWord = curWord.trim();
        }
        var regex = new RegExp('^' + curWord, 'i');

        if (curWord.length >= 3) {
            var oCompletions = {
                list: (!curWord ? [] : curDict.filter(function (item) {
                    return item['displayText'].match(regex);
                })).sort(function(a, b){
                    var nameA=a.text.toLowerCase(), nameB=b.text.toLowerCase()
                    if (nameA < nameB) //sort string ascending
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0 //default return value (no sorting)
                }),
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };

            return oCompletions;
        }
    });
}


/*
//*****************************************************
//Widget for Assistant
//*****************************************************
$.widget("sv.assistant", $.sv.widget, {

	initSelector: 'div[data-widget="assistant.assistant"]',

	_update: function(response) {
		console.log('received Item Infos')
	}

});

*/