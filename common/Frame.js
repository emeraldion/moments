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
 *	Frame object
 */

function Frame()
{
	this.currentStyle = {name:''};
	this.prevFramestyle = null;
	this.glassVisible = false;
}

Frame.prototype.load = function(style)
{
	this.currentStyle.name = Preferences.preferenceForKey(FRAME_STYLE_KEY);
	this.glassVisible = Preferences.preferenceForKey(FRAME_GLASS_VISIBLE_KEY);
	
	var style = null;
	if (this.currentStyle.name)
	{
		// Sync styles array with current style
		do {
			style = this.styles.pop();
			this.styles.unshift(style);
		} while (style.name != this.currentStyle.name);
	}
	else
	{
		style = this.styles.pop();
		this.styles.unshift(style);
		Preferences.setPreferenceForKey(style.name, FRAME_STYLE_KEY);
	}
	this.prevFramestyle = this.currentStyle = style;
	getObj("front").className = this.currentStyle.name;
};

Frame.prototype.swap = function(event)
{
	this.prevFramestyle = this.currentStyle;
	this.currentStyle = this.styles.pop();
	this.styles.unshift(this.currentStyle);

	getObj("front").className = this.currentStyle.name;

	this.fitSizeToPhoto(null, true);
	
	Preferences.setPreferenceForKey(this.currentStyle.name, FRAME_STYLE_KEY);
};

Frame.prototype.fitSizeToPhoto = function(event, immediately)
{
	// Adjust widget size after photo loading or frame swap
	if (window.widget)
	{
		if (immediately)
		{
			var deltaW = 2 * (this.currentStyle.left + this.currentStyle.passepartout - this.prevFramestyle.left - this.prevFramestyle.passepartout),
				deltaH = 2 * (this.currentStyle.passepartout - this.prevFramestyle.passepartout) + this.currentStyle.top +  this.currentStyle.bottom - this.prevFramestyle.top - this.prevFramestyle.bottom;
			window.resizeBy(deltaW, deltaH);
		}
		else
		{
			setTimeout("resizeWindow();", 1000);
		}
	}
};
