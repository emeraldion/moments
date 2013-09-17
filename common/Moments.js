/**
 *	Moments Widget
 *
 *	© Claudio Procida 2005-2007
 *
 *	Disclaimer
 *
 *	The Moments Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not the author, assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */
 

/**
 *	Constants
 */

var WIDGET_HOME_URL = "http://www.emeraldion.it/software/widgets/moments.html";
var BACKWIDTH = 252;
var BACKHEIGHT = 252;

/**
 *	Variables
 */

var photo;
var frame;

var resizing = {duration:0, starttime:0, toWidth:1.0, nowWidth:0.0, fromWidth:0.0, toHeight:1.0, nowHeight:0.0, fromHeight:0.0, timer:null};
var flipShown = false;

/**
 *	Init function
 */
	
function setup()
{
	if (window.widget)
	{
	    widget.onshow = onshow;
	    widget.onhide = onhide;
	    widget.onremove = onremove;
	}
	
	window.onkeydown = onkeydown;

	new AppleGlassButton(getObj("done"),
		getLocalizedString("Done"),
		hidePreferences);
	new AppleGlassButton(getObj("donate"),
		getLocalizedString("Donate"),
		donate);
	new AppleGlassButton(getObj("help"),
		getLocalizedString("?"),
		function()
		{
			widget.system("/usr/bin/open Readme.rtfd", function()
			{
				widget.openApplication("com.apple.TextEdit");
			});
		});

	getObj("Slideshow.interval.label").innerHTML = getLocalizedString("Slideshow interval");
	getObj("Slideshow.autoStart.label").innerHTML = getLocalizedString("Auto Slideshow");
	getObj("frame.glassVisible.label").innerHTML = getLocalizedString("Glass reflection");
	getObj("photo.size.label").innerHTML = getLocalizedString("Picture size");
	for (var i = 0; i < getObj("photo.size.field").options.length; i++)
	{
		getObj("photo.size.field").options[i].text = getLocalizedString(getObj("photo.size.field").options[i].text);
	}
	for (var i = 0; i < getObj("Slideshow.interval.field").options.length; i++)
	{
		getObj("Slideshow.interval.field").options[i].text = getLocalizedString(getObj("Slideshow.interval.field").options[i].text);
	}
	
	getObj("update-available").onclick = function(e)
	{
		goToUrl(WIDGET_HOME_URL);
	};

	getObj("version").innerHTML = "v" + trim(getWidgetProperty("CFBundleVersion"));
	
	getObj("flip").onclick = showPreferences;
	getObj("flip").onmouseover = enterflip;
	getObj("flip").onmouseout = exitflip;

	// Register default values
	Preferences.registerDefaults(Object.objectWithValuesAndKeys(
		true, FRAME_GLASS_VISIBLE_KEY,
		PHOTO_DEFAULT_SIZE,	PHOTO_SIZE_KEY,
		0, PHOTO_ALBUM_LENGTH_KEY,
		0, PHOTO_ALBUM_INDEX_KEY,
		false, SLIDESHOW_AUTOSTART_KEY,
		SLIDESHOW_DEFAULT_INTERVAL, SLIDESHOW_INTERVAL_KEY));

	photo = new Photo();
	frame = new Frame();

	frame.load();
	photo.init();
	photo.load();

	var versionChecker = new VersionChecker();
	versionChecker.onUpdateCall(function(available, item, version)
		{
			if (available)
			{
				showObj("update-available");
			}
		});
	versionChecker.checkUpdate();
	
	if (Slideshow.autoStart)
	{
		Slideshow.play();
	}
}
window.addEventListener("load", setup, true);

/**
 *	Dashboard event handlers
 */

function onshow() {
	if (Slideshow.autoStart)
	{
		Slideshow.play();
	}
}

function onhide() {
	Slideshow.pause();
}

function onremove() {
	Preferences.clear();
}

/**
 *
 */

