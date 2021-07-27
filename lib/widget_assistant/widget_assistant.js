// ----------------------------------------------------------------------------
// ---   widget_assistant.js   
// ----------------------------------------------------------------------------
// Version 1.2.0 - for smartvisu3.1 release
//
// Widget für das Erstellen von Widgeteinträgen mit Hilfe von Autocomplete und 
// Prüfung der Anzahl Parameter, Hilfstexte werden zu den einzelnen Parameter
// in einem Popup angezeigt.
//
//
// (c) Andre Kohler		- 2020
// license     GPL [http://www.gnu.de]
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
var myCompleteDictwithQuotes = []
var myColorsDict=[]
var items_loaded = false
var icons_loaded = false
var widgets_loaded = false
var myInterval = null
var searchtype = 1
var second_regex = new RegExp('\\|\\ Widget.*', 'i');
var filter_type = 4
var remove_deprecated = true
var actParam = ""
var last_Param = ""
var actWidgetName = ""
var txtCompleteDict = ""
var modeBracketClose = 1
var actDictMode = 1
var myInterval = null
var myChildWindows = null
var renderSuccess = false


$( document ).ready(function() {
	myInterval = setInterval(getall,1000);
});

document.getElementById('render_frame').addEventListener('load', function(){
	  var myframe = document.getElementById('render_frame');
      myframe.contentWindow.document.body.style.backgroundColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
      myframe.contentWindow.document.body.style.color = window.getComputedStyle( document.body ,null).getPropertyValue('color');
    });

// ************************************************************************
// remove all the balanced Brackets
// ************************************************************************
function removeBalancedBrackets(text)
{
	var test = text 

	var BraceArray = []
	var CurlyArray = []
	var SquareArray = []
	var newText=test
	var Laenge = newText.length
	for (i=0; i<= Laenge; i++)
	{
	  if (newText.substr(i,1) == "(" && BraceArray[BraceArray.length] != i)
	   {
	     BraceArray.push(i)
	   }
	  if (newText.substr(i,1) == "[" && SquareArray[SquareArray.length] != i)
	   {
	     SquareArray.push(i)
	   }
	  if (newText.substr(i,1) == "{" && CurlyArray[CurlyArray.length] != i)
	   {
	     CurlyArray.push(i)
	   }
	// search for closing brackets
	  if (newText.substr(i,1) == ")" && BraceArray.length >0)
	   {
	     lastpos = BraceArray.pop()
	     txt2Replace = newText.substr(lastpos,i-lastpos+1)
	     console.log(txt2Replace)
	     replaceLength = txt2Replace.length
	     newText = newText.replace(txt2Replace, "")
	     i = i - replaceLength
	     Laenge = Laenge - replaceLength
	     console.log(newText+"\n")
	     continue
	   }
	  if (newText.substr(i,1) == "]" && SquareArray.length >0)
	   {
	     lastpos = SquareArray.pop()
	     txt2Replace = newText.substr(lastpos,i-lastpos+1)
	     console.log(txt2Replace)
	     replaceLength = txt2Replace.length
	     newText = newText.replace(txt2Replace, "")
	     i = i - replaceLength
	     Laenge = Laenge - replaceLength
	     console.log(newText+"\n")
	     continue
	   }
	  if (newText.substr(i,1) == "}" && CurlyArray.length >0)
	   {
	     lastpos = CurlyArray.pop()
	     txt2Replace = newText.substr(lastpos,i-lastpos+1)
	     console.log(txt2Replace)
	     replaceLength = txt2Replace.length
	     newText = newText.replace(txt2Replace, "")
	     i = i - replaceLength
	     Laenge = Laenge - replaceLength 
	     console.log(newText+"\n")
	     continue
	   }
	}
	console.log("\n"+"BraceCount : "+BraceArray.length)
	console.log("SquareCount : "+SquareArray.length)
	console.log("CurlyCount : "+CurlyArray.length)
	if (BraceArray.length == 0 && SquareArray == 0 && CurlyArray.length == 0)
		{ allBracketsClosed = true }
	else
		{ allBracketsClosed = false }
	return [ newText, allBracketsClosed]
}

