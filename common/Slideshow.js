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
 *	Slideshow object
 */

var SLIDESHOW_DEFAULT_INTERVAL = 20000;

var Slideshow = {

	interval: SLIDESHOW_DEFAULT_INTERVAL,
	timer: null,
	autoStart: false,
	current: 0,
	running: false,
	
	init: function()
	{
		this.interval = Preferences.preferenceForKey(SLIDESHOW_INTERVAL_KEY) ||
			SLIDESHOW_DEFAULT_INTERVAL;
		this.autoStart = Preferences.preferenceForKey(SLIDESHOW_AUTOSTART_KEY);
	},
	
	pause: function()
	{
		if (!this.running) return;
		
		clearInterval(this.timer);
		this.timer = null;
		this.running = false;

		new Fader(document.getElementById("pause")).easeOut();
	},
	
	play: function()
	{
		if (this.running) return;
		if (photo.album.length < 2) return;
		
		this.timer = setInterval(function(obj)
			{
				obj.next();
			},
			this.interval,
			this);
		this.running = true;
		new Fader(document.getElementById("play")).easeOut();	
	},
	
	playPause: function()
	{
		if (photo.album.length < 2) return;
		
		if (this.running)
		{
			this.pause();
		}
		else
		{
			this.play();
		}
	},
		
	previous: function()
	{
		if (photo.album.length < 2) return;
		
		this.current = this.current - 1 < 0 ? photo.album.length - 1 : this.current - 1;
		photo.loadAlbumPhotoAtIndex(this.current);
	},

	next: function()
	{
		if (photo.album.length < 2) return;
		
		this.current = this.current + 1 < photo.album.length ? this.current + 1 : 0;
		photo.loadAlbumPhotoAtIndex(this.current);
	}
};

window.addEventListener('load', function()
	{
		Slideshow.init();
	},
	false);