function onkeydown(e)
{
	switch (e.keyCode)
	{
		case 8:
		case 46:
			photo.clear();
			event.stopPropagation();
			event.preventDefault();
			break;
		case 37:
		case 38:
			Slideshow.previous();
			event.stopPropagation();
			event.preventDefault();
			break;
		case 39:
		case 40:
			Slideshow.next();
			event.stopPropagation();
			event.preventDefault();
			break;
		case 32:
			Slideshow.playPause();
			event.stopPropagation();
			event.preventDefault();
			break;
		case 187: // +
			if (e.metaKey)
			{
				if (photo.increaseSize())
				{
					event.stopPropagation();
					event.preventDefault();
				}
			}
			break;
		case 189: // -
			if (e.metaKey)
			{
				if (photo.decreaseSize())
				{
					event.stopPropagation();
					event.preventDefault();
				}
			}
			break;
	}
}

/**
 *	Preference handling functions
 */

function showPreferences()
{
	Slideshow.pause();

	var front = getObj("front");
	var back = getObj("back");
	
	frontWidth = window.outerWidth;
	frontHeight = window.outerHeight;

	window.resizeTo(max(BACKWIDTH, frontWidth), max(BACKHEIGHT, frontHeight));

	if (window.widget)
	{
		widget.prepareForTransition("ToBack");
	}

	window.resizeTo(BACKWIDTH, BACKHEIGHT);
       
	front.style.display="none";
	back.style.display="block";

	if (window.widget)
	{
		setTimeout ('widget.performTransition();', 0);
	}
}

function hidePreferences() {
	
	var front = getObj("front");
	var back = getObj("back");
	
	window.resizeTo(max(BACKWIDTH, frontWidth), max(BACKHEIGHT, frontHeight));

	if (window.widget)
		widget.prepareForTransition("ToFront");

	window.resizeTo(frontWidth, frontHeight);

	back.style.display="none";
	front.style.display="block";

	frame.load();
	photo.load();

	if (Slideshow.autoStart) {
		Slideshow.play();
	}
	// no need to adjust size here	

	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
}

/**
 *	Internationalization support
 */

function getLocalizedString (key) {
	try {
		var ret = localizedStrings[key];
		if (ret === undefined)
			ret = key;
		return ret;
	}
	catch (ex) {
	}
	return key;
}

/**
 *	Visual FX functions
 */

function resizeAnimate() {
	var T;
	var ease;
	var time = (new Date).getTime();
   

	T = clampTo(time-resizing.starttime, 0, resizing.duration);

	if (T >= resizing.duration) {
		clearInterval (resizing.timer);
		resizing.timer = null;
		resizing.nowWidth = resizing.toWidth;
		resizing.nowHeight = resizing.toHeight;
	}
	else {
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / resizing.duration));
		resizing.nowHeight = Math.round(computeNextFloat (resizing.fromHeight, resizing.toHeight, ease));
		resizing.nowWidth = Math.round(computeNextFloat (resizing.fromWidth, resizing.toWidth, ease));
	}
	window.resizeTo(resizing.nowWidth + 2 * frame.currentStyle.passepartout + 2 * frame.currentStyle.left,
					resizing.nowHeight + 2 * frame.currentStyle.passepartout + frame.currentStyle.top + frame.currentStyle.bottom);
	with (getObj("framecontent").style) {
		width = px(resizing.nowWidth);
		height = px(resizing.nowHeight);
	}
	with (getObj("photo").style) {
		width = px(resizing.nowWidth);
		height = px(resizing.nowHeight);
	}
	with (getObj("glass").style) {
		width = px(resizing.nowWidth);
		height = px(Math.round(resizing.nowWidth / 400 * 95));
	}
}

function mousemove (event) {
	if (!document.getElementById ("flip").fader)
	{
		document.getElementById("flip").fader = new Fader(document.getElementById("flip"));
	}
	if (!flipShown)
	{		
		document.getElementById("flip").fader.easeIn();
		flipShown = true;
	}
}