// ************************************************************************
// OnHover for Changing Tooltip on Mouse hover
// ************************************************************************
function onHover (e) {
     if(e.target.className === "cm-myStyle") { 
        var x = e.pageX;
        var y = e.pageY;
        var coords = {left: x, top: y};

        var loc = editor.coordsChar(coords);
}}

// ************************************************************************
// UpdateManual()
// ************************************************************************
function UpdateManual()
{
 clearInterval(myInterval)
 var iframe = document.getElementById('render_frame');
 iframe.src = iframe.src;
}
// ************************************************************************
// getall - collecting all values for autocomplete
// ************************************************************************
function getall()
{
	clearInterval(myInterval)
	get_colors()
	get_widgets()
	get_Icons()
	get_Items()
	for (i=0;i<myCompleteDict.length-1;i++)
	  {
		txtCompleteDict+= myCompleteDict[i].displayText + ','
	  }
}


// ************************************************************************
// ChangeDictbyMouse - Dict was changed by Mouse
// ************************************************************************
function ChangeDictbyMouse(e)
{
	if (window.event == undefined)		// triggered by Mouse
		{
		 myDict = parseInt($("#select_autocomplete").val());
 	     actDictMode = 2
 	     ChangeDict(myDict,'','',true)
		}
}
// ************************************************************************
// ChangeDict - set acutal Dict for autocomplete
// ************************************************************************

function ChangeDict(selectedDict,myKey,displayKey,sl_SendNoChange)
{
	
	if (actDictMode == 1 && ( last_Param == actParam && actParam != '' ))
	 { return }
	last_Param = actParam
	
	
	console.log('Change Dict')
	switch (selectedDict)
	{
	case 1:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("1").change(); }
		second_regex = new RegExp('\\|\\ Item.*', 'i');
		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 2:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("2").change(); }
		second_regex = new RegExp('\\|\\ Widget.*', 'i');
		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
		
	case 3:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("3").change(); }
		second_regex = new RegExp('\\|\\ Icon.*', 'i');
		document.getElementById("selected_dict").innerHTML = ""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 4:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("4").change(); }
		second_regex = new RegExp('.*', 'i');
		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 5:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("5").change(); }
		colFilter = actParam+'@'+actWidgetName+'*'
		second_regex = new RegExp('Std-Color.*|'+colFilter, 'i');
		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 6:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("6").change(); }
		second_regex = new RegExp('\\|\\ XXXXX.*', 'i');
		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 9:
		
		second_regex = new RegExp('\\|\\ '+myKey+'.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Types filtered by <br>'+myKey+'</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor="rebeccapurple"
		break;
	case 10:
		if (sl_SendNoChange != true)
		{ $("#select_autocomplete").val("1").change(); }
		second_regex = new RegExp(myKey, 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Items filtered by <br>'+displayKey+'</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor="green"
		break;		
	default:

		document.getElementById("selected_dict").innerHTML =""
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break
	}
}


// ************************************************************************
// get_colors - setting Color to dict
// ************************************************************************

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
			  'whitesmoke','yellow','yellowgreen']
	
	
	result = myColors
    for (i = 0; i < result.length; i++)
    {
    	myDisplayText = result[i] + "                             "
    	myColorsDict.push({ text: "'"+result[i]+"'"  , displayText: ''+myDisplayText.substr(0,18)+" | Std-Color" });
    	myCompleteDict.push({ text: ""+result[i]+"", displayText: ''+myDisplayText.substr(0,18)+" | Std-Color" });
    	myCompleteDictwithQuotes.push({ text: "'"+result[i]+"'", displayText: ''+myDisplayText.substr(0,18)+" | Std-Color" });
    	
    }

	document.getElementById("colors_loaded").src = 'pics/led/lamp_green.png'
	Label=$("#colors_loaded").closest("td").html()
	newLabel = Label.replace("Colors loaded","Colors loaded [ "+ myColorsDict.length +" ]")
	$("#colors_loaded").closest("td").html(newLabel)
}

