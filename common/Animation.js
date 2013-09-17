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

function Fader(element)
{
	this.animation = {
		duration: 500,
		timer: null,
		from: 0.0,
		to: 1.0,
		now: 0.0,
		starttime: null,
		firstElement: element
	};
	
	return this;
}

Fader.prototype.easeIn = function()
{
	if (this.animation.timer != null)
	{
		clearInterval(this.animation.timer);
		this.animation.timer  = null;
	}
	var starttime = (new Date).getTime() - 13;
	this.animation.starttime = starttime;
	this.animation.timer = setInterval(function(obj)
		{
			obj.animate();
		},
		13,
		this);
	this.animation.from = this.animation.now < 1.0 ? this.animation.now : 0.0;
	this.animation.to = 1.0;
	this.animate();

};

Fader.prototype.easeOut = function()
{
	if (this.animation.timer != null)
	{
		clearInterval (this.animation.timer);
		this.animation.timer  = null;
	}

	var starttime = (new Date).getTime() - 13;
	this.animation.starttime = starttime;
	this.animation.timer = setInterval (function(obj)
		{
			obj.animate();
		},
		13,
		this);
	this.animation.from = this.animation.now ? this.animation.now : 1.0;
	this.animation.to = 0.0;
	this.animate();
	
};

Fader.prototype.animate = function()
{
	var T;
	var ease;
	var time = (new Date).getTime();   

	T = clampTo(time - this.animation.starttime, 0, this.animation.duration);

	if (T >= this.animation.duration)
	{
		clearInterval(this.animation.timer);
		this.animation.timer = null;
		this.animation.now = this.animation.to;
	}
	else
	{
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / this.animation.duration));
		this.animation.now = computeNextFloat(this.animation.from, this.animation.to, ease);
	}

	this.animation.firstElement.style.opacity = this.animation.now;
};

function Resizer(element)
{
	this.animation = {
		duration: 1000,
		timer: null,
		from: 0.0,
		to: 1.0,
		starttime: null,
		firstElement: element
	};

	return this;
}