function mouseexit (event)
{
	if (!document.getElementById ("flip").fader)
	{
		document.getElementById("flip").fader = new Fader(document.getElementById("flip"));
	}
	if (flipShown)
	{
		document.getElementById("flip").fader.easeOut();
		flipShown = false;
	}
}

function dblclick (event)
{
	frame.swap();
}

function resizeWindow() {
	if (resizing.timer != null) {
		clearInterval (resizing.timer);
		resizing.timer  = null;
	}

	var starttime = (new Date).getTime() - 13;

	resizing.duration = 500;
	resizing.starttime = starttime;
	resizing.timer = setInterval ("resizeAnimate();", 13);
	resizing.fromWidth = window.outerWidth - 2 * frame.currentStyle.passepartout - 2 * frame.currentStyle.left;
	resizing.toWidth = photo.width;
	resizing.fromHeight = window.outerHeight - 2 * frame.currentStyle.passepartout - frame.currentStyle.top - frame.currentStyle.bottom;
	resizing.toHeight = photo.height;
	resizeAnimate();
}

function enterflip(event) {
}

function exitflip(event) {
}

/**
 *	Drag and drop handlers
 */

function dragdrop (event) {
	var uri = null;

	try {
		uri = event.dataTransfer.getData("text/uri-list");	// attempt to load the URL
	} catch (ex) {
		alert("No text/uri-list?");
	}

	if (uri)
	{
		// We can display only the first image... :(
		var pictures = uri.split("\n");
		for (var i = 0; i < pictures.length; i++)
		{
			// We can only add pictures
			if (pictures[i].match(/\.(jpe?g|gif|png)$/i))
			{
				photo.droppedPicture(pictures[i]);
			}
		}
	}
	event.stopPropagation();
	event.preventDefault();
}

// The dragenter, dragover, and dragleave functions are implemented but not used.  They
// can be used if you want to change the image when it enters the widget.

function dragenter (event) {
	event.stopPropagation();
	event.preventDefault();
}

function dragover (event) {
	event.stopPropagation();
	event.preventDefault();
}

function dragleave (event) {
	event.stopPropagation();
	event.preventDefault();
}

/**
 *	Notification and visualization functions
 */

/**
 *	Miscellaneous utilities
 */

function getStyle(id) {
	return getComputedStyle(getObj(id), '');
}

function getScale(width, height) { // returns scaling factors
	return (height > width) ? {width: width / height, height:1} : {width:1, height: height / width};
}

function getObj(id) { // retrieves an element
	return document.getElementById(id);
}

function showObj(id) { // shows an element
	getObj(id).style.display = 'block';
}

function hideObj(id) { // hides an element
	getObj(id).style.display = 'none';
}

function goToUrl(url) { // opens a URL
	if (window.widget) {
		widget.openURL(url);
	}
	else {
		window.open(url);
	}
}

function clampTo(value, min, max) { // constrains a value between two limits
	return value < min ? min : value > max ? max : value;
}

function limit3(value, a, b)
{
	return clampTo(value, Math.min(a, b), Math.max(a, b));
}

function computeNextFloat (from, to, ease) { // self explaining
	return from + (to - from) * ease;
}

function max(a, b) {
	return a > b ? a : b;
}

function serialize(obj) {
	if (typeof(obj) == "object") {
		var str = "{";
		for (var i in obj) {
			str += i+":"+obj[i]+",";
		}
		str += "timestamp:"+new Date().getTime()+"}";
		return str;
	}
	else
		return obj;
}

function __DEBUG(msg) {
	alert(msg);
}

function donate() {
	goToUrl("http://www.emeraldion.it/software/widgets/moments/donate.html");
}

function px(size)
{
	if (isNaN(size))
	{
		size = 0;
	}
	return size + "px";
}