// ************************************************************************
// get_Icons - getting the icons via php
// ************************************************************************

function get_Icons()
{
	 $.ajax({
		   url: "lib/widget_assistant/widget_assistant.php",
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
		        	   myCompleteDict.push({ text: ""+result[i].substring(0,result[i].length-4)+"", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
		        	   myCompleteDictwithQuotes.push({ text: "'"+result[i].substring(0,result[i].length-4)+"'", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
	        		   }
		        }
				
			   icons_loaded = true
  			   document.getElementById("icons_loaded").src = 'pics/led/lamp_green.png'
  			   Label=$("#icons_loaded").closest("td").html()
 			   newLabel = Label.replace("Icons loaded","Icons loaded [ "+ myIcons.length +" ]")
 			   $("#icons_loaded").closest("td").html(newLabel)
		   },
		   error: function (result) {
			   console.log("Error while receiving icons")
		   }
		 });
}

// ************************************************************************
// get_Items - getting the items via php
// ************************************************************************
function get_Items()
{
	 $.ajax({
		   url: "lib/widget_assistant/widget_assistant.php",
		   method: "GET",
		   dataType: "json",
		   data: {
			   		command : 'load_items'
			   	 },
		   success: function (result) {
			   console.log("got items")
	           for (i = 0; i < result.length; i++) {
	        	    Item = result[i].split("|")[0]
	        	    try
	        	    { ItemType = result[i].split("|")[1] }
	        	    catch (e)
	        	    { ItemType = "???"}
	        	    
	        	    
		        	myItems.push({ text: "'"+result[i]+"'", displayText: result[i]+"() | Item" });
		        	myCompleteDict.push({ text: ""+Item+"", displayText: Item+"() | Item - "+ ItemType });
		        	myCompleteDictwithQuotes.push({ text: "'"+Item+"'", displayText: Item+"() | Item - "+ ItemType });
		        }
				
				items_loaded = true
				registerAutocompleteHelper('autocompleteHint', myCompleteDictwithQuotes);
				console.log('Stored Items to Autocomplete dict')
				CodeMirror.commands.autocomplete_items = function(cm)
					{
				     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
					}
				document.getElementById("items_loaded").src = 'pics/led/lamp_green.png'
				Label=$("#items_loaded").closest("td").html()
				newLabel = Label.replace("Items loaded","Items loaded [ "+ myItems.length +" ]")
				$("#items_loaded").closest("td").html(newLabel)
		   },
		   error: function (result) {
			   console.log("Error while receiving items")
			   myItems.push({ text: "'"+''+"'", displayText: ''+"() | Item" });
			   myCompleteDict.push({ text: "'"+''+"'", displayText: ''+"() | Item" });
			   registerAutocompleteHelper('autocompleteHint', myCompleteDictwithQuotes);
				console.log('Stored Items to Autocomplete dict')
				CodeMirror.commands.autocomplete_items = function(cm)
					{
				     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
					}
		   }
		 });
}

// ************************************************************************
// renders the template with the actual widget
// ************************************************************************
function render_template()
{
	 txtCode = widgetCodeMirror.getValue()
	 txtCode = txtCode.split("\n").join("")
	 renderSuccess = false;
 
	 txtCode = txtCode.split(" ").join("")
	 if (txtCode.substr(0,2) == "{{")
		 {
		 txtCode = txtCode.substr(2)
		 }
	 txtCode = txtCode.split("}}<br>{{").join("<br>")
	 if (txtCode.substr(-3) == ")}}")
		 { txtCode = txtCode.substr(0,txtCode.length-2) }
	 // *********
	 [txtTest,allBracketsClosed] = removeBalancedBrackets(txtCode)
	 if (allBracketsClosed == false)
		 {
		 myText 	= '<span id="blink" class="blinkklasse"><b style="color: orange;font-size:1.2em;"> Not all brackets are closed </span><br>Rendering will cause an error<br>' 
	     myText += '<br>Rendering aborted, please check brackets for next trial'
		 myText += '<br>This message will disapear in 10 sec'
		 document.getElementById("render_frame").contentWindow.document.body.innerHTML = myText
		 clearInterval(myInterval);
		 myInterval = setInterval(UpdateManual,10000);
		 return
		 }
	 WidgetArray = txtCode.split("<br>")
	 txtClipboard = ""
     lastWidgetIsQuad = false
	 WidgetArray.forEach(function(element){
		 if (element.search('quad') >= 0 && lastWidgetIsQuad == false)
		 {
			 txtClipboard += '<ul data-role="listview" data-dividertheme="c" class="quad_list">\n'
		     lastWidgetIsQuad = true
		 }
		 
		 if (element.search('quad') == -1 && lastWidgetIsQuad == true)
		 {
			 txtClipboard += '</ul>\n<br>\n'
			 lastWidgetIsQuad = false
		 }
		 txtClipboard = txtClipboard + "{{" + element + "}}\n"
		 if (lastWidgetIsQuad == false)
		 {
			 txtClipboard += '<br>\n'
		 }
		 
	 });
	 // *********
	 if (lastWidgetIsQuad == true)
	  {
		  txtClipboard += '</ul>\n<br><br>'
	  }
		 
	 // Value for rendering
	 txtCode = txtClipboard
	 txtClipboard = ''
	 WidgetArray.forEach(function(element){
		 txtClipboard = txtClipboard + "{{" + element + "}}\n<br>\n"
	 });
	 // delete last <br>
	 txtClipboard = txtClipboard.substr(0,txtClipboard.lastIndexOf("<br>")-1)
	 copyToClipboard(txtClipboard)
	 newUrl = window.location.href.substr(0,window.location.href.search("=")+1) + 'assistant'
	 if (document.getElementById("render_2_Window").checked == false)
		 {
			 $.ajax({
			   url: "lib/widget_assistant/widget_assistant.php",
			   method: "GET",
			   dataType: "text",
			   data: {
				   		command : 'render_inline',
				   		widget : txtCode
				   	 },
			   success: function (result) {
				   console.log("rendered template correct")
				   document.getElementById("render_frame").src=newUrl
				   },
			   error: function (result) {
				   console.log("Error rendering template")
			   }
			 });
		 }
	 else
		 {
			 $.ajax({
			   url: "lib/widget_assistant/widget_assistant.php",
			   method: "GET",
			   dataType: "text",
			   data: {
				   		command : 'render_outline',
				   		widget : txtCode
				   	 },
			   success: function (result) {
				   console.log("rendered template correct");
				   renderSuccess = true;
				   },
			   error: function (result) {
				   console.log("Error rendering template");
				   renderSuccess = false;
			   }
			});		 
			
			if (renderSuccess = true) { 
				if (myChildWindows == null || myChildWindows.closed == true) 
 		   		   myChildWindows = window.open(newUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
				else {
					myChildWindows.location.reload(true);
					myChildWindows.focus();
				}
			}
		 }
}

   
// ************************************************************************
// getPreview - renders the actual finished widget
// ************************************************************************
function getPreview(widget)
{
	render_template();
}

// ************************************************************************
// Function to get Widgetlist via Twig -> docu-function
// ************************************************************************
function get_widgets()
{
	try
	{
		Widget2Remove = []
		myText = ''
		actWidgets = document.getElementById('widget_list');
	    myWidgetList = actWidgets.dataset.mywidgetlist;
	    myWidgetJson = JSON.parse(myWidgetList);
	    for (myWidget in myWidgetJson) {
	    	if (myWidgetJson[myWidget].hasOwnProperty("deprecated") && remove_deprecated)
	    		{
	    		 Widget2Remove.push(myWidget) 
	    		 continue
	    		}
	    	if (myWidgetJson[myWidget].hasOwnProperty("param"))
	    		{
			    	myWidgets.push({ text: myWidget+"", displayText: myWidget+" | Widget" });
					myCompleteDict.push({ text: myWidget+"", displayText: myWidget+" | Widget" });
					myCompleteDictwithQuotes.push({ text: ""+myWidget+"", displayText: myWidget+" | Widget" });
	    		}
	    	else
	    		{
	    		myText += 'got : ' + myWidget + ' - without params<br>'
	    		}
		}
	    // Get the specific Params
	    myParamType = false
		CheckValidValues()
	    widgets_loaded = true
	    for (myWidget in Widget2Remove)
	    	{
	    	delete myWidgetJson[Widget2Remove[myWidget]]
	    	console.log("removed deprecated widget :"+Widget2Remove[myWidget])
	    	}
	    document.getElementById("widgets_loaded").src = 'pics/led/lamp_green.png'
	    Label=$("#widgets_loaded").closest("td").html()
	    newLabel = Label.replace("Widgets loaded","Widgets loaded [ "+ myWidgets.length +" ]")
	    $("#widgets_loaded").closest("td").html(newLabel)
	    	
		if (myText != '')
			{
			    clearInterval(myInterval);
			    myText 	= '<span id="blink" class="blinkklasse"><b style="color: orange;font-size:1.2em;"> You got widgets without params</span><br><br>' + myText
				myText += '<br>This message will disapear in 10 sec'
				document.getElementById("render_frame").contentWindow.document.body.innerHTML = myText
				myInterval = setInterval(UpdateManual,10000);
			}
	}
	catch (e)
	{
		console.log('Error while getting widgets : '+ e.message)
	}
}

// ************************************************************************
// TooltipChecker - displays the Tooltip and the Params for the widget
// ************************************************************************

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
 realLength = txtCode.length

 // remove Line-Breaks
 if (txtCode.search('\n') >=0 && actLine > 0)
 	{ 
	 txtArray = txtCode.split('\n')
	 txtBeforeCursor = ''
	 for (var i = 0; i < actLine; i++)
		 {
		 txtBeforeCursor += txtArray[i]
		 }
	 realLength = txtCode.length - i
	 txtBeforeCursor += txtArray[i].substr(0,actColumn)
 	}
 else
	 {
	  txtBeforeCursor = txtCode.substr(0,actColumn) 
	 }
 // Check if we have multi widgets
 if (txtBeforeCursor.search('<br>') > -1)
	 {
	   multiWidget = txtBeforeCursor.split('<br>')
	   txtBeforeCursor = multiWidget[multiWidget.length-1].trim()
	 }
 
 
 txtBeforeCursor = txtBeforeCursor.split(" ").join("")
 if (txtBeforeCursor.substr(0,2) == "{{")
	 {
	 txtBeforeCursor = txtBeforeCursor.substr(2)
	 }
 
 
 
 // remove all closed brackets
 [txtBeforeCursor,allBracketsClosed] = removeBalancedBrackets(txtBeforeCursor)

 var myIcon =""
 var myIconVisible = "hidden"
 var myActColor = ""
 if (cm.state.completionActive)
	 {
	  try
	  {
	  selectedHint = cm.state.completionActive.widget.selectedHint
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Icon') > 0 )
			  
			 {
		  		myIcon ="icons/ws/"+cm.state.completionActive.data.list[selectedHint].text.replace("'","").replace("'","")+'.svg'
		  		myIconVisible = "visible"
			 }
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Std-Color') > 0  )
		  
		 {
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
	 	console.log('nothing to do for Preview of colors/icons in tooltip')
	 	myIcon =""
  		myIconVisible = "hidden"
  		myActColor = ""
	 }	
	 catch (e) { console.log('nothing to do')}
	 }
 txtCode = txtBeforeCursor

 myToolTip= document.getElementById("overlay")
 // Set the Dict
 
 if (txtBeforeCursor.length == 0 && actDictMode == 1)
 {
	 actParam = ''
	 actDictMode = 2
	 ChangeDict(2)

 }

 // Find the widget-Name
 bracketPos = txtCode.search('\\(')
 if (bracketPos < 1)
	 {
	 myToolTip.style.display = "none";
	 return
	 }

 actWidgetName=txtCode.substr(0,bracketPos).trim()
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
 myToolTip.style.width  =  BlockPosLeft-50+'px'

 myToolTip.style.height = window.innerHeight-200+'px'
 
// Check if we are still in a Array
 while (txtCode.search("\\[") > -1)
 {
  myPattern = txtCode.substr(txtCode.search("\\["))
  txtCode = txtCode.replace(myPattern,'')
 }
// Check if we are still in a dict
 while (txtCode.search("\\{") > -1)
 {
  myPattern = txtCode.substr(txtCode.search("\\{"))
  txtCode = txtCode.replace(myPattern,'')
 }
 
 if (txtCode.split('(').length > 1)
	{
	 myWidgetStep1 = txtCode.split("(")
	 myWidgetStep2 = myWidgetStep1[myWidgetStep1.length-2].split(",")
	 actWidgetName = myWidgetStep2[myWidgetStep2.length-1].trim()
	 txtCode = '(' + myWidgetStep1[myWidgetStep1.length-1]
	}
 
 if (txtCode.search('\\(') >= 0 )
    {
	  myToolParam = myWidgetJson[actWidgetName]['params']			// Text for
																	// Parmeterlist
	  myToolMacro = '<strong>'+actWidgetName+'</strong>\(%param%\)' 
	  // Build the Param-List
	  i=0
	  params={}
	  for (param in myWidgetJson[actWidgetName]['param'])
		 {
		 	params[("00" + i).slice(-2)] = param
		 	i += 1
		 }
 
	 
	 
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
        	  if (myWidgetJson[actWidgetName]['param'][actParam].hasOwnProperty("valid_values") &&
        		  actParam.toLowerCase().includes('item')
        		  )
        		 
	         	 {
        		  myRegex = ''
        		  displayKey = ''
	         	  for (type in myWidgetJson[actWidgetName]['param'][actParam]['valid_values'])
	         	  {
	         		  console.log("Type : " + myWidgetJson[actWidgetName]['param'][actParam]['valid_values'][type])
	         		  myType = myWidgetJson[actWidgetName]['param'][actParam]['valid_values'][type]
	         		  myRegex = myRegex + '\\| Item.*'+myType+'|'
	         		  displayKey =  displayKey + " " +myType +' |'
	         	  }
        		  myRegex = myRegex.substr(0,myRegex.length-1)
        		  displayKey = displayKey.substr(0,displayKey.length-1)
        		  actDictMode = 1
        		  ChangeDict(10,myRegex,displayKey)
	         	 }
        	  
        	  
              if (actParam != last_Param && myWidgetJson[actWidgetName]['param'][actParam].hasOwnProperty("type"))
            	  {
            	  console.log("found Parameter Type")
            	  
            	  switch (true)
            	  {
            	  case myWidgetJson[actWidgetName]['param'][actParam]['type'].toLowerCase().includes("color"):
            		  {
            		    actDictMode = 1 
            		    ChangeDict(5)
            		    break
            		  }
            	  case myWidgetJson[actWidgetName]['param'][actParam]['type'].toLowerCase().includes("colour"):
        		  {
            	   actDictMode = 1
            	   changeDict(5)
        		    break
        		  }            	  
            	  case myWidgetJson[actWidgetName]['param'][actParam]['type'].toLowerCase().includes("item"):
	        		  {
            		    actDictMode = 1
	          		    ChangeDict(1)
	          		    break
	          		  }            		  
            	  case myWidgetJson[actWidgetName]['param'][actParam]['type'].toLowerCase().includes("icon"):
	        		  {
            		    actDictMode = 1
	          		    ChangeDict(3)
	          		    break
	          		  }            		 
            	  case myWidgetJson[actWidgetName]['param'][actParam]['type'].toLowerCase().includes("image"):
        		  {
            		actDictMode = 1
          		    ChangeDict(3)
          		    break
          		  }
            	  case (txtCompleteDict.search(actParam+"@"+actWidgetName) > -1):
        		  {
          		      ChangeDict(9,actParam+"@"+actWidgetName)
          		      break
          		  }
            	  
            	  default:
        		  {
            		  actDictMode = 1
            		  ChangeDict(6)
        		  }
            	  }
            	  }
              
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
        						 '<td style="text-align:left;width:40%"><h2>Tooltip</h2></td>'+
        						 '<td style="width:40%;text-align: center;' + myActColor + '">'+
        						 '<img id="icon_preview" src="'+myIcon+'" style="height:60px; width:60px;visibility: '+myIconVisible+';">' +
        						 '</td>'+
        						 '<td style="width:20%;text-align: center;">'+
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
        	  myParamList = myWidgetJson[actWidgetName]['param'][actParam][param]
        	  if (param == 'valid_values')
        	   { myParamList = String(myParamList).split(" ").join("").split(",").join(", ") }
        	  myToolTipHdl.innerHTML += '<br>' + param + ' - ' + myParamList
        	}
  	  myToolTipHdl.innerHTML += '<br><h4>Author :'+ myWidgetJson[actWidgetName]['author']+ ' / ' + myWidgetJson[actWidgetName]['copyright']+ '</h4>' 
         
    }
   else
    {
      myToolTip.style.display = "none";
    }
}


// ************************************************************************
// change Search type for autocomplete wildcard or only at beginning
// ************************************************************************
function ChangeSearch()
{
	if (document.getElementById("Wildcard_search").checked == false)
		{
		 document.getElementById("Wildcard_search").checked = true
		 document.getElementById("Wildcard_label").classList.remove("ui-checkbox-off")
		 document.getElementById("Wildcard_label").classList.add("ui-checkbox-on")
		}
	else
		{
		 document.getElementById("Wildcard_search").checked = false
		 document.getElementById("Wildcard_label").classList.remove("ui-checkbox-on")
		 document.getElementById("Wildcard_label").classList.add("ui-checkbox-off")
		}
}

// ************************************************************************
// registerAutocompleteHelper - seen at Web-Interface of logics from shNG
// ************************************************************************

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
        if (document.getElementById("Wildcard_search").checked)
        	{
        	var regex = new RegExp('' + curWord, 'i');
        	}
        else
        	{
        	var regex = new RegExp('^' + curWord, 'i');
        	}
        if (searchtype == 2)
        	{
        	searchtype = 1
        	curWord = "..."
        	var regex = new RegExp('' + curWord, 'i');
        	}

        if (curWord.length >= 3)  {
            var oCompletions = {
                list: (!curWord ? [] : curDict.filter(function (item) {
                    return (item['displayText'].match(regex) && item['displayText'].match(second_regex));
                })).sort(function(a, b){
                    var nameA=a.text.toLowerCase(), nameB=b.text.toLowerCase()
                    if (nameA < nameB) // sort string ascending
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0 // default return value (no sorting)
                }),
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };

            return oCompletions;
        }
    });
}


