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


String.prototype.sprintf = function()
{
	var str = this;
	for (var i = 0; i < arguments.length; i++)
	{
		str = str.replace("%s", arguments[i]);
	}
	return str;
};

Object.objectWithValuesAndKeys = function()
{
	var obj = {};
	// Creates an object given value-key pairs
	var demilen = Math.floor(arguments.length / 2)
	for (var i = 0; i < demilen; i += 2)
	{
		obj[arguments[i + 1]] = arguments[i];
	}
	return obj;
};