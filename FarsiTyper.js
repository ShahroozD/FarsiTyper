/*
FarsiTyper
Version: 0.7

این اسکریپت بر مبنای اسکریپت کاوه احمدی به نام farsitype نوشته شده است

گواهینامه این اسکریپت GPL میباشد
*/

// insertAdjacentHTML(), insertAdjacentText() and insertAdjacentElement() for Netscape 6/Mozilla by Thor Larholm me@jscript.dk
if (typeof HTMLElement!="undefined" && ! HTMLElement.prototype.insertAdjacentElement) {
	HTMLElement.prototype.insertAdjacentElement = function (where,parsedNode) {
		switch (where) {
			case 'beforeBegin':
				this.parentNode.insertBefore(parsedNode,this)
				break;
			case 'afterBegin':
				this.insertBefore(parsedNode,this.firstChild);
				break;
			case 'beforeEnd':
				this.appendChild(parsedNode);
				break;
			case 'afterEnd':
				if (this.nextSibling)
					this.parentNode.insertBefore(parsedNode,this.nextSibling);
				else
					this.parentNode.appendChild(parsedNode);
				break;
		}
	}

	HTMLElement.prototype.insertAdjacentHTML = function (where,htmlStr) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML)
	}

	HTMLElement.prototype.insertAdjacentText = function (where,txtStr) {
		var parsedText = document.createTextNode(txtStr)
		this.insertAdjacentElement(where,parsedText)
	}
}

var FarsiType = {
	// جانمایی صفحه کلید فارسی بر مبنای صفحه کلید پراستفاده تر
	farsiKey: [
		32,	33,	34,	35,	36,	37,	1548,	1711,
		41,	40,	215,	43,	1608,	45,	46,	47,
		48,	49,	50,	51,	52,	53,	54,	55,
		56,	57,	58,	1705,	44,	61,	46,	1567,
		64,	1616,	1584,	125,	1609,	1615,	1609,	1604,
		1570,	247,	1600,	1548,	47,	8217,	1583,	215,
		1563,	1614,	1569,	1613,	1601,	8216,	123,	1611,
		1618,	1573,	126,	1580,	1688,	1670,	94,	95,
		1662,	1588,	1584,	1586,	1740,	1579,	1576,	1604,
		1575,	1607,	1578,	1606,	1605,	1574,	1583,	1582,
		1581,	1590,	1602,	1587,	1601,	1593,	1585,	1589,
		1591,	1594,	1592,	60,	124,	62,	1617
	],
	enNUM: [
		48,	49,	50,	51,	52,	53,	54,	55,
		56,	57
	],
	Type: true,
	counter: 0,
	ShowChangeLangButton: 0,	// 0: Hidden / 1: Visible
	KeyBoardError: 0,			// 0: Disable FarsiType / 1: Show Error
	ChangeDir: 0,				// 0: No Action / 1: Do Rtl-Ltr / 2: Rtl-Ltr button
	UnSupportedAction: 0,		// 0: Disable FarsiType / 1: Low Support
	patternFA: 1,			// 0: No Action / 1: فارسی خروجی نمیدهد
}

FarsiType.enable_disable = function(Dis) {
	var invis, obj;
	
	if (!Dis.checked)  {
		FarsiType.Type = true;
		disable = false;
		color = 'darkblue';
	} else {
		FarsiType.Type = false;
		disable = true;
		color = '#ECE9D8';
	}

	if (FarsiType.ShowChangeLangButton == 1) { 
		for (var i=1; i<= FarsiType.counter; i++) {
			obj = document.getElementById('FarsiType_button_' + i);
			obj.disabled = disable;
			obj.style.backgroundColor = color;
		}
	}
}

FarsiType.Disable = function() {
	FarsiType.Type = false;
	var Dis = document.getElementById('disableFarsiType')
	if (Dis != null) {
		Dis.checked = true;
	}

	if (FarsiType.ShowChangeLangButton == 1) { 
		for (var i=1; i<= FarsiType.counter; i++) {
			obj = document.getElementById('FarsiType_button_' + i);
			obj.disabled = true;
			obj.style.backgroundColor = '#ECE9D8';
		}
	}
}


//shahrooz

FarsiType.enable = function() {
	FarsiType.Type = true;
	var Dis = null;
}