// ************************************************************************
// copyToClipboard - copies the finalized Widget to the Clipboard
// ************************************************************************
const copyToClipboard = str => {
	  const el = document.createElement('textarea');  // Create a <textarea>
														// element
	  el.value = str;                                 // Set its value to the
														// string that you want
														// copied
	  el.setAttribute('readonly', '');                // Make it readonly to
														// be tamper-proof
	  el.style.position = 'absolute';                 
	  el.style.left = '-9999px';                      // Move outside the
														// screen to make it
														// invisible
	  document.body.appendChild(el);                  // Append the <textarea>
														// element to the HTML
														// document
	  const selected =            
	    document.getSelection().rangeCount > 0        // Check if there is any
														// content selected
														// previously
	      ? document.getSelection().getRangeAt(0)     // Store selection if
														// found
	      : false;                                    // Mark as false to know
														// no selection existed
														// before
	  el.select();                                    // Select the <textarea>
														// content
	  document.execCommand('copy');                   // Copy - only works as
														// a result of a user
														// action (e.g. click
														// events)
	  document.body.removeChild(el);                  // Remove the <textarea>
														// element
	  if (selected) {                                 // If a selection
														// existed before
														// copying
	    document.getSelection().removeAllRanges();    // Unselect everything
														// on the HTML document
	    document.getSelection().addRange(selected);   // Restore the original
														// selection
	  }
	};

	
