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
 *	Preferences object
 */

function _pref_key_to_field_name(key)
{
	return key.substring(0, key.indexOf("_"));
}

function _field_name_to_pref_key(name)
{
	return name + "_" + widget.identifier;
}

var PREFERENCES_DEFER_INTERVAL = 5000;

var FRAME_STYLE_KEY = _field_name_to_pref_key("frame.style");
var FRAME_GLASS_VISIBLE_KEY = _field_name_to_pref_key("frame.glassVisible");

var PHOTO_SIZE_KEY = _field_name_to_pref_key("photo.size");
var PHOTO_ALBUM_LENGTH_KEY = _field_name_to_pref_key("photo.album.length");
var PHOTO_ALBUM_INDEX_KEY = _field_name_to_pref_key("photo.album.index");
var PHOTO_ALBUM_ITEM_KEY = _field_name_to_pref_key("photo.album.%s");

var SLIDESHOW_AUTOSTART_KEY = _field_name_to_pref_key("Slideshow.autoStart");
var SLIDESHOW_INTERVAL_KEY = _field_name_to_pref_key("Slideshow.interval");

var Preferences = {
	
	_keys: [
		FRAME_STYLE_KEY,
		FRAME_GLASS_VISIBLE_KEY,

		PHOTO_SIZE_KEY,
		PHOTO_ALBUM_LENGTH_KEY,
		PHOTO_ALBUM_INDEX_KEY,

		SLIDESHOW_AUTOSTART_KEY,
		SLIDESHOW_INTERVAL_KEY
	],
	
	_dictionary: {},
	_defaults: {},
	_deferSaveTimer: null,
	
	registerDefaults: function(dict)
	{
		this._defaults = dict;
	},
	
	preferenceForKey: function(key)
	{
		if (typeof this._dictionary[key] == "undefined")
		{
			var val = widget.preferenceForKey(key);
			if ((typeof val == "undefined") &&
				(typeof this._defaults[key] != "undefined"))
			{
				this._dictionary[key] = this._defaults[key];
			}
			else
			{
				this._dictionary[key] = val;				
			}
		}
		return this._dictionary[key];
	},

	setPreferenceForKey: function(val, key)
	{
		if (this._dictionary[key] != val)
		{
			this._dictionary[key] = val;
			this._updatePreferencePane();
			this._deferSave();
		}
	},

	removePreferenceForKey: function(key)
	{
		widget.setPreferenceForKey(null, key);
	},
	
	save: function()
	{
		// Clear previous photo list
		var len = widget.preferenceForKey(PHOTO_ALBUM_LENGTH_KEY);
		for (var i = 0; i < len; i++) {
			widget.setPreferenceForKey(null, PHOTO_ALBUM_ITEM_KEY.sprintf(i));
		}

		for (var key in this._dictionary)
		{
			if (typeof this._dictionary[key] != "undefined")
			{
				widget.setPreferenceForKey(this._dictionary[key], key);				
			}
		}
	},
	
	clear: function()
	{
		// Clear album
		var len = widget.preferenceForKey(PHOTO_ALBUM_LENGTH_KEY);
		for (var i = 0; i < len; i++)
		{
			widget.setPreferenceForKey(null, PHOTO_ALBUM_ITEM_KEY.sprintf(i));
		}

		for (var i = 0; i < this._keys.length; i++)
		{
			this.removePreferenceForKey(this._keys[i]);
		}
	},
	
	_updatePreferencePane: function()
	{
		for (var i = 0; i < getObj("prefFrm").elements.length; i++)
		{
			var el = getObj("prefFrm").elements[i];
			var val = this._dictionary[_field_name_to_pref_key(el.name)];
			if (el.type == "checkbox")
			{
				el.checked = (typeof val == "undefined") ? el.defaultChecked : val;
			}
			else if (el.type == "select-one")
			{
				el.selectedIndex = 2;
				for (var j = 0; j < el.options.length; j++)
				{
					if (el.options[j].value == val)
					{
						el.selectedIndex = j;
					}
				}
			}
			if (el.getAttribute("requires") != null)
			{
				el.disabled = !eval(el.getAttribute("requires"));
			}
		}
	},
	
	_deferSave: function()
	{
		if (this._deferSaveTimer)
		{
			return;
		}
		this._deferSaveTimer = setTimeout(function(obj)
			{
				obj.save();
				obj._deferSaveTimer = null;
			},
			PREFERENCES_DEFER_INTERVAL,
			this);
	},
	
	revertToDefaults: function()
	{
		// Currently does nothing
	},
	
	update: function(el)
	{
		var val = el.type == "checkbox" ? el.checked : el.value;
		if (this._dictionary[_field_name_to_pref_key(el.name)] != val)
		{
			// A bit of magic
			this._dictionary[_field_name_to_pref_key(el.name)] = val;
			eval(el.name + " = " +
				(el.type == "checkbox" ?
					el.checked :
					("'" + el.value + "'")));
			this._deferSave();
		}
	},
	
	_setup: function()
	{
		for (var i = 0; i < this._keys.length; i++)
		{
			// Force preload of relevant keys
			this.preferenceForKey(this._keys[i]);
		}
		this._updatePreferencePane();
	}
};

window.addEventListener("load", function()
	{
		Preferences._setup();
	},
	false);
