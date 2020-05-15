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
var myCompleteDictwithQuotes = []
var myColorsDict=[]
var items_loaded = false
var icons_loaded = false
var widgets_loaded = false
var NewWindowLoaded = false
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


$( document ).ready(function() {
	myInterval = setInterval(getall,1000);
});


//************************************************************************
// UpdateManual()
//************************************************************************
function UpdateManual()
{
 clearInterval(myInterval)
 var iframe = document.getElementById('render_frame');
 iframe.src = iframe.src;
}
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
	for (i=0;i<myCompleteDict.length-1;i++)
	  {
		txtCompleteDict+= myCompleteDict[i].displayText + ','
	  }
}

//************************************************************************
//ChangeDict - set acutal Dict for autocomplete
//************************************************************************

function ChangeDict(selectedDict,myKey,displayKey)
{
	if (actDictMode == 1 && ( last_Param == actParam && actParam != '' ))
	 { return }
	last_Param = actParam
	
	console.log('Change Dict')
	switch (selectedDict)
	{
	case 1:
		second_regex = new RegExp('\\|\\ Item.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Items</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor=""			
		break;
	case 2:
		second_regex = new RegExp('\\|\\ Widget.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Widgets</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor=""			
		break;
		
	case 3:
		second_regex = new RegExp('\\|\\ Icon.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Icons</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor=""			
		break;
	case 4:
		second_regex = new RegExp('.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>ALL</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor=""			
		break;
	case 5:
		second_regex = new RegExp('\\|\\ Color.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Colors</strong>'
		document.getElementById("selected_dict").style.backgroundColor=""
		break;
	case 6:
		second_regex = new RegExp('\\|\\ XXXXX.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>Off</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break;
	case 9:
		second_regex = new RegExp('\\|\\ '+myKey+'.*', 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>'+myKey+'</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor="rebeccapurple"
		break;
	case 10:
		second_regex = new RegExp(myKey, 'i');
		document.getElementById("selected_dict").innerHTML = '<strong>'+displayKey+'</strong>'
		document.getElementById("td_selected_dict").style.backgroundColor="green"
		break;		
	default:
		document.getElementById("td_selected_dict").style.backgroundColor=""
		break
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
    	myCompleteDict.push({ text: ""+result[i]+"", displayText: ''+result[i]+" | Color" });
    	myCompleteDictwithQuotes.push({ text: "'"+result[i]+"'", displayText: ''+result[i]+" | Color" });
    	
    }
	result = myStdColors
    /*
	for (i = 0; i < result.length; i++)
    {
    	myCompleteDict.push({ text: "'"+result[i]+"'"  , displayText: ''+result[i]+" | Color" });
    }
    */
	document.getElementById("colors_loaded").src = 'pics/led/lamp_green.png'
	$("#colors_loaded").closest("td")[0].childNodes[2].data="Colors loaded [ "+ myColorsDict.length +" ]"
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
		        	   myCompleteDict.push({ text: ""+result[i].substring(0,result[i].length-4)+"", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
		        	   myCompleteDictwithQuotes.push({ text: "'"+result[i].substring(0,result[i].length-4)+"'", displayText: result[i].substring(0,result[i].length-4)+" | Icon" });
	        		   }
		        }
				
			   icons_loaded = true
  			   document.getElementById("icons_loaded").src = 'pics/led/lamp_green.png'
 			   $("#icons_loaded").closest("td")[0].childNodes[2].data="Icons loaded [ "+ myIcons.length +" ]"
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
				registerAutocompleteHelper('autocompleteHint', myCompleteDict);
				console.log('Stored Items to Autocomplete dict')
				CodeMirror.commands.autocomplete_items = function(cm)
					{
				     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
					}
				document.getElementById("items_loaded").src = 'pics/led/lamp_green.png'
	 			$("#items_loaded").closest("td")[0].childNodes[2].data="Items loaded [ "+ myItems.length +" ]"					
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
	 txtCode = txtCode.split("\n").join("")
	 //txtCode = txtCode.replace('\n','')
	 txtCode = txtCode.split(" ").join("")
	 //txtCode = txtCode.replace(' ','')
	 
	 while (txtCode.search('{') >= 0)
	 {
 		txtCode = txtCode.replace("{","")
	 }
	 while (txtCode.search('}') >=0 )
	 	{
		 txtCode = txtCode.replace("}","")
	 	}
	 copyToClipboard("{{ "+txtCode+" }}")
	 newUrl = window.location.href.substr(0,window.location.href.search("=")+1) + 'construct'
	 if (document.getElementById("render_2_Window").checked == false)
		 {
			 $.ajax({
			   url: "lib/widget_constructor/widget_constructor.php",
			   method: "GET",
			   dataType: "text",
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
			   dataType: "text",
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
		 
		  if (document.getElementById("open_new_Window").checked == true)
			  { NewWindowLoaded = false }
		  
		  if (NewWindowLoaded == false)
			  {
			  window.open(newUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); 
			  NewWindowLoaded = true
			  document.getElementById("open_new_Window").checked = false
		 	  document.getElementById("open_new_Window_label").classList.remove("ui-checkbox-on")
		 	  document.getElementById("open_new_Window_label").classList.add("ui-checkbox-off")
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
		Widget2Remove = []
		myText = ''
		actWidgets = document.getElementById('widget_list');
	    myWidgetList = actWidgets.dataset.mywidgetlist;
	    myWidgetJson = JSON.parse(myWidgetList);
	    for (widget in myWidgetJson) {
	    	if (myWidgetJson[widget].hasOwnProperty("deprecated") && remove_deprecated)
	    		{
	    		 Widget2Remove.push(widget) 
	    		 continue
	    		}
	    	if (myWidgetJson[widget].hasOwnProperty("param"))
	    		{
			    	CheckParam2Dict(widget, true)

			    	myWidgets.push({ text: widget+"", displayText: widget+" | Widget" });
					myCompleteDict.push({ text: widget+"", displayText: widget+" | Widget" });
					myCompleteDictwithQuotes.push({ text: ""+widget+"", displayText: widget+" | Widget" });
	    		}
	    	else
	    		{
	    		myText += 'got : ' + widget + ' - without params<br>'
	    		}
		}
	    widgets_loaded = true
	    for (widget in Widget2Remove)
	    	{
	    	delete myWidgetJson[Widget2Remove[widget]]
	    	console.log("removed deprecated widget :"+Widget2Remove[widget])
	    	}
	    document.getElementById("widgets_loaded").src = 'pics/led/lamp_green.png'
		$("#widgets_loaded").closest("td")[0].childNodes[2].data="Widgets loaded [ "+ myWidgets.length +" ]"
		if (myText != '')
			{
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
 // First remove the brace
 while (txtCode.search('{') >= 0)
	 {
 		txtCode = txtCode.replace("{","")
	 }
 while (txtCode.search('}') >=0 )
 	{
	 txtCode = txtCode.replace("}","")
 	}
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
	  // console.log('completionActive is set')
	  try
	  {
	  selectedHint = cm.state.completionActive.widget.selectedHint
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Icon') > 0 )
			  
			 {
		  		// console.log('Icon is selected' + cm.state.completionActive.data.list[selectedHint].displayText)
		  		myIcon ="icons/ws/"+cm.state.completionActive.data.list[selectedHint].text.replace("'","").replace("'","")+'.svg'
		  		myIconVisible = "visible"
			 }
	  if (cm.state.completionActive.data.list[selectedHint].displayText.search(' Color') > 0 )
		  
		 {
	  		// console.log('Color is selected' + cm.state.completionActive.data.list[selectedHint].displayText)
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
	 //ChangeDict(2)
	 return
	 }

 actWidgetName=txtCode.substr(0,bracketPos).trim()
 if(myWidgetJson[actWidgetName] == null)
	 {
	 myToolTip.style.display = "none";
	 //ChangeDict(2)
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
 
 // Remove the the items-Arrays
 BracketArray = []
 pattern = new RegExp("\\[.*?\\]","g")
 BracketArray = txtCode.match(pattern)
 try
 {
	 while (BracketArray.length > 0)
		 {
		  myReplacement = BracketArray.pop()
		  txtCode = txtCode.replace(myReplacement,"{}")
		 }
 }
 catch (e)
 {  }
  
 
 // Replace the closed brackets
 Array2Replace = txtCode.substr(bracketPos+1).match("\\(.*?\\)")
 try
 {
	 while (Array2Replace.length > 0)
	 {
	  txtReplace = Array2Replace.pop()
	  txtCode = txtCode.replace(txtReplace,"{}")
	 }
 }
 catch (e) {}
 // Count the brackets in summary
 openBracketArray = []
 closeBracketArray = []
 for (i=0;i< txtCode.length;i++)
	 {
	  if (txtCode.substr(i,1) == '(')
		  { openBracketArray.push(i) }
	  if (txtCode.substr(i,1) == ')')
	  { closeBracketArray.push(i) }
	 }
 // Check if Widget is nested
 myTestArray = $.extend(true,[],openBracketArray)
 while (myTestArray.length > 0)
	 {
	   
	 	 actBracketCount = myTestArray.pop()
		 a=""
		 i=1
		 while (a!=" " && a!="," && a !="[" && a != "(" && a != "$" && i <= actBracketCount)
		 {
		  a = txtCode.substr(actBracketCount-i,1);i++
		 }
	 	 myNewWidget = txtCode.substr(actBracketCount-i+1,i-1).replace(",","").trim()
	 	 myNewWidget.replace("[","")
	 	 myNewWidget.replace("(","")
		 if (myNewWidget in myWidgetJson)
			 {
			 myTestArray=[]
			 actWidgetName = myNewWidget
			 txtCode = txtCode.substr(txtCode.search(myNewWidget))
			 // get back the commas for this widget
			 txtCode = txtCode.split("$").join(",")
			 break
			 }
	 }
// Check if we are still in an Array
 while (txtCode.search("\\[") > -1)
 {
  myPattern = txtCode.substr(txtCode.search("\\[")+1)
  myReplacement = myPattern.split(",").join('$')
  txtCode = txtCode.replace(myPattern,myReplacement)
  txtCode = txtCode.replace("\[","{")
 }
 
 if (txtCode.search('\\(') >= 0 && openBracketArray.length != closeBracketArray.length)
    {
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
        		 ( actParam.toLowerCase() == 'item' || actParam.toLowerCase() == 'items'))
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
          			  console.log("Found type parameters in dict")
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
        	  myToolTipHdl.innerHTML += '<br>' + param + ' - ' + myWidgetJson[actWidgetName]['param'][actParam][param]
        	}
  	  myToolTipHdl.innerHTML += '<br><h4>Author :'+ myWidgetJson[actWidgetName]['author']+ ' / ' + myWidgetJson[actWidgetName]['copyright']+ '</h4>' 
         
    }
   else
    {
      myToolTip.style.display = "none";
    }
}


//************************************************************************
// change Search type for autocomplete wildcard or only at beginning
//************************************************************************
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
        // "Pattern 1 : /\\|\\ W.*/Pattern 2: /.*lig.*/"

        if (curWord.length >= 3)  {
            var oCompletions = {
                list: (!curWord ? [] : curDict.filter(function (item) {
                    return (item['displayText'].match(regex) && item['displayText'].match(second_regex));
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


//************************************************************************
// copyToClipboard - copies the finalized Widget to the Clipboard
//************************************************************************
const copyToClipboard = str => {
	  const el = document.createElement('textarea');  // Create a <textarea> element
	  el.value = str;                                 // Set its value to the string that you want copied
	  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	  el.style.position = 'absolute';                 
	  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	  const selected =            
	    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
	      ? document.getSelection().getRangeAt(0)     // Store selection if found
	      : false;                                    // Mark as false to know no selection existed before
	  el.select();                                    // Select the <textarea> content
	  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	  document.body.removeChild(el);                  // Remove the <textarea> element
	  if (selected) {                                 // If a selection existed before copying
	    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
	    document.getSelection().addRange(selected);   // Restore the original selection
	  }
	};

	
//************************************************************************
// function to close the tooltip-window
//************************************************************************	
function closeTooltip()
{
	myToolTip= document.getElementById("overlay")
	myToolTip.style.display = "none";
}

//************************************************************************
// function to check if parameter should be added to the autocomplete dict
//************************************************************************	
function CheckParam2Dict(widget2check, add2Dict)
{
	if (widget2check == "stateengine.state")
		{
		console.log("stateengine.state")
		}
	myParamType = false
	if (myWidgetJson[widget2check]['param'].hasOwnProperty("type"))
		{ myParamType = "type" }
	else if (myWidgetJson[widget2check]['param'].hasOwnProperty("mode"))
		{ myParamType = "mode" }
	else if (myWidgetJson[widget2check]['param'].hasOwnProperty("style"))
		{ myParamType = "style" }
	else if (myWidgetJson[widget2check]['param'].hasOwnProperty("colormodel"))
		{ myParamType = "colormodel" }
	else if (myWidgetJson[widget2check]['param'].hasOwnProperty("orientation"))
		{ myParamType = "orientation" }
	else if (myWidgetJson[widget2check]['param'].hasOwnProperty("valueType"))
		{ myParamType = "valueType" }
	
	if (myParamType != false  && add2Dict)
		{
		if (myWidgetJson[widget2check]['param'][myParamType].hasOwnProperty("desc"))
			{
			myPattern = patt1 = new RegExp("\'.*?\'","g")
			myTypes = []
			myTypes =myWidgetJson[widget2check]["param"][myParamType]["desc"].match(patt1)
			myTypes = String(myTypes).split("'").join("").split(",")
			myUniqueTypes = []
			try
			{
				while (myTypes.length > 0)
				 {
				  myItem2Push = myTypes.pop().toLowerCase()
				  if (String(myUniqueTypes).search(myItem2Push) < 0 )
				   {
					  myUniqueTypes.push(myItem2Push) 
				   }
				 }
			}
			catch (e) {}
			while (myUniqueTypes.length > 0)
				{
				myValue = myUniqueTypes.pop()
				myDisplayText = myValue + "                             "
				myCompleteDict.push({ text: ""+myValue+"", displayText: myDisplayText.substr(0,18)+" | " + myParamType+"@"+widget });
				myCompleteDictwithQuotes.push({ text: "'"+myValue+"'", displayText: myDisplayText.substr(0,18)+" | " + myParamType+"@"+widget });
				console.log("added spec. Parameter to dict :" + myValue+" | " + myParamType+"@"+widget )
				}
			}
		}
	
 return myParamType	
}

function changeCloseBrackets()
{
	if (document.getElementById("switch_quotes").checked == false)
	{
	 registerAutocompleteHelper('autocompleteHint', myCompleteDict);
	 console.log('Stored Items to Autocomplete dict')
	 CodeMirror.commands.autocomplete_items = function(cm)
			{
		     CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
			}
	 widgetCodeMirror.options.autoCloseBrackets.pairs = "\"\"**<>//__()[]{}''``"
	 document.getElementById("switch_quotes").checked = true
	 document.getElementById("switch_quotes_label").classList.remove("ui-checkbox-off")
	 document.getElementById("switch_quotes_label").classList.add("ui-checkbox-on")
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
	 widgetCodeMirror.options.autoCloseBrackets.pairs = "\"\"**<>//__()[]{}``"
	 document.getElementById("switch_quotes").checked = false
	 document.getElementById("switch_quotes_label").classList.remove("ui-checkbox-on")
	 document.getElementById("switch_quotes_label").classList.add("ui-checkbox-off")
	 modeBracketClose = 2
	}
	console.log("changeCloseBrackets")
}