// ************************************************************************
// function to close the tooltip-window
// ************************************************************************
function closeTooltip()
{
	myToolTip= document.getElementById("overlay")
	myToolTip.style.display = "none";
}

// ************************************************************************
// function to close the filter-window
// ************************************************************************
function closeFilterTip()
{
	myToolTip= document.getElementById("filteroverlay")
	myToolTip.style.display = "none";
}

// ************************************************************************
// function to add to dict
// ***********************************************************************
function add_2_Dict(add2Dict,widget2check)
{
	if (myParamType != false  && add2Dict)
	{
		myValidValues = myWidgetJson[widget2check]['param'][myParamType]['valid_values']
		
		for (Entry in myValidValues)
			{
			myValue = myValidValues[Entry]
			myDisplayText = myValue + "                             "
			myCompleteDict.push({ text: ""+myValue+"", displayText: myDisplayText.substr(0,18)+" | " + myParamType+"@"+myWidget });
			myCompleteDictwithQuotes.push({ text: "'"+myValue+"'", displayText: myDisplayText.substr(0,18)+" | " + myParamType+"@"+myWidget });
			console.log("added spec. Parameter to dict :" + myValue+" | " + myParamType+"@"+myWidget )
			}
	}
	
}

// ************************************************************************
// function to check if parameter should be added to the autocomplete dict
// ************************************************************************
function CheckValidValues()
{
	for (myWidget in myWidgetJson)
	{
	if (myWidgetJson[myWidget].hasOwnProperty("param"))
		{
		for (actParam in myWidgetJson[myWidget]["param"])
		{
			myParamType
			if (myWidgetJson[myWidget]['param'][actParam].hasOwnProperty("valid_values"))
			  {
			  if(myWidgetJson[myWidget]['param'][actParam]['type'] != 'item')
				  {
				  	console.log(myWidget + '-> Param : '+actParam + '-> valid_values :' + myWidgetJson[myWidget]['param'][actParam]['valid_values']+'|')
				  	myParamType = actParam
				  	add_2_Dict(true,myWidget)
				  	
				  }
			  }
		}
		}
	}
}