FarsiType.init = function() {

	var Inputs = document.getElementsByTagName('INPUT');
	for (var i=0; i<Inputs.length; i++) {
		if ( (Inputs[i].type.toLowerCase() == 'text' || Inputs[i].type.toLowerCase() == 'tel' || Inputs[i].type.toLowerCase() == 'number') && (Inputs[i].lang.toLowerCase() == 'fa' || Inputs[i].lang.toLowerCase() == 'fa-ir')) {
			FarsiType.counter++;
			new FarsiType.KeyObject(Inputs[i], FarsiType.counter);
		}
	}

	var Areas = document.getElementsByTagName('TEXTAREA');
	for (var i=0; i<Areas.length; i++) {
		if (Areas[i].lang.toLowerCase() == 'fa' || Areas[i].lang.toLowerCase() == 'fa-ir') {			
			FarsiType.counter++;
			new FarsiType.KeyObject(Areas[i], FarsiType.counter);
		}
	}
	
	var Dis = document.getElementById('disableFarsiType')
	if (Dis != null) {
		FarsiType.enable_disable (Dis);
		Dis.onclick = new Function( "FarsiType.enable_disable (this);" )
	}
}

FarsiType.KeyObject = function(z,x) {

	GenerateStr = "";
	if (FarsiType.ShowChangeLangButton == 1) {
		GenerateStr = GenerateStr + "<input type='button' id=FarsiType_button_"+x+" style='border: none; background-color:darkblue; font-size:11; color:white; font-family:tahoma; padding: 1px; margin: 1px; width: auto; height: auto;' value='FA' />&nbsp;";
	}
	if (FarsiType.ChangeDir == 2) {
		GenerateStr = GenerateStr  + "<input type='button' id=FarsiType_ChangeDir_"+x+" style='border: none; background-color:darkblue; font-size:11; color:white; font-family:tahoma; padding: 1px; margin: 1px; width: auto; height: auto;' value='RTL' />"
	}
	z.insertAdjacentHTML("afterEnd", GenerateStr);

	if (FarsiType.ShowChangeLangButton == 1) { 
		z.bottelm = document.getElementById ('FarsiType_button_' + x);
		z.bottelm.title = 'Change lang to english';
	}
	if (FarsiType.ChangeDir == 2) {
		z.Direlm = document.getElementById ('FarsiType_ChangeDir_' + x); 
	}

	z.farsi = true;
	z.dir = "rtl";
	z.align = "right";

	z.style.textAlign = z.align;
	z.style.direction = z.dir;

	setSelectionRange = function(input, selectionStart, selectionEnd) {
		input.focus()
		input.setSelectionRange(selectionStart, selectionEnd)
	}

	ChangeDirection = function() {
		if (z.dir == "rtl") {
			z.dir = "ltr";
			z.align = "left";
			z.Direlm.value = "LTR";
			z.Direlm.title = "Change direction: Right to Left"
		} else {
			z.dir = "rtl";
			z.align = "right";
			z.Direlm.value = "RTL";
			z.Direlm.title = "Change direction: Left to Right"
		}
		z.style.textAlign = z.align;
		z.style.direction = z.dir;
		z.focus();
	}

	ChangeLang = function(e, ze) {
		if(ze)
			z = ze;

		if (FarsiType.Type) {
			if (z.farsi) {
				z.farsi = false;
				if (FarsiType.ShowChangeLangButton == 1) { 
					z.bottelm.value = "EN";
					z.bottelm.title = 'Change lang to persian';
				}
				if (FarsiType.ChangeDir == 1) {
					z.style.textAlign = "left";
					z.style.direction = "ltr";
				}
			} else {
				z.farsi = true;
				if (FarsiType.ShowChangeLangButton == 1) { 
					z.bottelm.value = "FA";
					z.bottelm.title = 'Change lang to english';
				}
				if (FarsiType.ChangeDir == 1) {
					z.style.textAlign = "right";
					z.style.direction = "rtl";
				}
			}
			z.focus();
		}
		else{




		}
		



		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
		return false;
	}



	MobileConvert = function(e) {

		if (e == null)
			e = window.event;

		var key = this.value[this.selectionStart-1].charCodeAt(0)
		var eElement = e.target || e.originalTarget || e.srcElement;

		this.value = this.value.substring(0, (this.selectionStart-1)) + this.value.substring((this.selectionStart+1));

		if (true) {
			// اگر فارسی باشد
			if (key < 128) {
				var select_key = true;
				var pattern_key = true;

				// حروف بزرگ را هم به فارسی برگرداند
				if ((key >= 65 && key <= 90 && !e.shiftKey)) {

					key = FarsiType.farsiKey[key];
				}
				// میانبر انتخاب کل نوشته
				else if ((key >= 97 && key <= 122 ) && e.shiftKey || (key >= 65 && key <= 90 && e.shiftKey)){

					switch(key){
						case 72:
							key = 1570;
							break

						case 67:
							key = 1688
							break

						default:
							select_key = false
					}

				}
				else if (key >= 48 && key <= 57 && !e.shiftKey){

					pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
				}
				else{


					if(key == 46 && !e.shiftKey){
						pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
					}
					else if(key == 32 && !e.shiftKey){
						pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
					}
					else if (key == 32 && e.shiftKey)
						key = 8204;
					else
						key = FarsiType.farsiKey[key-32];
				}
				key = typeof key == 'string' ? key : String.fromCharCode(key);


				// شرط جدید برای آنکه بفهمیم که آیا از بخش میانبر آمده ایم یا نه
				// if (select_key || pattern_key) {
				try {
					
					var docSelection = document.selection;
					var selectionStart = eElement.selectionStart;
					var selectionEnd = eElement.selectionEnd;

					if ((select_key)) {
						if (typeof selectionStart == 'number') { 
							//FOR W3C STANDARD BROWSERS
							var nScrollTop = eElement.scrollTop;
							var nScrollLeft = eElement.scrollLeft;
							var nScrollWidth = eElement.scrollWidth;
								

							eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
							setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);
			
							var nW = eElement.scrollWidth - nScrollWidth;
							if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
						} else if (docSelection) {
							var nRange = docSelection.createRange();
							nRange.text = key;
							nRange.setEndPoint('StartToEnd', nRange);
							nRange.select();
						}
					}
		
				} catch(error) {
					try {
						// IE
						e.keyCode = key
					} catch(error) {
						try {
							// OLD GECKO
							e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
						} catch(error) {
							//OTHERWISE
							if (FarsiType.UnSupportedAction == 0) {
								alert('Sorry! no FarsiType support')
								FarsiType.Disable();
								var Dis = document.getElementById('disableFarsiType')
								if (Dis != null) {
									Dis.disabled = true;
								}
								return false;
							} else {
								
								eElement.value += key;					
							}
						}
					}
				}
				// }

				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}
			else{


				var pattern_key = (((FarsiType.patternFA) ? false : true));

				// var key = e.which || e.charCode || e.keyCode;
				// var eElement = e.target || e.originalTarget || e.srcElement;

				if ((key >= 1776 && key <= 1785 && !e.shiftKey)) {

					// var pattern_key = (false || (eElement.getAttribute('nomask') === "true"));
					var pattern_key = false;
					key = FarsiType.enNUM[key-1776];
				}
				else if ((key >= 1632 && key <= 1641 && !e.shiftKey)) {
					var pattern_key = false;
					key = FarsiType.enNUM[key-1632];
				}


				key = typeof key == 'string' ? key : String.fromCharCode(key);

				if (!pattern_key){

					try {
					
						var docSelection = document.selection;
						var selectionStart = eElement.selectionStart;
						var selectionEnd = eElement.selectionEnd;

						if (typeof selectionStart == 'number') { 
							//FOR W3C STANDARD BROWSERS
							var nScrollTop = eElement.scrollTop;
							var nScrollLeft = eElement.scrollLeft;
							var nScrollWidth = eElement.scrollWidth;
		
							eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
							setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);
			
							var nW = eElement.scrollWidth - nScrollWidth;
							if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
						} else if (docSelection) {
							var nRange = docSelection.createRange();
							nRange.text = key;
							nRange.setEndPoint('StartToEnd', nRange);
							nRange.select();
						}
		
					} catch(error) {
						try {
							// IE
							e.keyCode = key
						} catch(error) {
							try {
								// OLD GECKO
								e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
							} catch(error) {
								//OTHERWISE
								if (FarsiType.UnSupportedAction == 0) {
									alert('Sorry! no FarsiType support')
									FarsiType.Disable();
									var Dis = document.getElementById('disableFarsiType')
									if (Dis != null) {
										Dis.disabled = true;
									}
									return false;
								} else {
									eElement.value += key;					
								}
							}
						}
					}
				}

				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}
		}
		

		return true;
	}




	Convert = function(e) {

		if (e == null)
			e = window.event;

		var key = e.which || e.charCode || e.keyCode;
		var eElement = e.target || e.originalTarget || e.srcElement;

		if (e.ctrlKey && key == 32) {
			ChangeLang(e, z);
		}


		//اگر زبان در میانه نوشتن تغییر کند میتوان کنترل کرد
		if (key < 128) {
			if (!FarsiType.Type) {
				FarsiType.enable();
			}
		}

		if (true) {
			if (
				(e.charCode != null && e.charCode != key) ||
				(e.which != null && e.which != key) ||
				(e.ctrlKey || e.altKey || e.metaKey) ||
				(key == 13 || key == 27 || key == 8)
			) return true;

			//check windows lang
			if (key > 128) {
				if (FarsiType.KeyBoardError == 0) {
					FarsiType.Disable();
				} else {
					alert("صفحه کلید خود را به انگلیسی برگردانید");
					return false;
				}
			}

			// اگر فارسی باشد
			if (FarsiType.Type && z.farsi) {
				var select_key = true;
				var pattern_key = true;

				// حروف بزرگ را هم به فارسی برگرداند
				if ((key >= 65 && key <= 90 && !e.shiftKey)) {

					key = FarsiType.farsiKey[key];
				}
				// میانبر انتخاب کل نوشته
				else if ((key >= 97 && key <= 122 ) && e.shiftKey || (key >= 65 && key <= 90 && e.shiftKey)){

					switch(key){
						case 72:
							key = 1570;
							break

						case 67:
							key = 1688
							break

						default:
							select_key = false
					}

				}
				else if (key >= 48 && key <= 57 && !e.shiftKey){

					pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
				}
				else{


					if(key == 46 && !e.shiftKey){
						pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
					}
					else if(key == 32 && !e.shiftKey){
						pattern_key = (((FarsiType.patternFA) ? false : true) || (eElement.getAttribute('nomask') === "true"));
					}
					else if (key == 32 && e.shiftKey)
						key = 8204;
					else
						key = FarsiType.farsiKey[key-32];
				}
				key = typeof key == 'string' ? key : String.fromCharCode(key);


				// شرط جدید برای آنکه بفهمیم که آیا از بخش میانبر آمده ایم یا نه
				// if (select_key || pattern_key) {
				try {
					
					var docSelection = document.selection;
					var selectionStart = eElement.selectionStart;
					var selectionEnd = eElement.selectionEnd;

					if ((select_key && pattern_key)) {
						if (typeof selectionStart == 'number') { 
							//FOR W3C STANDARD BROWSERS
							var nScrollTop = eElement.scrollTop;
							var nScrollLeft = eElement.scrollLeft;
							var nScrollWidth = eElement.scrollWidth;
								

							eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
							setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);
			
							var nW = eElement.scrollWidth - nScrollWidth;
							if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
						} else if (docSelection) {
							var nRange = docSelection.createRange();
							nRange.text = key;
							nRange.setEndPoint('StartToEnd', nRange);
							nRange.select();
						}
					}
		
				} catch(error) {
					try {
						// IE
						e.keyCode = key
					} catch(error) {
						try {
							// OLD GECKO
							e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
						} catch(error) {
							//OTHERWISE
							if (FarsiType.UnSupportedAction == 0) {
								alert('Sorry! no FarsiType support')
								FarsiType.Disable();
								var Dis = document.getElementById('disableFarsiType')
								if (Dis != null) {
									Dis.disabled = true;
								}
								return false;
							} else {
								
								eElement.value += key;					
							}
						}
					}
				}
				// }

				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}
			else{

				var pattern_key = (((FarsiType.patternFA) ? false : true) || !(eElement.getAttribute('nomask') === "true"));

				var key = e.which || e.charCode || e.keyCode;
				var eElement = e.target || e.originalTarget || e.srcElement;

				if ((key >= 1776 && key <= 1785 && !e.shiftKey)) {

					// var pattern_key = (false || (eElement.getAttribute('nomask') === "true"));
					var pattern_key = false;
					key = FarsiType.enNUM[key-1776];
				}
				else if ((key >= 1632 && key <= 1641 && !e.shiftKey)) {
					var pattern_key = false;
					key = FarsiType.enNUM[key-1632];
				}


				key = typeof key == 'string' ? key : String.fromCharCode(key);

				if (!pattern_key){

					try {
					
						var docSelection = document.selection;
						var selectionStart = eElement.selectionStart;
						var selectionEnd = eElement.selectionEnd;

						if (typeof selectionStart == 'number') { 
							//FOR W3C STANDARD BROWSERS
							var nScrollTop = eElement.scrollTop;
							var nScrollLeft = eElement.scrollLeft;
							var nScrollWidth = eElement.scrollWidth;
		
							eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
							setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);
			
							var nW = eElement.scrollWidth - nScrollWidth;
							if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
						} else if (docSelection) {
							var nRange = docSelection.createRange();
							nRange.text = key;
							nRange.setEndPoint('StartToEnd', nRange);
							nRange.select();
						}
		
					} catch(error) {
						try {
							// IE
							e.keyCode = key
						} catch(error) {
							try {
								// OLD GECKO
								e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
							} catch(error) {
								//OTHERWISE
								if (FarsiType.UnSupportedAction == 0) {
									alert('Sorry! no FarsiType support')
									FarsiType.Disable();
									var Dis = document.getElementById('disableFarsiType')
									if (Dis != null) {
										Dis.disabled = true;
									}
									return false;
								} else {
									eElement.value += key;					
								}
							}
						}
					}
				}

				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
			}
		}
		

		return true;
	}

	if (FarsiType.ShowChangeLangButton == 1) { z.bottelm.onmouseup = ChangeLang; }
	if (FarsiType.ChangeDir == 2) { z.Direlm.onmouseup = ChangeDirection; }


	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		z.onkeyup = MobileConvert;}
	else{
		z.onkeypress = Convert;
	}

	
}

if (window.attachEvent) {
	window.attachEvent('onload', FarsiType.init)
} else if (window.addEventListener) {
	window.addEventListener('load', FarsiType.init, false)
}