//************************************************************************
//function to change Dict to Auto-close quotes
//***********************************************************************
function changeCloseBrackets(byKey)
{
	quotestate = document.getElementById("switch_quotes").checked
	if (byKey != true)
		{
		quotestate =!document.getElementById("switch_quotes").checked
		}
	if (quotestate == false)
	{
 	 registerAutocompleteHelper('autocompleteHint', myCompleteDictwithQuotes);
	 console.log('Stored Items to Autocomplete dict')
	 CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
	 widgetCodeMirror.options.autoCloseBrackets.pairs = "\'\'**<>//__()[]{}``"
	 if (byKey == true)
		 {
		 document.getElementById("switch_quotes").checked = true
		 document.getElementById("switch_quotes_label").classList.remove("ui-checkbox-off")
		 document.getElementById("switch_quotes_label").classList.add("ui-checkbox-on")
		 }
	 modeBracketClose = 1
	}
	else
	{
	 registerAutocompleteHelper('autocompleteHint', myCompleteDictwithQuotes);
	 console.log('Stored Items to Autocomplete dict')
	 CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
	 widgetCodeMirror.options.autoCloseBrackets.pairs = "**<>//__()[]{}``"
		 if (byKey == true)
		 {
		 document.getElementById("switch_quotes").checked = false
		 document.getElementById("switch_quotes_label").classList.remove("ui-checkbox-on")
		 document.getElementById("switch_quotes_label").classList.add("ui-checkbox-off")
		 }
	 modeBracketClose = 2
	}
	console.log("changeCloseBrackets")
}
